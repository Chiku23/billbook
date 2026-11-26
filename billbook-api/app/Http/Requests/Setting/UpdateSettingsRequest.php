<?php

namespace App\Http\Requests\Setting;

use App\Http\Requests\ApiFormRequest;
use Illuminate\Validation\Rule;

class UpdateSettingsRequest extends ApiFormRequest
{
    protected function prepareForValidation(): void
    {
        $this->applyAliases([
            'business_profile' => 'businessProfile',
            'invoice_defaults' => 'invoiceDefaults',
        ]);
    }

    public function rules(): array
    {
        return [
            'theme' => ['sometimes', Rule::in(['light', 'dark'])],
            'businessProfile' => ['sometimes', 'array'],
            'businessProfile.companyName' => ['nullable', 'string', 'max:255'],
            'businessProfile.logoBase64' => ['nullable', 'string'],
            'businessProfile.address' => ['nullable', 'string', 'max:2000'],
            'businessProfile.email' => ['nullable', 'email', 'max:255'],
            'businessProfile.phone' => ['nullable', 'string', 'max:50'],
            'businessProfile.taxId' => ['nullable', 'string', 'max:100'],
            'businessProfile.website' => ['nullable', 'string', 'max:255'],
            'invoiceDefaults' => ['sometimes', 'array'],
            'invoiceDefaults.currency' => ['nullable', 'string', 'max:10'],
            'invoiceDefaults.defaultTaxPercent' => ['nullable', 'numeric', 'min:0', 'max:100'],
            'invoiceDefaults.paymentTermsDays' => ['nullable', 'integer', 'min:0', 'max:365'],
            'invoiceDefaults.defaultNotes' => ['nullable', 'string', 'max:2000'],
            'invoiceDefaults.defaultTerms' => ['nullable', 'string', 'max:2000'],
            'invoiceDefaults.invoicePrefix' => ['nullable', 'string', 'max:20'],
            'invoiceDefaults.quotePrefix' => ['nullable', 'string', 'max:20'],
        ];
    }
}
