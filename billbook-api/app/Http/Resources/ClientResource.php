<?php

namespace App\Http\Resources;

use App\Services\DocumentCalculator;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ClientResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        $calculator = app(DocumentCalculator::class);
        $totalInvoiced = 0.0;
        $totalPaid = 0.0;
        $totalOutstanding = 0.0;
        $lastInvoiceDate = null;

        if ($this->relationLoaded('invoices')) {
            foreach ($this->invoices as $invoice) {
                $totals = $calculator->documentTotals($invoice->lineItems);
                $grandTotal = $totals['grandTotal'];
                $effectiveStatus = $invoice->effective_status;

                if ($effectiveStatus !== 'draft') {
                    $totalInvoiced += $grandTotal;
                }
                if ($effectiveStatus === 'paid') {
                    $totalPaid += $grandTotal;
                } elseif (in_array($effectiveStatus, ['sent', 'overdue'], true)) {
                    $totalOutstanding += $grandTotal;
                }

                $issueDate = $invoice->issue_date?->format('Y-m-d');
                if ($issueDate && ($lastInvoiceDate === null || $issueDate > $lastInvoiceDate)) {
                    $lastInvoiceDate = $issueDate;
                }
            }
        }

        return [
            'id' => $this->id,
            'name' => $this->name,
            'email' => $this->email ?? '',
            'phone' => $this->phone ?? '',
            'address' => $this->address ?? '',
            'taxId' => $this->tax_id ?? '',
            'initials' => $this->buildInitials((string) $this->name),
            'totalInvoiced' => round($totalInvoiced, 2),
            'totalPaid' => round($totalPaid, 2),
            'totalOutstanding' => round($totalOutstanding, 2),
            'lastInvoiceDate' => $lastInvoiceDate,
            'invoicesCount' => $this->whenCounted('invoices', fn (): int => (int) $this->invoices_count),
            'quotesCount' => $this->whenCounted('quotes', fn (): int => (int) $this->quotes_count),
            'invoices' => DocumentResource::collection($this->whenLoaded('invoices')),
            'quotes' => DocumentResource::collection($this->whenLoaded('quotes')),
            'createdAt' => $this->created_at?->toIso8601String(),
            'updatedAt' => $this->updated_at?->toIso8601String(),
        ];
    }

    private function buildInitials(string $name): string
    {
        $parts = preg_split('/\s+/', trim($name)) ?: [];
        $letters = '';

        foreach (array_slice($parts, 0, 2) as $part) {
            if ($part !== '') {
                $letters .= mb_strtoupper(mb_substr($part, 0, 1));
            }
        }

        return $letters !== '' ? $letters : 'CL';
    }
}
