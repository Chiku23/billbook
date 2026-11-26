<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class DocumentLineItemResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        $totals = $this->calculateTotals();

        return [
            'id' => $this->id,
            'itemTemplateId' => $this->item_template_id,
            'sortOrder' => (int) $this->sort_order,
            'name' => $this->name,
            'description' => $this->description ?? '',
            'quantity' => (float) $this->quantity,
            'unitPrice' => (float) $this->unit_price,
            'taxPercent' => (float) $this->tax_percent,
            'discountPercent' => (float) $this->discount_percent,
            'lineSubtotal' => $totals['lineSubtotal'],
            'discountAmount' => $totals['discountAmount'],
            'taxAmount' => $totals['taxAmount'],
            'total' => $totals['total'],
        ];
    }
}
