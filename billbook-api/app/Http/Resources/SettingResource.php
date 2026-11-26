<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class SettingResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'theme' => $this->theme ?? 'light',
            'businessProfile' => [
                'companyName' => $this->company_name ?? '',
                'logoBase64' => $this->logo_base64,
                'logoUrl' => $this->logo_url,
                'address' => $this->address ?? '',
                'email' => $this->email ?? '',
                'phone' => $this->phone ?? '',
                'taxId' => $this->tax_id ?? '',
                'website' => $this->website ?? '',
            ],
            'invoiceDefaults' => [
                'currency' => $this->default_currency ?? 'INR',
                'defaultTaxPercent' => (float) ($this->default_tax_percent ?? 18),
                'paymentTermsDays' => (int) ($this->payment_terms_days ?? 30),
                'defaultNotes' => $this->default_notes ?? '',
                'defaultTerms' => $this->default_terms ?? '',
                'invoicePrefix' => $this->invoice_prefix ?? 'INV',
                'quotePrefix' => $this->quote_prefix ?? 'QT',
            ],
            'updatedAt' => $this->updated_at?->toIso8601String(),
        ];
    }
}
