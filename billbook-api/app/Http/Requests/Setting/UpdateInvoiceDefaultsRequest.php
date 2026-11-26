<?php

namespace App\Http\Requests\Setting;

use App\Http\Requests\ApiFormRequest;

class UpdateInvoiceDefaultsRequest extends ApiFormRequest
{
    protected function prepareForValidation(): void
    {
        $this->applyAliases([
            'default_currency' => 'currency',
            'default_tax_percent' => 'defaultTaxPercent',
            'payment_terms_days' => 'paymentTermsDays',
            'default_notes' => 'defaultNotes',
            'default_terms' => 'defaultTerms',
            'invoice_prefix' => 'invoicePrefix',
            'quote_prefix' => 'quotePrefix',
        ]);
    }

    public function rules(): array
    {
        return [
            'currency' => ['sometimes', 'required', 'string', 'max:10'],
            'defaultTaxPercent' => ['sometimes', 'numeric', 'min:0', 'max:100'],
            'paymentTermsDays' => ['sometimes', 'integer', 'min:0', 'max:365'],
            'defaultNotes' => ['nullable', 'string', 'max:2000'],
            'defaultTerms' => ['nullable', 'string', 'max:2000'],
            'invoicePrefix' => ['sometimes', 'required', 'string', 'max:20'],
            'quotePrefix' => ['sometimes', 'required', 'string', 'max:20'],
        ];
    }
}
