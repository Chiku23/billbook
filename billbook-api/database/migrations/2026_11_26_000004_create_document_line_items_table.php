<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('document_line_items', function (Blueprint $table) {
            $table->string('id', 64)->primary();
            $table->string('document_id', 64);
            $table->string('item_template_id', 64)->nullable();
            $table->unsignedInteger('sort_order')->default(0);
            $table->string('name');
            $table->text('description')->nullable();
            $table->decimal('quantity', 12, 3)->default(1);
            $table->decimal('unit_price', 15, 2)->default(0);
            $table->decimal('tax_percent', 5, 2)->default(0);
            $table->decimal('discount_percent', 5, 2)->default(0);
            $table->timestamps();

            $table->index(['document_id', 'sort_order']);
            $table->foreign('document_id')->references('id')->on('documents')->cascadeOnDelete();
            $table->foreign('item_template_id')->references('id')->on('item_templates')->nullOnDelete();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('document_line_items');
    }
};
