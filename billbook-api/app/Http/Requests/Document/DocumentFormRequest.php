<?php

namespace App\Http\Requests\Document;

use App\Http\Requests\ApiFormRequest;
use App\Models\Document;
use Illuminate\Validation\Rule;

abstract class DocumentFormRequest extends ApiFormRequest
{
    protected function documentType(): string
    {
        return $this->is('api/quotes*') ? Document::TYPE_QUOTE : Document::TYPE_INVOICE;
    }

    protected function prepareForValidation(): void
    {
        $this->applyAliases([
            'client_id' => 'clientId',
            'client_snapshot' => 'clientSnapshot',
            'issue_date' => 'issueDate',
            'due_date' => 'dueDate',
            'valid_until' => 'validUntil',
            'line_items' => 'lineItems',
        ]);

        if ($this->has('lineItems') && is_array($this->input('lineItems'))) {
            $normalizedItems = [];
            foreach ($this->input('lineItems') as $item) {
                if (! is_array($item)) {
                    $normalizedItems[] = $item;
                    continue;
                }

                $normalizedItems[] = [
                    'id' => $item['id'] ?? null,
                    'itemTemplateId' => $item['itemTemplateId'] ?? $item['item_template_id'] ?? null,
                    'name' => $item['name'] ?? null,
                    'description' => $item['description'] ?? '',
                    'quantity' => $item['quantity'] ?? 1,
                    'unitPrice' => $item['unitPrice'] ?? $item['unit_price'] ?? 0,
                    'taxPercent' => $item['taxPercent'] ?? $item['tax_percent'] ?? 0,
                    'discountPercent' => $item['discountPercent'] ?? $item['discount_percent'] ?? 0,
                ];
            }

            $this->merge(['lineItems' => $normalizedItems]);
        }
    }

    protected function sharedRules(?string $ignoreDocumentId = null): array
    {
        $type = $this->documentType();
        $allowedStatuses = $type === Document::TYPE_QUOTE
            ? Document::QUOTE_STATUSES
            : Document::INVOICE_STATUSES;

        $uniqueNumberRule = Rule::unique('documents', 'number')->where('type', $type);
        if ($ignoreDocumentId !== null) {
            $uniqueNumberRule->ignore($ignoreDocumentId);
        }

        return [
            'number' => ['nullable', 'string', 'max:100', $uniqueNumberRule],
            'status' => ['nullable', Rule::in($allowedStatuses)],
            'clientId' => ['nullable', 'string', 'exists:clients,id'],
            'clientSnapshot' => ['nullable', 'array'],
            'clientSnapshot.name' => ['nullable', 'string', 'max:255'],
            'clientSnapshot.email' => ['nullable', 'string', 'max:255'],
            'clientSnapshot.phone' => ['nullable', 'string', 'max:50'],
            'clientSnapshot.address' => ['nullable', 'string', 'max:2000'],
            'clientSnapshot.taxId' => ['nullable', 'string', 'max:100'],
            'currency' => ['nullable', 'string', 'max:10'],
            'notes' => ['nullable', 'string'],
            'terms' => ['nullable', 'string'],
            'issueDate' => ['nullable', 'date'],
            'dueDate' => ['nullable', 'date'],
            'validUntil' => ['nullable', 'date'],
            'lineItems' => ['sometimes', 'nullable', 'array'],
            'lineItems.*.id' => ['nullable', 'string', 'max:64'],
            'lineItems.*.itemTemplateId' => ['nullable', 'string', 'exists:item_templates,id'],
            'lineItems.*.name' => ['required', 'string', 'max:255'],
            'lineItems.*.description' => ['nullable', 'string'],
            'lineItems.*.quantity' => ['required', 'numeric', 'min:0'],
            'lineItems.*.unitPrice' => ['required', 'numeric', 'min:0'],
            'lineItems.*.taxPercent' => ['nullable', 'numeric', 'min:0', 'max:100'],
            'lineItems.*.discountPercent' => ['nullable', 'numeric', 'min:0', 'max:100'],
        ];
    }
}
