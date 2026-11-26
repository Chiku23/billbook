<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('documents', function (Blueprint $table) {
            $table->string('id', 64)->primary();
            $table->string('type', 20)->index();
            $table->string('number', 100);
            $table->string('status', 20)->index();
            $table->string('client_id', 64)->nullable();
            $table->json('client_snapshot');
            $table->string('currency', 10)->default('INR');
            $table->text('notes')->nullable();
            $table->text('terms')->nullable();
            $table->date('issue_date')->index();
            $table->date('due_date')->nullable()->index();
            $table->date('valid_until')->nullable()->index();
            $table->string('source_quote_id', 64)->nullable()->index();
            $table->string('converted_invoice_id', 64)->nullable()->index();
            $table->timestamp('paid_at')->nullable();
            $table->timestamps();

            $table->unique(['type', 'number']);
            $table->foreign('client_id')->references('id')->on('clients')->nullOnDelete();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('documents');
    }
};
