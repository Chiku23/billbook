<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Expense\StoreExpenseRequest;
use App\Http\Requests\Expense\UpdateExpenseRequest;
use App\Http\Resources\ExpenseResource;
use App\Models\Expense;
use App\Models\Setting;
use App\Services\BackupService;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Support\Facades\Storage;
use Symfony\Component\HttpFoundation\StreamedResponse;

class ExpenseController extends Controller
{
    public function index(Request $request): AnonymousResourceCollection
    {
        $month = $request->query('month');
        $category = $request->query('category');
        $search = $request->query('search');

        $query = Expense::query()
            ->forMonth(is_string($month) ? $month : null)
            ->forCategory(is_string($category) ? $category : null)
            ->search(is_string($search) ? $search : null);

        if ($request->filled('from')) {
            $query->whereDate('date', '>=', $request->query('from'));
        }
        if ($request->filled('to')) {
            $query->whereDate('date', '<=', $request->query('to'));
        }

        $filteredForSummary = (clone $query)->get(['category', 'amount']);
        $byCategory = $filteredForSummary
            ->groupBy('category')
            ->map(fn ($rows, $cat): array => [
                'category' => (string) $cat,
                'total' => round((float) $rows->sum('amount'), 2),
                'count' => $rows->count(),
            ])
            ->sortByDesc('total')
            ->values()
            ->all();

        $availableMonths = Expense::query()
            ->orderByDesc('date')
            ->pluck('date')
            ->map(fn ($date): string => Carbon::parse($date)->format('Y-m'))
            ->unique()
            ->values()
            ->all();

        $query->orderByDesc('date')->orderByDesc('created_at');

        $meta = [
            'summary' => [
                'total' => round((float) $filteredForSummary->sum('amount'), 2),
                'count' => $filteredForSummary->count(),
                'byCategory' => $byCategory,
            ],
            'availableMonths' => $availableMonths,
            'categories' => Expense::CATEGORIES,
        ];

        if ($request->filled('perPage') || $request->filled('page')) {
            $perPage = max(1, min(100, (int) $request->query('perPage', 20)));

            return ExpenseResource::collection($query->paginate($perPage))->additional([
                'meta' => $meta,
            ]);
        }

        return ExpenseResource::collection($query->get())->additional([
            'meta' => $meta,
        ]);
    }

    public function store(StoreExpenseRequest $request): JsonResponse
    {
        $data = $request->validated();
        $settings = Setting::current();

        $receiptPath = null;
        if ($request->hasFile('receipt')) {
            $receiptPath = $request->file('receipt')->store('receipts', 'public');
        }

        $expense = Expense::query()->create([
            'date' => Carbon::parse($data['date'])->toDateString(),
            'category' => $data['category'],
            'amount' => (float) $data['amount'],
            'currency' => $data['currency'] ?? $settings->default_currency ?? 'INR',
            'vendor' => $data['vendor'],
            'notes' => $data['notes'] ?? '',
            'receipt_path' => $receiptPath,
            'receipt_base64' => $data['receiptBase64'] ?? null,
        ]);

        return (new ExpenseResource($expense))
            ->additional(['message' => 'Expense logged successfully.'])
            ->response()
            ->setStatusCode(201);
    }

    public function show(Expense $expense): ExpenseResource
    {
        return new ExpenseResource($expense);
    }

    public function update(UpdateExpenseRequest $request, Expense $expense): ExpenseResource
    {
        $data = $request->validated();
        $updates = [];

        if (array_key_exists('date', $data)) {
            $updates['date'] = Carbon::parse($data['date'])->toDateString();
        }
        if (array_key_exists('category', $data)) {
            $updates['category'] = $data['category'];
        }
        if (array_key_exists('amount', $data)) {
            $updates['amount'] = (float) $data['amount'];
        }
        if (array_key_exists('currency', $data) && $data['currency'] !== null) {
            $updates['currency'] = $data['currency'];
        }
        if (array_key_exists('vendor', $data)) {
            $updates['vendor'] = $data['vendor'];
        }
        if (array_key_exists('notes', $data)) {
            $updates['notes'] = $data['notes'] ?? '';
        }

        if ($request->boolean('removeReceipt')) {
            if ($expense->receipt_path) {
                Storage::disk('public')->delete($expense->receipt_path);
            }
            $updates['receipt_path'] = null;
            $updates['receipt_base64'] = null;
        } else {
            if ($request->hasFile('receipt')) {
                if ($expense->receipt_path) {
                    Storage::disk('public')->delete($expense->receipt_path);
                }
                $updates['receipt_path'] = $request->file('receipt')->store('receipts', 'public');
            }
            if (array_key_exists('receiptBase64', $data)) {
                $updates['receipt_base64'] = $data['receiptBase64'];
            }
        }

        if ($updates !== []) {
            $expense->update($updates);
        }

        return (new ExpenseResource($expense->fresh()))
            ->additional(['message' => 'Expense updated successfully.']);
    }

    public function destroy(Expense $expense): JsonResponse
    {
        if ($expense->receipt_path) {
            Storage::disk('public')->delete($expense->receipt_path);
        }

        $expense->delete();

        return response()->json([
            'message' => 'Expense deleted successfully.',
        ]);
    }

    public function exportCsv(Request $request, BackupService $backup): StreamedResponse
    {
        return $backup->streamExpensesCsv(
            is_string($request->query('month')) ? $request->query('month') : null,
            is_string($request->query('category')) ? $request->query('category') : null,
            is_string($request->query('search')) ? $request->query('search') : null,
        );
    }
}
