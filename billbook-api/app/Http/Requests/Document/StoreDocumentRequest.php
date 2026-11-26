<?php

namespace App\Http\Requests\Document;

class StoreDocumentRequest extends DocumentFormRequest
{
    public function rules(): array
    {
        return $this->sharedRules();
    }
}
