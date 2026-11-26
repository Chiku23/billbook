<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('clients', function (Blueprint $table) {
            $table->string('id', 64)->primary();
            $table->string('name')->index();
            $table->string('email')->nullable()->index();
            $table->string('phone', 50)->nullable();
            $table->text('address')->nullable();
            $table->string('tax_id', 100)->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('clients');
    }
};
