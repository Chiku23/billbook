<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Setting\UpdateBusinessProfileRequest;
use App\Http\Requests\Setting\UpdateInvoiceDefaultsRequest;
use App\Http\Requests\Setting\UpdateSettingsRequest;
use App\Http\Requests\Setting\UpdateThemeRequest;
use App\Http\Resources\SettingResource;
use App\Models\Setting;
use Illuminate\Support\Facades\Storage;

class SettingController extends Controller
{
    public function show(): SettingResource
    {
        return new SettingResource(Setting::current());
    }

    public function update(UpdateSettingsRequest $request): SettingResource
    {
        $setting = Setting::current();
        $data = $request->validated();
        $updates = [];

        if (array_key_exists('theme', $data)) {
            $updates['theme'] = $data['theme'];
        }

        if (isset($data['businessProfile']) && is_array($data['businessProfile'])) {
            $profile = $data['businessProfile'];
            $profileMap = [
                'companyName' => 'company_name',
                'logoBase64' => 'logo_base64',
                'address' => 'address',
                'email' => 'email',
                'phone' => 'phone',
                'taxId' => 'tax_id',
                'website' => 'website',
            ];

            foreach ($profileMap as $inputKey => $column) {
                if (array_key_exists($inputKey, $profile)) {
                    $updates[$column] = $inputKey === 'logoBase64'
                        ? $profile[$inputKey]
                        : ($profile[$inputKey] ?? '');
                }
            }
        }

        if (isset($data['invoiceDefaults']) && is_array($data['invoiceDefaults'])) {
            $defaults = $data['invoiceDefaults'];
            $defaultsMap = [
                'currency' => 'default_currency',
                'defaultTaxPercent' => 'default_tax_percent',
                'paymentTermsDays' => 'payment_terms_days',
                'defaultNotes' => 'default_notes',
                'defaultTerms' => 'default_terms',
                'invoicePrefix' => 'invoice_prefix',
                'quotePrefix' => 'quote_prefix',
            ];

            foreach ($defaultsMap as $inputKey => $column) {
                if (array_key_exists($inputKey, $defaults)) {
                    $updates[$column] = $defaults[$inputKey] ?? '';
                }
            }
        }

        if ($updates !== []) {
            $setting->update($updates);
        }

        return (new SettingResource($setting->fresh()))
            ->additional(['message' => 'Settings updated successfully.']);
    }

    public function updateBusinessProfile(UpdateBusinessProfileRequest $request): SettingResource
    {
        $setting = Setting::current();
        $data = $request->validated();
        $updates = [];

        $map = [
            'companyName' => 'company_name',
            'address' => 'address',
            'email' => 'email',
            'phone' => 'phone',
            'taxId' => 'tax_id',
            'website' => 'website',
        ];

        foreach ($map as $inputKey => $column) {
            if (array_key_exists($inputKey, $data)) {
                $updates[$column] = $data[$inputKey] ?? '';
            }
        }

        if ($request->boolean('removeLogo')) {
            if ($setting->logo_path) {
                Storage::disk('public')->delete($setting->logo_path);
            }
            $updates['logo_path'] = null;
            $updates['logo_base64'] = null;
        } else {
            if ($request->hasFile('logo')) {
                if ($setting->logo_path) {
                    Storage::disk('public')->delete($setting->logo_path);
                }
                $updates['logo_path'] = $request->file('logo')->store('logos', 'public');
            }
            if (array_key_exists('logoBase64', $data)) {
                $updates['logo_base64'] = $data['logoBase64'];
            }
        }

        if ($updates !== []) {
            $setting->update($updates);
        }

        return (new SettingResource($setting->fresh()))
            ->additional(['message' => 'Business profile updated successfully.']);
    }

    public function updateInvoiceDefaults(UpdateInvoiceDefaultsRequest $request): SettingResource
    {
        $setting = Setting::current();
        $data = $request->validated();
        $updates = [];

        $map = [
            'currency' => 'default_currency',
            'defaultTaxPercent' => 'default_tax_percent',
            'paymentTermsDays' => 'payment_terms_days',
            'defaultNotes' => 'default_notes',
            'defaultTerms' => 'default_terms',
            'invoicePrefix' => 'invoice_prefix',
            'quotePrefix' => 'quote_prefix',
        ];

        foreach ($map as $inputKey => $column) {
            if (array_key_exists($inputKey, $data)) {
                $updates[$column] = $data[$inputKey] ?? '';
            }
        }

        if ($updates !== []) {
            $setting->update($updates);
        }

        return (new SettingResource($setting->fresh()))
            ->additional(['message' => 'Invoice defaults updated successfully.']);
    }

    public function updateTheme(UpdateThemeRequest $request): SettingResource
    {
        $setting = Setting::current();
        $setting->update([
            'theme' => $request->validated('theme'),
        ]);

        return (new SettingResource($setting->fresh()))
            ->additional(['message' => 'Theme updated successfully.']);
    }
}
