<?php

namespace App\Http\Requests\Setting;

use App\Http\Requests\ApiFormRequest;

class UpdateBusinessProfileRequest extends ApiFormRequest
{
    protected function prepareForValidation(): void
    {
        $this->applyAliases([
            'company_name' => 'companyName',
            'logo_base64' => 'logoBase64',
            'tax_id' => 'taxId',
            'remove_logo' => 'removeLogo',
        ]);
    }

    public function rules(): array
    {
        return [
            'companyName' => ['nullable', 'string', 'max:255'],
            'logoBase64' => ['nullable', 'string'],
            'logo' => ['nullable', 'file', 'mimes:jpg,jpeg,png,webp,svg', 'max:5120'],
            'removeLogo' => ['nullable', 'boolean'],
            'address' => ['nullable', 'string', 'max:2000'],
            'email' => ['nullable', 'email', 'max:255'],
            'phone' => ['nullable', 'string', 'max:50'],
            'taxId' => ['nullable', 'string', 'max:100'],
            'website' => ['nullable', 'string', 'max:255'],
        ];
    }
}
