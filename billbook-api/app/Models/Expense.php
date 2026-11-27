<?php

namespace App\Models;

use App\Models\Concerns\HasStringId;
use App\Models\Concerns\ResolvesPublicUrl;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Expense extends Model
{
    use HasFactory, HasStringId, ResolvesPublicUrl;

    public const CATEGORIES = [
        'Travel',
        'Software',
        'Office Supplies',
        'Hardware',
        'Marketing',
        'Meals',
        'Utilities',
        'Rent',
        'Insurance',
        'Miscellaneous',
    ];

    protected $fillable = [
        'id',
        'date',
        'category',
        'amount',
        'currency',
        'vendor',
        'notes',
        'receipt_path',
        'receipt_base64',
    ];

    protected function casts(): array
    {
        return [
            'date' => 'date:Y-m-d',
            'amount' => 'float',
        ];
    }

    public function getReceiptUrlAttribute(): ?string
    {
        return $this->resolvePublicStorageUrl($this->receipt_path);
    }

    public function scopeForMonth(Builder $query, ?string $month): Builder
    {
        if (! $month || $month === 'all') {
            return $query;
        }

        if (preg_match('/^(\d{4})-(\d{2})$/', $month, $matches)) {
            return $query->whereYear('date', (int) $matches[1])
                ->whereMonth('date', (int) $matches[2]);
        }

        return $query;
    }

    public function scopeForCategory(Builder $query, ?string $category): Builder
    {
        if (! $category || $category === 'all') {
            return $query;
        }

        return $query->where('category', $category);
    }

    public function scopeSearch(Builder $query, ?string $term): Builder
    {
        $term = trim((string) $term);
        if ($term === '') {
            return $query;
        }

        return $query->where(function (Builder $q) use ($term): void {
            $q->where('vendor', 'like', "%{$term}%")
                ->orWhere('category', 'like', "%{$term}%")
                ->orWhere('notes', 'like', "%{$term}%");
        });
    }
}
