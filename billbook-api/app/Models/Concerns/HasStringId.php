<?php

namespace App\Models\Concerns;

use Illuminate\Database\Eloquent\Concerns\HasUniqueStringIds;
use Illuminate\Support\Str;

trait HasStringId
{
    use HasUniqueStringIds;

    public function newUniqueId(): string
    {
        return (string) Str::uuid();
    }

    protected function isValidUniqueId($value): bool
    {
        return is_string($value) && $value !== '' && strlen($value) <= 64;
    }
}
