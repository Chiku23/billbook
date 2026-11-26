<?php

namespace App\Services;

use App\Models\DocumentLineItem;

class DocumentCalculator
{
    /**
     * Compute subtotal, discount, tax, and total for a single line item.
     *
     * @return array{lineSubtotal: float, discountAmount: float, taxableAmount: float, taxAmount: float, total: float}
     */
    public function lineItemTotals(array|DocumentLineItem $item): array
    {
        $quantity = (float) ($item instanceof DocumentLineItem ? $item->quantity : ($item['quantity'] ?? 0));
        $unitPrice = (float) ($item instanceof DocumentLineItem ? $item->unit_price : ($item['unit_price'] ?? $item['unitPrice'] ?? 0));
        $taxPercent = (float) ($item instanceof DocumentLineItem ? $item->tax_percent : ($item['tax_percent'] ?? $item['taxPercent'] ?? 0));
        $discountPercent = (float) ($item instanceof DocumentLineItem ? $item->discount_percent : ($item['discount_percent'] ?? $item['discountPercent'] ?? 0));

        $lineSubtotal = round($quantity * $unitPrice, 2);
        $discountAmount = round($lineSubtotal * ($discountPercent / 100), 2);
        $taxableAmount = round($lineSubtotal - $discountAmount, 2);
        $taxAmount = round($taxableAmount * ($taxPercent / 100), 2);
        $total = round($taxableAmount + $taxAmount, 2);

        return [
            'lineSubtotal' => $lineSubtotal,
            'discountAmount' => $discountAmount,
            'taxableAmount' => $taxableAmount,
            'taxAmount' => $taxAmount,
            'total' => $total,
        ];
    }

    /**
     * Aggregate totals across all line items of a document.
     *
     * @param iterable<int, array|DocumentLineItem> $lineItems
     * @return array{subtotal: float, discountTotal: float, taxTotal: float, grandTotal: float}
     */
    public function documentTotals(iterable $lineItems): array
    {
        $subtotal = 0.0;
        $discountTotal = 0.0;
        $taxTotal = 0.0;
        $grandTotal = 0.0;

        foreach ($lineItems as $item) {
            $computed = $this->lineItemTotals($item);
            $subtotal += $computed['lineSubtotal'];
            $discountTotal += $computed['discountAmount'];
            $taxTotal += $computed['taxAmount'];
            $grandTotal += $computed['total'];
        }

        return [
            'subtotal' => round($subtotal, 2),
            'discountTotal' => round($discountTotal, 2),
            'taxTotal' => round($taxTotal, 2),
            'grandTotal' => round($grandTotal, 2),
        ];
    }
}
