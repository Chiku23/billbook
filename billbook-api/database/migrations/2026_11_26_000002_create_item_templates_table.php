<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('item_templates', function (Blueprint $table) {
            $table->string('id', 64)->primary();
            $table->string('name')->index();
            $table->text('description')->nullable();
            $table->decimal('default_rate', 15, 2)->default(0);
            $table->decimal('default_tax_percent', 5, 2)->default(0);
            $table->string('unit', 50)->default('unit');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('item_templates');
    }
};
