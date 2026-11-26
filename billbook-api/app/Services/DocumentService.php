<?php

namespace App\Services;

use App\Models\Client;
use App\Models\Document;
use App\Models\DocumentLineItem;
use App\Models\Setting;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use InvalidArgumentException;

class DocumentService
{
    public function generateNextNumber(string $type): string
    {
        $settings = Setting::current();
        $prefix = $type === Document::TYPE_QUOTE
            ? ($settings->quote_prefix ?: 'QT')
            : ($settings->invoice_prefix ?: 'INV');

        $pattern = '/^' . preg_quote($prefix, '/') . '-?(\d+)$/i';
        $maxSequence = 0;

        $existingNumbers = Document::query()
            ->ofType($type)
            ->pluck('number');

        foreach ($existingNumbers as $number) {
            if (preg_match($pattern, (string) $number, $matches)) {
                $sequence = (int) $matches[1];
                if ($sequence > $maxSequence) {
                    $maxSequence = $sequence;
                }
            }
        }

        $nextSequence = $maxSequence + 1;
        do {
            $candidate = sprintf('%s-%04d', $prefix, $nextSequence);
            $exists = Document::query()
                ->ofType($type)
                ->where('number', $candidate)
                ->exists();
            $nextSequence++;
        } while ($exists);

        return $candidate;
    }

    public function createDocument(string $type, array $data): Document
    {
        return DB::transaction(function () use ($type, $data): Document {
            $settings = Setting::current();
            $issueDate = ! empty($data['issueDate'])
                ? Carbon::parse($data['issueDate'])->toDateString()
                : now()->toDateString();

            $status = $data['status'] ?? 'draft';
            $number = ! empty($data['number'])
                ? trim((string) $data['number'])
                : $this->generateNextNumber($type);

            $dueDate = null;
            $validUntil = null;

            if ($type === Document::TYPE_INVOICE) {
                $dueDate = array_key_exists('dueDate', $data) && $data['dueDate'] !== null && $data['dueDate'] !== ''
                    ? Carbon::parse($data['dueDate'])->toDateString()
                    : Carbon::parse($issueDate)->addDays($settings->payment_terms_days ?: 30)->toDateString();
            } else {
                $validUntil = array_key_exists('validUntil', $data) && $data['validUntil'] !== null && $data['validUntil'] !== ''
                    ? Carbon::parse($data['validUntil'])->toDateString()
                    : Carbon::parse($issueDate)->addDays(15)->toDateString();
            }

            $clientId = $data['clientId'] ?? null;
            $clientSnapshot = $this->resolveClientSnapshot($clientId, $data['clientSnapshot'] ?? null);

            $document = Document::query()->create([
                'id' => ! empty($data['id']) ? (string) $data['id'] : (string) Str::uuid(),
                'type' => $type,
                'number' => $number,
                'status' => $status,
                'client_id' => $clientId,
                'client_snapshot' => $clientSnapshot,
                'currency' => $data['currency'] ?? $settings->default_currency ?? 'INR',
                'notes' => array_key_exists('notes', $data) ? ($data['notes'] ?? '') : ($settings->default_notes ?? ''),
                'terms' => array_key_exists('terms', $data) ? ($data['terms'] ?? '') : ($settings->default_terms ?? ''),
                'issue_date' => $issueDate,
                'due_date' => $dueDate,
                'valid_until' => $validUntil,
                'source_quote_id' => $data['sourceQuoteId'] ?? null,
                'converted_invoice_id' => $data['convertedInvoiceId'] ?? null,
                'paid_at' => $status === 'paid' ? now() : null,
            ]);

            $this->syncLineItems($document, $data['lineItems'] ?? []);

            return $document->load(['client', 'lineItems']);
        });
    }

    public function updateDocument(Document $document, array $data): Document
    {
        return DB::transaction(function () use ($document, $data): Document {
            $updates = [];

            if (array_key_exists('number', $data) && $data['number'] !== null && $data['number'] !== '') {
                $updates['number'] = trim((string) $data['number']);
            }

            if (array_key_exists('status', $data) && $data['status'] !== null) {
                $updates['status'] = $data['status'];
                if ($data['status'] === 'paid' && $document->paid_at === null) {
                    $updates['paid_at'] = now();
                } elseif ($data['status'] !== 'paid') {
                    $updates['paid_at'] = null;
                }
            }

            if (array_key_exists('clientId', $data)) {
                $updates['client_id'] = $data['clientId'];
            }

            if (array_key_exists('clientSnapshot', $data)) {
                $updates['client_snapshot'] = $this->resolveClientSnapshot(
                    $updates['client_id'] ?? $document->client_id,
                    $data['clientSnapshot'],
                );
            } elseif (array_key_exists('clientId', $data) && $data['clientId'] !== $document->client_id) {
                $updates['client_snapshot'] = $this->resolveClientSnapshot($data['clientId'], null);
            }

            if (array_key_exists('currency', $data) && $data['currency'] !== null) {
                $updates['currency'] = $data['currency'];
            }

            if (array_key_exists('notes', $data)) {
                $updates['notes'] = $data['notes'] ?? '';
            }

            if (array_key_exists('terms', $data)) {
                $updates['terms'] = $data['terms'] ?? '';
            }

            if (array_key_exists('issueDate', $data) && $data['issueDate'] !== null) {
                $updates['issue_date'] = Carbon::parse($data['issueDate'])->toDateString();
            }

            if (array_key_exists('dueDate', $data)) {
                $updates['due_date'] = $data['dueDate'] ? Carbon::parse($data['dueDate'])->toDateString() : null;
            }

            if (array_key_exists('validUntil', $data)) {
                $updates['valid_until'] = $data['validUntil'] ? Carbon::parse($data['validUntil'])->toDateString() : null;
            }

            if ($updates !== []) {
                $document->update($updates);
            }

            if (array_key_exists('lineItems', $data)) {
                $this->syncLineItems($document, $data['lineItems'] ?? []);
            }

            return $document->fresh(['client', 'lineItems']);
        });
    }

    public function updateStatus(Document $document, string $status): Document
    {
        $updates = ['status' => $status];

        if ($document->type === Document::TYPE_INVOICE) {
            if ($status === 'paid' && $document->paid_at === null) {
                $updates['paid_at'] = now();
            } elseif ($status !== 'paid') {
                $updates['paid_at'] = null;
            }
        }

        $document->update($updates);

        return $document->fresh(['client', 'lineItems']);
    }

    public function duplicateDocument(Document $document): Document
    {
        $document->loadMissing('lineItems');

        $lineItems = $document->lineItems->map(fn (DocumentLineItem $item): array => [
            'itemTemplateId' => $item->item_template_id,
            'name' => $item->name,
            'description' => $item->description ?? '',
            'quantity' => $item->quantity,
            'unitPrice' => $item->unit_price,
            'taxPercent' => $item->tax_percent,
            'discountPercent' => $item->discount_percent,
        ])->all();

        return $this->createDocument($document->type, [
            'status' => 'draft',
            'clientId' => $document->client_id,
            'clientSnapshot' => $document->client_snapshot,
            'currency' => $document->currency,
            'notes' => $document->notes ?? '',
            'terms' => $document->terms ?? '',
            'issueDate' => now()->toDateString(),
            'lineItems' => $lineItems,
        ]);
    }

    public function convertQuoteToInvoice(Document $quote): Document
    {
        if ($quote->type !== Document::TYPE_QUOTE) {
            throw new InvalidArgumentException('Only quotes can be converted to invoices.');
        }

        return DB::transaction(function () use ($quote): Document {
            $quote->loadMissing('lineItems');

            $lineItems = $quote->lineItems->map(fn (DocumentLineItem $item): array => [
                'itemTemplateId' => $item->item_template_id,
                'name' => $item->name,
                'description' => $item->description ?? '',
                'quantity' => $item->quantity,
                'unitPrice' => $item->unit_price,
                'taxPercent' => $item->tax_percent,
                'discountPercent' => $item->discount_percent,
            ])->all();

            $invoice = $this->createDocument(Document::TYPE_INVOICE, [
                'status' => 'draft',
                'clientId' => $quote->client_id,
                'clientSnapshot' => $quote->client_snapshot,
                'currency' => $quote->currency,
                'notes' => $quote->notes ?? '',
                'terms' => $quote->terms ?? '',
                'issueDate' => now()->toDateString(),
                'sourceQuoteId' => $quote->id,
                'lineItems' => $lineItems,
            ]);

            $quoteUpdates = ['converted_invoice_id' => $invoice->id];
            if (in_array($quote->status, ['draft', 'sent'], true)) {
                $quoteUpdates['status'] = 'accepted';
            }
            $quote->update($quoteUpdates);

            return $invoice->load(['client', 'lineItems']);
        });
    }

    /**
     * Compute tab badge counts per status for a given document type.
     *
     * @return array<string, int>
     */
    public function statusCounts(string $type): array
    {
        if ($type === Document::TYPE_INVOICE) {
            $invoices = Document::query()
                ->invoices()
                ->select(['id', 'type', 'status', 'due_date'])
                ->get();

            $counts = [
                'all' => $invoices->count(),
                'draft' => 0,
                'sent' => 0,
                'paid' => 0,
                'overdue' => 0,
            ];

            foreach ($invoices as $invoice) {
                $effective = $invoice->effective_status;
                if (array_key_exists($effective, $counts)) {
                    $counts[$effective]++;
                }
            }

            return $counts;
        }

        $grouped = Document::query()
            ->quotes()
            ->selectRaw('status, COUNT(*) as total')
            ->groupBy('status')
            ->pluck('total', 'status');

        $draft = (int) ($grouped['draft'] ?? 0);
        $sent = (int) ($grouped['sent'] ?? 0);
        $accepted = (int) ($grouped['accepted'] ?? 0);
        $declined = (int) ($grouped['declined'] ?? 0);

        return [
            'all' => $draft + $sent + $accepted + $declined,
            'draft' => $draft,
            'sent' => $sent,
            'accepted' => $accepted,
            'declined' => $declined,
        ];
    }

    /**
     * @return array{name: string, email: string, phone: string, address: string, taxId: string}
     */
    private function resolveClientSnapshot(?string $clientId, ?array $provided): array
    {
        $base = [
            'name' => '',
            'email' => '',
            'phone' => '',
            'address' => '',
            'taxId' => '',
        ];

        if ($clientId) {
            $client = Client::query()->find($clientId);
            if ($client) {
                $base = $client->toSnapshot();
            }
        }

        if (! is_array($provided) || $provided === []) {
            return $base;
        }

        return [
            'name' => (string) ($provided['name'] ?? $base['name']),
            'email' => (string) ($provided['email'] ?? $base['email']),
            'phone' => (string) ($provided['phone'] ?? $base['phone']),
            'address' => (string) ($provided['address'] ?? $base['address']),
            'taxId' => (string) ($provided['taxId'] ?? $provided['tax_id'] ?? $base['taxId']),
        ];
    }

    /**
     * Replace the document's line items while preserving ordering and safe IDs.
     *
     * @param array<int, array<string, mixed>> $items
     */
    private function syncLineItems(Document $document, array $items): void
    {
        $existingIds = $document->lineItems()->pluck('id')->all();
        $document->lineItems()->delete();

        $usedIds = [];
        foreach (array_values($items) as $index => $item) {
            $candidateId = isset($item['id']) ? (string) $item['id'] : null;
            $canReuseId = $candidateId !== null
                && $candidateId !== ''
                && ! in_array($candidateId, $usedIds, true)
                && (in_array($candidateId, $existingIds, true)
                    || ! DocumentLineItem::query()->whereKey($candidateId)->exists());

            $lineId = $canReuseId ? $candidateId : (string) Str::uuid();
            $usedIds[] = $lineId;

            $templateId = $item['itemTemplateId'] ?? $item['item_template_id'] ?? null;
            if ($templateId === '') {
                $templateId = null;
            }

            DocumentLineItem::query()->create([
                'id' => $lineId,
                'document_id' => $document->id,
                'item_template_id' => $templateId,
                'sort_order' => $index,
                'name' => (string) ($item['name'] ?? ''),
                'description' => (string) ($item['description'] ?? ''),
                'quantity' => (float) ($item['quantity'] ?? 1),
                'unit_price' => (float) ($item['unitPrice'] ?? $item['unit_price'] ?? 0),
                'tax_percent' => (float) ($item['taxPercent'] ?? $item['tax_percent'] ?? 0),
                'discount_percent' => (float) ($item['discountPercent'] ?? $item['discount_percent'] ?? 0),
            ]);
        }
    }
}
