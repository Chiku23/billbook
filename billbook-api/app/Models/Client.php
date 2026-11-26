<?php

namespace App\Models;

use App\Models\Concerns\HasStringId;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Client extends Model
{
    use HasFactory, HasStringId;

    protected $fillable = [
        'id',
        'name',
        'email',
        'phone',
        'address',
        'tax_id',
    ];

    public function documents(): HasMany
    {
        return $this->hasMany(Document::class, 'client_id');
    }

    public function invoices(): HasMany
    {
        return $this->documents()->where('type', Document::TYPE_INVOICE);
    }

    public function quotes(): HasMany
    {
        return $this->documents()->where('type', Document::TYPE_QUOTE);
    }

    public function scopeSearch(Builder $query, ?string $term): Builder
    {
        $term = trim((string) $term);
        if ($term === '') {
            return $query;
        }

        return $query->where(function (Builder $q) use ($term): void {
            $q->where('name', 'like', "%{$term}%")
                ->orWhere('email', 'like', "%{$term}%")
                ->orWhere('phone', 'like', "%{$term}%")
                ->orWhere('tax_id', 'like', "%{$term}%");
        });
    }

    /**
     * Build a client snapshot payload for embedding on documents.
     *
     * @return array{name: string, email: string, phone: string, address: string, taxId: string}
     */
    public function toSnapshot(): array
    {
        return [
            'name' => $this->name ?? '',
            'email' => $this->email ?? '',
            'phone' => $this->phone ?? '',
            'address' => $this->address ?? '',
            'taxId' => $this->tax_id ?? '',
        ];
    }
}
