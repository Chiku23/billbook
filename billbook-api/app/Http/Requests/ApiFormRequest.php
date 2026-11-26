<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

abstract class ApiFormRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Normalize snake_case input keys to their camelCase equivalents when absent.
     *
     * @param array<string, string> $aliases Map of snake_case => camelCase keys
     */
    protected function applyAliases(array $aliases): void
    {
        $merged = [];

        foreach ($aliases as $snake => $camel) {
            if (! $this->has($camel) && $this->has($snake)) {
                $merged[$camel] = $this->input($snake);
            }
        }

        if ($merged !== []) {
            $this->merge($merged);
        }
    }
}
