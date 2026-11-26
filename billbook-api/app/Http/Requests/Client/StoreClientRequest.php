<?php

namespace App\Http\Requests\Client;

use App\Http\Requests\ApiFormRequest;

class StoreClientRequest extends ApiFormRequest
{
    protected function prepareForValidation(): void
    {
        $this->applyAliases([
            'tax_id' => 'taxId',
        ]);
    }

    public function rules(): array
    {
        $nameRule = $this->isMethod('post') ? ['required', 'string', 'max:255'] : ['sometimes', 'required', 'string', 'max:255'];

        return [
            'name' => $nameRule,
            'email' => ['nullable', 'email', 'max:255'],
            'phone' => ['nullable', 'string', 'max:50'],
            'address' => ['nullable', 'string', 'max:2000'],
            'taxId' => ['nullable', 'string', 'max:100'],
        ];
    }
}
