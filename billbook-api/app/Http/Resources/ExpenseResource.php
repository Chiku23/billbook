<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ExpenseResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'date' => $this->date?->format('Y-m-d'),
            'category' => $this->category,
            'amount' => (float) $this->amount,
            'currency' => $this->currency,
            'vendor' => $this->vendor,
            'notes' => $this->notes ?? '',
            'receiptBase64' => $this->receipt_base64,
            'receiptUrl' => $this->receipt_url,
            'createdAt' => $this->created_at?->toIso8601String(),
            'updatedAt' => $this->updated_at?->toIso8601String(),
        ];
    }
}
