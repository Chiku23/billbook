<?php

namespace App\Http\Requests\Setting;

use App\Http\Requests\ApiFormRequest;
use Illuminate\Validation\Rule;

class UpdateThemeRequest extends ApiFormRequest
{
    public function rules(): array
    {
        return [
            'theme' => ['required', Rule::in(['light', 'dark'])],
        ];
    }
}
