<?php

namespace App\Http\Requests\Backup;

use App\Http\Requests\ApiFormRequest;
use Illuminate\Validation\Rule;

class ImportBackupRequest extends ApiFormRequest
{
    public function rules(): array
    {
        return [
            'mode' => ['nullable', Rule::in(['replace', 'merge'])],
            'file' => ['nullable', 'file', 'mimetypes:application/json,text/plain', 'max:20480'],
            'version' => ['nullable', 'integer'],
            'data' => ['nullable', 'array'],
            'data.invoices' => ['nullable', 'array'],
            'data.quotes' => ['nullable', 'array'],
            'data.clients' => ['nullable', 'array'],
            'data.items' => ['nullable', 'array'],
            'data.expenses' => ['nullable', 'array'],
            'data.settings' => ['nullable', 'array'],
            'invoices' => ['nullable', 'array'],
            'quotes' => ['nullable', 'array'],
            'clients' => ['nullable', 'array'],
            'items' => ['nullable', 'array'],
            'expenses' => ['nullable', 'array'],
            'settings' => ['nullable', 'array'],
        ];
    }
}
