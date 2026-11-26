<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Document;
use App\Models\Expense;
use Illuminate\Http\JsonResponse;

class MetaController extends Controller
{
    public function index(): JsonResponse
    {
        return response()->json([
            'data' => [
                'currencies' => [
                    ['code' => 'INR', 'symbol' => '₹', 'name' => 'Indian Rupee'],
                    ['code' => 'USD', 'symbol' => '$', 'name' => 'US Dollar'],
                    ['code' => 'EUR', 'symbol' => '€', 'name' => 'Euro'],
                    ['code' => 'GBP', 'symbol' => '£', 'name' => 'British Pound'],
                    ['code' => 'AUD', 'symbol' => 'A$', 'name' => 'Australian Dollar'],
                    ['code' => 'CAD', 'symbol' => 'C$', 'name' => 'Canadian Dollar'],
                    ['code' => 'JPY', 'symbol' => '¥', 'name' => 'Japanese Yen'],
                ],
                'expenseCategories' => Expense::CATEGORIES,
                'invoiceStatuses' => Document::INVOICE_STATUSES,
                'quoteStatuses' => Document::QUOTE_STATUSES,
            ],
        ]);
    }
}
