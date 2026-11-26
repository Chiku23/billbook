<?php

namespace App\Services;

use App\Http\Resources\ClientResource;
use App\Http\Resources\DocumentResource;
use App\Http\Resources\ExpenseResource;
use App\Http\Resources\ItemTemplateResource;
use App\Http\Resources\SettingResource;
use App\Models\Client;
use App\Models\Document;
use App\Models\DocumentLineItem;
use App\Models\Expense;
use App\Models\ItemTemplate;
use App\Models\Setting;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Symfony\Component\HttpFoundation\StreamedResponse;

class BackupService
{
    public function __construct(
        private readonly DocumentCalculator $calculator,
    ) {}

    public function exportPayload(): array
    {
        $clients = Client::query()->orderBy('created_at')->get();
        $items = ItemTemplate::query()->orderBy('created_at')->get();
        $invoices = Document::query()->invoices()->with('lineItems')->orderBy('issue_date')->get();
        $quotes = Document::query()->quotes()->with('lineItems')->orderBy('issue_date')->get();
        $expenses = Expense::query()->orderBy('date')->get();
        $settings = Setting::current();

        return [
            'version' => 1,
            'exportedAt' => now()->toIso8601String(),
            'data' => [
                'invoices' => DocumentResource::collection($invoices)->resolve(),
                'quotes' => DocumentResource::collection($quotes)->resolve(),
                'clients' => ClientResource::collection($clients)->resolve(),
                'items' => ItemTemplateResource::collection($items)->resolve(),
                'expenses' => ExpenseResource::collection($expenses)->resolve(),
                'settings' => (new SettingResource($settings))->resolve(),
            ],
        ];
    }

    /**
     * Restore a BillBook JSON snapshot into the database.
     *
     * @return array<string, int>
     */
    public function importPayload(array $payload, string $mode = 'replace'): array
    {
        $data = $payload['data'] ?? $payload;

        $clientsData = is_array($data['clients'] ?? null) ? $data['clients'] : [];
        $itemsData = is_array($data['items'] ?? null) ? $data['items'] : [];
        $expensesData = is_array($data['expenses'] ?? null) ? $data['expenses'] : [];
        $settingsData = is_array($data['settings'] ?? null) ? $data['settings'] : null;

        $rawInvoices = is_array($data['invoices'] ?? null) ? $data['invoices'] : [];
        $rawQuotes = is_array($data['quotes'] ?? null) ? $data['quotes'] : [];

        $documentsData = [];
        foreach ($rawInvoices as $doc) {
            if (is_array($doc)) {
                $doc['type'] = ($doc['type'] ?? Document::TYPE_INVOICE) === Document::TYPE_QUOTE
                    ? Document::TYPE_QUOTE
                    : Document::TYPE_INVOICE;
                $documentsData[] = $doc;
            }
        }
        foreach ($rawQuotes as $doc) {
            if (is_array($doc)) {
                $doc['type'] = Document::TYPE_QUOTE;
                $documentsData[] = $doc;
            }
        }

        return DB::transaction(function () use (
            $mode,
            $clientsData,
            $itemsData,
            $documentsData,
            $expensesData,
            $settingsData,
        ): array {
            if ($mode === 'replace') {
                DocumentLineItem::query()->delete();
                Document::query()->delete();
                Expense::query()->delete();
                ItemTemplate::query()->delete();
                Client::query()->delete();
            }

            $validClientIds = Client::query()->pluck('id')->all();
            foreach ($clientsData as $clientRow) {
                if (! is_array($clientRow) || empty($clientRow['name'])) {
                    continue;
                }
                $id = (string) ($clientRow['id'] ?? Str::uuid());
                Client::query()->updateOrCreate(
                    ['id' => $id],
                    [
                        'name' => (string) $clientRow['name'],
                        'email' => $clientRow['email'] ?? '',
                        'phone' => $clientRow['phone'] ?? '',
                        'address' => $clientRow['address'] ?? '',
                        'tax_id' => $clientRow['taxId'] ?? $clientRow['tax_id'] ?? '',
                    ],
                );
                $validClientIds[] = $id;
            }
            $validClientLookup = array_flip($validClientIds);

            $validItemIds = ItemTemplate::query()->pluck('id')->all();
            foreach ($itemsData as $itemRow) {
                if (! is_array($itemRow) || empty($itemRow['name'])) {
                    continue;
                }
                $id = (string) ($itemRow['id'] ?? Str::uuid());
                ItemTemplate::query()->updateOrCreate(
                    ['id' => $id],
                    [
                        'name' => (string) $itemRow['name'],
                        'description' => $itemRow['description'] ?? '',
                        'default_rate' => (float) ($itemRow['defaultRate'] ?? $itemRow['default_rate'] ?? 0),
                        'default_tax_percent' => (float) ($itemRow['defaultTaxPercent'] ?? $itemRow['default_tax_percent'] ?? 0),
                        'unit' => (string) ($itemRow['unit'] ?? 'unit'),
                    ],
                );
                $validItemIds[] = $id;
            }
            $validItemLookup = array_flip($validItemIds);

            $importedInvoices = 0;
            $importedQuotes = 0;

            foreach ($documentsData as $docRow) {
                if (empty($docRow['number'])) {
                    continue;
                }

                $type = $docRow['type'] === Document::TYPE_QUOTE
                    ? Document::TYPE_QUOTE
                    : Document::TYPE_INVOICE;

                $id = (string) ($docRow['id'] ?? Str::uuid());
                $rawClientId = $docRow['clientId'] ?? $docRow['client_id'] ?? null;
                $clientId = ($rawClientId && isset($validClientLookup[(string) $rawClientId]))
                    ? (string) $rawClientId
                    : null;

                $snapshot = $docRow['clientSnapshot'] ?? $docRow['client_snapshot'] ?? [];
                $status = (string) ($docRow['status'] ?? 'draft');
                $issueDate = ! empty($docRow['issueDate'] ?? $docRow['issue_date'] ?? null)
                    ? Carbon::parse($docRow['issueDate'] ?? $docRow['issue_date'])->toDateString()
                    : now()->toDateString();

                $dueDateRaw = $docRow['dueDate'] ?? $docRow['due_date'] ?? null;
                $validUntilRaw = $docRow['validUntil'] ?? $docRow['valid_until'] ?? null;

                $document = Document::query()->updateOrCreate(
                    ['id' => $id],
                    [
                        'type' => $type,
                        'number' => (string) $docRow['number'],
                        'status' => $status,
                        'client_id' => $clientId,
                        'client_snapshot' => [
                            'name' => (string) ($snapshot['name'] ?? ''),
                            'email' => (string) ($snapshot['email'] ?? ''),
                            'phone' => (string) ($snapshot['phone'] ?? ''),
                            'address' => (string) ($snapshot['address'] ?? ''),
                            'taxId' => (string) ($snapshot['taxId'] ?? $snapshot['tax_id'] ?? ''),
                        ],
                        'currency' => (string) ($docRow['currency'] ?? 'INR'),
                        'notes' => (string) ($docRow['notes'] ?? ''),
                        'terms' => (string) ($docRow['terms'] ?? ''),
                        'issue_date' => $issueDate,
                        'due_date' => $dueDateRaw ? Carbon::parse($dueDateRaw)->toDateString() : null,
                        'valid_until' => $validUntilRaw ? Carbon::parse($validUntilRaw)->toDateString() : null,
                        'source_quote_id' => $docRow['sourceQuoteId'] ?? $docRow['source_quote_id'] ?? null,
                        'converted_invoice_id' => $docRow['convertedInvoiceId'] ?? $docRow['converted_invoice_id'] ?? null,
                        'paid_at' => $status === 'paid' ? now() : null,
                    ],
                );

                $document->lineItems()->delete();
                $lineItems = is_array($docRow['lineItems'] ?? $docRow['line_items'] ?? null)
                    ? ($docRow['lineItems'] ?? $docRow['line_items'])
                    : [];

                foreach (array_values($lineItems) as $index => $lineRow) {
                    if (! is_array($lineRow)) {
                        continue;
                    }
                    $rawTemplateId = $lineRow['itemTemplateId'] ?? $lineRow['item_template_id'] ?? null;
                    $templateId = ($rawTemplateId && isset($validItemLookup[(string) $rawTemplateId]))
                        ? (string) $rawTemplateId
                        : null;

                    DocumentLineItem::query()->create([
                        'id' => (string) ($lineRow['id'] ?? Str::uuid()),
                        'document_id' => $document->id,
                        'item_template_id' => $templateId,
                        'sort_order' => $index,
                        'name' => (string) ($lineRow['name'] ?? ''),
                        'description' => (string) ($lineRow['description'] ?? ''),
                        'quantity' => (float) ($lineRow['quantity'] ?? 1),
                        'unit_price' => (float) ($lineRow['unitPrice'] ?? $lineRow['unit_price'] ?? 0),
                        'tax_percent' => (float) ($lineRow['taxPercent'] ?? $lineRow['tax_percent'] ?? 0),
                        'discount_percent' => (float) ($lineRow['discountPercent'] ?? $lineRow['discount_percent'] ?? 0),
                    ]);
                }

                if ($type === Document::TYPE_QUOTE) {
                    $importedQuotes++;
                } else {
                    $importedInvoices++;
                }
            }

            foreach ($expensesData as $expenseRow) {
                if (! is_array($expenseRow)) {
                    continue;
                }
                $id = (string) ($expenseRow['id'] ?? Str::uuid());
                $dateRaw = $expenseRow['date'] ?? now()->toDateString();

                Expense::query()->updateOrCreate(
                    ['id' => $id],
                    [
                        'date' => Carbon::parse($dateRaw)->toDateString(),
                        'category' => (string) ($expenseRow['category'] ?? 'Miscellaneous'),
                        'amount' => (float) ($expenseRow['amount'] ?? 0),
                        'currency' => (string) ($expenseRow['currency'] ?? 'INR'),
                        'vendor' => (string) ($expenseRow['vendor'] ?? ''),
                        'notes' => (string) ($expenseRow['notes'] ?? ''),
                        'receipt_base64' => $expenseRow['receiptBase64'] ?? $expenseRow['receipt_base64'] ?? null,
                    ],
                );
            }

            if ($settingsData !== null) {
                $setting = Setting::current();
                $profile = $settingsData['businessProfile'] ?? $settingsData['business_profile'] ?? [];
                $defaults = $settingsData['invoiceDefaults'] ?? $settingsData['invoice_defaults'] ?? [];

                $setting->update([
                    'theme' => ($settingsData['theme'] ?? $setting->theme) === 'dark' ? 'dark' : 'light',
                    'company_name' => (string) ($profile['companyName'] ?? $profile['company_name'] ?? $setting->company_name),
                    'logo_base64' => $profile['logoBase64'] ?? $profile['logo_base64'] ?? $setting->logo_base64,
                    'address' => (string) ($profile['address'] ?? $setting->address),
                    'email' => (string) ($profile['email'] ?? $setting->email),
                    'phone' => (string) ($profile['phone'] ?? $setting->phone),
                    'tax_id' => (string) ($profile['taxId'] ?? $profile['tax_id'] ?? $setting->tax_id),
                    'website' => (string) ($profile['website'] ?? $setting->website),
                    'default_currency' => (string) ($defaults['currency'] ?? $setting->default_currency),
                    'default_tax_percent' => (float) ($defaults['defaultTaxPercent'] ?? $defaults['default_tax_percent'] ?? $setting->default_tax_percent),
                    'payment_terms_days' => (int) ($defaults['paymentTermsDays'] ?? $defaults['payment_terms_days'] ?? $setting->payment_terms_days),
                    'default_notes' => (string) ($defaults['defaultNotes'] ?? $defaults['default_notes'] ?? $setting->default_notes),
                    'default_terms' => (string) ($defaults['defaultTerms'] ?? $defaults['default_terms'] ?? $setting->default_terms),
                    'invoice_prefix' => (string) ($defaults['invoicePrefix'] ?? $defaults['invoice_prefix'] ?? $setting->invoice_prefix),
                    'quote_prefix' => (string) ($defaults['quotePrefix'] ?? $defaults['quote_prefix'] ?? $setting->quote_prefix),
                ]);
            }

            return [
                'clients' => count($clientsData),
                'items' => count($itemsData),
                'invoices' => $importedInvoices,
                'quotes' => $importedQuotes,
                'expenses' => count($expensesData),
            ];
        });
    }

    public function streamInvoicesCsv(?string $status = null, ?string $search = null): StreamedResponse
    {
        $filename = sprintf('billbook-invoices-%s.csv', now()->format('Y-m-d'));

        return response()->streamDownload(function () use ($status, $search): void {
            $handle = fopen('php://output', 'wb');
            fwrite($handle, "\xEF\xBB\xBF");
            fputcsv($handle, [
                'Invoice Number',
                'Client Name',
                'Client Email',
                'Issue Date',
                'Due Date',
                'Status',
                'Currency',
                'Subtotal',
                'Discount Total',
                'Tax Total',
                'Grand Total',
            ]);

            Document::query()
                ->invoices()
                ->with(['client', 'lineItems'])
                ->withStatusFilter(Document::TYPE_INVOICE, $status)
                ->search($search)
                ->orderByDesc('issue_date')
                ->chunk(100, function ($invoices) use ($handle): void {
                    foreach ($invoices as $invoice) {
                        $totals = $this->calculator->documentTotals($invoice->lineItems);
                        $clientName = $invoice->client?->name ?: ($invoice->client_snapshot['name'] ?? '');
                        $clientEmail = $invoice->client?->email ?: ($invoice->client_snapshot['email'] ?? '');

                        fputcsv($handle, [
                            $invoice->number,
                            $clientName,
                            $clientEmail,
                            $invoice->issue_date?->format('Y-m-d'),
                            $invoice->due_date?->format('Y-m-d'),
                            $invoice->effective_status,
                            $invoice->currency,
                            number_format($totals['subtotal'], 2, '.', ''),
                            number_format($totals['discountTotal'], 2, '.', ''),
                            number_format($totals['taxTotal'], 2, '.', ''),
                            number_format($totals['grandTotal'], 2, '.', ''),
                        ]);
                    }
                });

            fclose($handle);
        }, $filename, [
            'Content-Type' => 'text/csv; charset=UTF-8',
        ]);
    }

    public function streamExpensesCsv(?string $month = null, ?string $category = null, ?string $search = null): StreamedResponse
    {
        $filename = sprintf('billbook-expenses-%s.csv', now()->format('Y-m-d'));

        return response()->streamDownload(function () use ($month, $category, $search): void {
            $handle = fopen('php://output', 'wb');
            fwrite($handle, "\xEF\xBB\xBF");
            fputcsv($handle, [
                'Date',
                'Category',
                'Vendor',
                'Currency',
                'Amount',
                'Notes',
            ]);

            Expense::query()
                ->forMonth($month)
                ->forCategory($category)
                ->search($search)
                ->orderByDesc('date')
                ->chunk(100, function ($expenses) use ($handle): void {
                    foreach ($expenses as $expense) {
                        fputcsv($handle, [
                            $expense->date?->format('Y-m-d'),
                            $expense->category,
                            $expense->vendor,
                            $expense->currency,
                            number_format((float) $expense->amount, 2, '.', ''),
                            $expense->notes ?? '',
                        ]);
                    }
                });

            fclose($handle);
        }, $filename, [
            'Content-Type' => 'text/csv; charset=UTF-8',
        ]);
    }
}
