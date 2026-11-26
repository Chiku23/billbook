<?php

namespace App\Models;

use App\Models\Concerns\HasStringId;
use App\Services\DocumentCalculator;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class DocumentLineItem extends Model
{
    use HasFactory, HasStringId;

    protected $fillable = [
        'id',
        'document_id',
        'item_template_id',
        'sort_order',
        'name',
        'description',
        'quantity',
        'unit_price',
        'tax_percent',
        'discount_percent',
    ];

    protected function casts(): array
    {
        return [
            'sort_order' => 'integer',
            'quantity' => 'float',
            'unit_price' => 'float',
            'tax_percent' => 'float',
            'discount_percent' => 'float',
        ];
    }

    public function document(): BelongsTo
    {
        return $this->belongsTo(Document::class, 'document_id');
    }

    public function itemTemplate(): BelongsTo
    {
        return $this->belongsTo(ItemTemplate::class, 'item_template_id');
    }

    /**
     * @return array{lineSubtotal: float, discountAmount: float, taxableAmount: float, taxAmount: float, total: float}
     */
    public function calculateTotals(): array
    {
        return app(DocumentCalculator::class)->lineItemTotals($this);
    }
}
