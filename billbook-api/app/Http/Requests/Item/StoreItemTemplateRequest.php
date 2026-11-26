<?php

namespace App\Http\Requests\Item;

use App\Http\Requests\ApiFormRequest;

class StoreItemTemplateRequest extends ApiFormRequest
{
    protected function prepareForValidation(): void
    {
        $this->applyAliases([
            'default_rate' => 'defaultRate',
            'default_tax_percent' => 'defaultTaxPercent',
        ]);
    }

    public function rules(): array
    {
        $isCreate = $this->isMethod('post');

        return [
            'name' => [$isCreate ? 'required' : 'sometimes', 'required', 'string', 'max:255'],
            'description' => ['nullable', 'string', 'max:2000'],
            'defaultRate' => [$isCreate ? 'required' : 'sometimes', 'numeric', 'min:0'],
            'defaultTaxPercent' => ['nullable', 'numeric', 'min:0', 'max:100'],
            'unit' => ['nullable', 'string', 'max:50'],
        ];
    }
}
