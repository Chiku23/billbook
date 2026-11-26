<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('expenses', function (Blueprint $table) {
            $table->string('id', 64)->primary();
            $table->date('date')->index();
            $table->string('category', 100)->index();
            $table->decimal('amount', 15, 2);
            $table->string('currency', 10)->default('INR');
            $table->string('vendor')->index();
            $table->text('notes')->nullable();
            $table->string('receipt_path', 500)->nullable();
            $table->longText('receipt_base64')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('expenses');
    }
};
