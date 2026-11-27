<?php

namespace App\Models;

use App\Models\Concerns\ResolvesPublicUrl;
use Illuminate\Database\Eloquent\Model;

class Setting extends Model
{
    use ResolvesPublicUrl;
    protected $fillable = [
        'theme',
        'company_name',
        'logo_base64',
        'logo_path',
        'address',
        'email',
        'phone',
        'tax_id',
        'website',
        'default_currency',
        'default_tax_percent',
        'payment_terms_days',
        'default_notes',
        'default_terms',
        'invoice_prefix',
        'quote_prefix',
    ];

    protected function casts(): array
    {
        return [
            'default_tax_percent' => 'float',
            'payment_terms_days' => 'integer',
        ];
    }

    public function getLogoUrlAttribute(): ?string
    {
        return $this->resolvePublicStorageUrl($this->logo_path);
    }

    /**
     * Retrieve the singleton settings record, creating default values if none exists.
     */
    public static function current(): self
    {
        $setting = self::query()->first();

        if ($setting) {
            return $setting;
        }

        return self::query()->create([
            'theme' => 'light',
            'company_name' => '',
            'address' => '',
            'email' => '',
            'phone' => '',
            'tax_id' => '',
            'website' => '',
            'default_currency' => 'INR',
            'default_tax_percent' => 18,
            'payment_terms_days' => 30,
            'default_notes' => 'Thank you for your business!',
            'default_terms' => 'Payment due within 30 days.',
            'invoice_prefix' => 'INV',
            'quote_prefix' => 'QT',
        ]);
    }
}
