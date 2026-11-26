<?php

use App\Http\Controllers\Api\BackupController;
use App\Http\Controllers\Api\ClientController;
use App\Http\Controllers\Api\DashboardController;
use App\Http\Controllers\Api\ExpenseController;
use App\Http\Controllers\Api\HealthController;
use App\Http\Controllers\Api\InvoiceController;
use App\Http\Controllers\Api\ItemTemplateController;
use App\Http\Controllers\Api\MetaController;
use App\Http\Controllers\Api\QuoteController;
use App\Http\Controllers\Api\SettingController;
use Illuminate\Support\Facades\Route;

Route::get('/health', [HealthController::class, 'index']);
Route::get('/meta', [MetaController::class, 'index']);
Route::get('/dashboard', [DashboardController::class, 'index']);

Route::apiResource('clients', ClientController::class);
Route::apiResource('items', ItemTemplateController::class);

Route::prefix('invoices')->group(function (): void {
    Route::get('/next-number', [InvoiceController::class, 'nextNumber']);
    Route::get('/export/csv', [InvoiceController::class, 'exportCsv']);
    Route::get('/', [InvoiceController::class, 'index']);
    Route::post('/', [InvoiceController::class, 'store']);
    Route::get('/{invoice}', [InvoiceController::class, 'show']);
    Route::put('/{invoice}', [InvoiceController::class, 'update']);
    Route::patch('/{invoice}', [InvoiceController::class, 'update']);
    Route::patch('/{invoice}/status', [InvoiceController::class, 'updateStatus']);
    Route::post('/{invoice}/duplicate', [InvoiceController::class, 'duplicate']);
    Route::delete('/{invoice}', [InvoiceController::class, 'destroy']);
});

Route::prefix('quotes')->group(function (): void {
    Route::get('/next-number', [QuoteController::class, 'nextNumber']);
    Route::get('/', [QuoteController::class, 'index']);
    Route::post('/', [QuoteController::class, 'store']);
    Route::get('/{quote}', [QuoteController::class, 'show']);
    Route::put('/{quote}', [QuoteController::class, 'update']);
    Route::patch('/{quote}', [QuoteController::class, 'update']);
    Route::patch('/{quote}/status', [QuoteController::class, 'updateStatus']);
    Route::post('/{quote}/duplicate', [QuoteController::class, 'duplicate']);
    Route::post('/{quote}/convert', [QuoteController::class, 'convert']);
    Route::delete('/{quote}', [QuoteController::class, 'destroy']);
});

Route::prefix('expenses')->group(function (): void {
    Route::get('/export/csv', [ExpenseController::class, 'exportCsv']);
    Route::get('/', [ExpenseController::class, 'index']);
    Route::post('/', [ExpenseController::class, 'store']);
    Route::get('/{expense}', [ExpenseController::class, 'show']);
    Route::put('/{expense}', [ExpenseController::class, 'update']);
    Route::patch('/{expense}', [ExpenseController::class, 'update']);
    Route::post('/{expense}', [ExpenseController::class, 'update']);
    Route::delete('/{expense}', [ExpenseController::class, 'destroy']);
});

Route::prefix('settings')->group(function (): void {
    Route::get('/', [SettingController::class, 'show']);
    Route::put('/', [SettingController::class, 'update']);
    Route::patch('/', [SettingController::class, 'update']);
    Route::match(['put', 'patch', 'post'], '/business-profile', [SettingController::class, 'updateBusinessProfile']);
    Route::match(['put', 'patch'], '/invoice-defaults', [SettingController::class, 'updateInvoiceDefaults']);
    Route::patch('/theme', [SettingController::class, 'updateTheme']);
});

Route::prefix('backup')->group(function (): void {
    Route::get('/export', [BackupController::class, 'export']);
    Route::post('/import', [BackupController::class, 'import']);
});
