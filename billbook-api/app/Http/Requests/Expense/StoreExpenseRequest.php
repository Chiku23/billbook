<?php

namespace App\Http\Requests\Expense;

use App\Http\Requests\ApiFormRequest;

class StoreExpenseRequest extends ApiFormRequest
{
    protected function prepareForValidation(): void
    {
        $this->applyAliases([
            'receipt_base64' => 'receiptBase64',
            'remove_receipt' => 'removeReceipt',
        ]);
    }

    public function rules(): array
    {
        $isCreate = $this->isMethod('post');

        return [
            'date' => [$isCreate ? 'required' : 'sometimes', 'date'],
            'category' => [$isCreate ? 'required' : 'sometimes', 'string', 'max:100'],
            'amount' => [$isCreate ? 'required' : 'sometimes', 'numeric', 'min:0'],
            'currency' => ['nullable', 'string', 'max:10'],
            'vendor' => [$isCreate ? 'required' : 'sometimes', 'string', 'max:255'],
            'notes' => ['nullable', 'string', 'max:2000'],
            'receiptBase64' => ['nullable', 'string'],
            'receipt' => ['nullable', 'file', 'mimes:jpg,jpeg,png,webp,pdf', 'max:5120'],
            'removeReceipt' => ['nullable', 'boolean'],
        ];
    }
}
