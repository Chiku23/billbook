<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('settings', function (Blueprint $table) {
            $table->id();
            $table->string('theme', 10)->default('light');
            $table->string('company_name')->default('');
            $table->longText('logo_base64')->nullable();
            $table->string('logo_path', 500)->nullable();
            $table->text('address')->nullable();
            $table->string('email')->default('');
            $table->string('phone', 50)->default('');
            $table->string('tax_id', 100)->default('');
            $table->string('website')->default('');
            $table->string('default_currency', 10)->default('INR');
            $table->decimal('default_tax_percent', 5, 2)->default(18);
            $table->unsignedInteger('payment_terms_days')->default(30);
            $table->text('default_notes')->nullable();
            $table->text('default_terms')->nullable();
            $table->string('invoice_prefix', 20)->default('INV');
            $table->string('quote_prefix', 20)->default('QT');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('settings');
    }
};
