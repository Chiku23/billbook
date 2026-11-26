<?php

namespace App\Models;

use App\Models\Concerns\HasStringId;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class ItemTemplate extends Model
{
    use HasFactory, HasStringId;

    protected $fillable = [
        'id',
        'name',
        'description',
        'default_rate',
        'default_tax_percent',
        'unit',
    ];

    protected function casts(): array
    {
        return [
            'default_rate' => 'float',
            'default_tax_percent' => 'float',
        ];
    }

    public function lineItems(): HasMany
    {
        return $this->hasMany(DocumentLineItem::class, 'item_template_id');
    }

    public function scopeSearch(Builder $query, ?string $term): Builder
    {
        $term = trim((string) $term);
        if ($term === '') {
            return $query;
        }

        return $query->where(function (Builder $q) use ($term): void {
            $q->where('name', 'like', "%{$term}%")
                ->orWhere('description', 'like', "%{$term}%")
                ->orWhere('unit', 'like', "%{$term}%");
        });
    }
}
