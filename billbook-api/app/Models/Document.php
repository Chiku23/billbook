<?php

namespace App\Models;

use App\Models\Concerns\HasStringId;
use App\Services\DocumentCalculator;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Document extends Model
{
    use HasFactory, HasStringId;

    public const TYPE_INVOICE = 'invoice';
    public const TYPE_QUOTE = 'quote';

    public const INVOICE_STATUSES = ['draft', 'sent', 'paid', 'overdue'];
    public const QUOTE_STATUSES = ['draft', 'sent', 'accepted', 'declined'];

    protected $fillable = [
        'id',
        'type',
        'number',
        'status',
        'client_id',
        'client_snapshot',
        'currency',
        'notes',
        'terms',
        'issue_date',
        'due_date',
        'valid_until',
        'source_quote_id',
        'converted_invoice_id',
        'paid_at',
    ];

    protected function casts(): array
    {
        return [
            'client_snapshot' => 'array',
            'issue_date' => 'date:Y-m-d',
            'due_date' => 'date:Y-m-d',
            'valid_until' => 'date:Y-m-d',
            'paid_at' => 'datetime',
        ];
    }

    public function client(): BelongsTo
    {
        return $this->belongsTo(Client::class, 'client_id');
    }

    public function lineItems(): HasMany
    {
        return $this->hasMany(DocumentLineItem::class, 'document_id')->orderBy('sort_order');
    }

    public function scopeOfType(Builder $query, string $type): Builder
    {
        return $query->where('type', $type);
    }

    public function scopeInvoices(Builder $query): Builder
    {
        return $query->ofType(self::TYPE_INVOICE);
    }

    public function scopeQuotes(Builder $query): Builder
    {
        return $query->ofType(self::TYPE_QUOTE);
    }

    public function scopeWithStatusFilter(Builder $query, string $type, ?string $status): Builder
    {
        if (! $status || $status === 'all') {
            return $query;
        }

        if ($type === self::TYPE_INVOICE) {
            if ($status === 'overdue') {
                return $query->where(function (Builder $q): void {
                    $q->where('status', 'overdue')
                        ->orWhere(function (Builder $sub): void {
                            $sub->where('status', 'sent')
                                ->whereNotNull('due_date')
                                ->whereDate('due_date', '<', today());
                        });
                });
            }

            if ($status === 'sent') {
                return $query->where('status', 'sent')
                    ->where(function (Builder $q): void {
                        $q->whereNull('due_date')
                            ->orWhereDate('due_date', '>=', today());
                    });
            }
        }

        return $query->where('status', $status);
    }

    public function scopeSearch(Builder $query, ?string $term): Builder
    {
        $term = trim((string) $term);
        if ($term === '') {
            return $query;
        }

        return $query->where(function (Builder $q) use ($term): void {
            $q->where('number', 'like', "%{$term}%")
                ->orWhere('notes', 'like', "%{$term}%")
                ->orWhere('client_snapshot', 'like', "%{$term}%")
                ->orWhereHas('client', function (Builder $clientQuery) use ($term): void {
                    $clientQuery->where('name', 'like', "%{$term}%")
                        ->orWhere('email', 'like', "%{$term}%");
                });
        });
    }

    public function isOverdue(): bool
    {
        if ($this->type !== self::TYPE_INVOICE) {
            return false;
        }

        if ($this->status === 'overdue') {
            return true;
        }

        return $this->status === 'sent'
            && $this->due_date !== null
            && $this->due_date->lt(now()->startOfDay());
    }

    public function getEffectiveStatusAttribute(): string
    {
        return $this->isOverdue() ? 'overdue' : $this->status;
    }

    /**
     * @return array{subtotal: float, discountTotal: float, taxTotal: float, grandTotal: float}
     */
    public function calculateTotals(): array
    {
        $items = $this->relationLoaded('lineItems') ? $this->lineItems : $this->lineItems()->get();

        return app(DocumentCalculator::class)->documentTotals($items);
    }
}
