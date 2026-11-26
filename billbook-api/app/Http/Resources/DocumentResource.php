<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class DocumentResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        $totals = $this->calculateTotals();
        $snapshot = is_array($this->client_snapshot) ? $this->client_snapshot : [];

        return [
            'id' => $this->id,
            'type' => $this->type,
            'number' => $this->number,
            'status' => $this->effective_status,
            'rawStatus' => $this->status,
            'isOverdue' => $this->isOverdue(),
            'clientId' => $this->client_id,
            'clientSnapshot' => [
                'name' => (string) ($snapshot['name'] ?? ''),
                'email' => (string) ($snapshot['email'] ?? ''),
                'phone' => (string) ($snapshot['phone'] ?? ''),
                'address' => (string) ($snapshot['address'] ?? ''),
                'taxId' => (string) ($snapshot['taxId'] ?? ''),
            ],
            'client' => $this->whenLoaded('client', fn (): ?array => $this->client ? [
                'id' => $this->client->id,
                'name' => $this->client->name,
                'email' => $this->client->email ?? '',
                'phone' => $this->client->phone ?? '',
                'address' => $this->client->address ?? '',
                'taxId' => $this->client->tax_id ?? '',
            ] : null),
            'lineItems' => DocumentLineItemResource::collection($this->whenLoaded('lineItems')),
            'subtotal' => $totals['subtotal'],
            'discountTotal' => $totals['discountTotal'],
            'taxTotal' => $totals['taxTotal'],
            'grandTotal' => $totals['grandTotal'],
            'currency' => $this->currency,
            'notes' => $this->notes ?? '',
            'terms' => $this->terms ?? '',
            'issueDate' => $this->issue_date?->format('Y-m-d'),
            'dueDate' => $this->due_date?->format('Y-m-d'),
            'validUntil' => $this->valid_until?->format('Y-m-d'),
            'sourceQuoteId' => $this->source_quote_id,
            'convertedInvoiceId' => $this->converted_invoice_id,
            'paidAt' => $this->paid_at?->toIso8601String(),
            'createdAt' => $this->created_at?->toIso8601String(),
            'updatedAt' => $this->updated_at?->toIso8601String(),
        ];
    }
}
