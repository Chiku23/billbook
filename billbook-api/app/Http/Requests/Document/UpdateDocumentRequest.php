<?php

namespace App\Http\Requests\Document;

use App\Models\Document;

class UpdateDocumentRequest extends DocumentFormRequest
{
    public function rules(): array
    {
        $type = $this->documentType();
        $identifier = (string) ($this->route('invoice') ?? $this->route('quote') ?? $this->route('document') ?? '');

        $existing = $identifier !== ''
            ? Document::query()
                ->ofType($type)
                ->where(function ($query) use ($identifier): void {
                    $query->where('id', $identifier)->orWhere('number', $identifier);
                })
                ->first()
            : null;

        return $this->sharedRules($existing?->id);
    }
}
