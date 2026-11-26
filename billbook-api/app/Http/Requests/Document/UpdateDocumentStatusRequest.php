<?php

namespace App\Http\Requests\Document;

use App\Http\Requests\ApiFormRequest;
use App\Models\Document;
use Illuminate\Validation\Rule;

class UpdateDocumentStatusRequest extends ApiFormRequest
{
    public function rules(): array
    {
        $allowedStatuses = $this->is('api/quotes*')
            ? Document::QUOTE_STATUSES
            : Document::INVOICE_STATUSES;

        return [
            'status' => ['required', Rule::in($allowedStatuses)],
        ];
    }
}
