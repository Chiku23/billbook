<?php

namespace App\Services;

use App\Models\Client;
use App\Models\Document;
use App\Models\Expense;
use App\Models\ItemTemplate;
use App\Models\Setting;
use Carbon\Carbon;

class DashboardService
{
    public function __construct(
        private readonly DocumentCalculator $calculator,
    ) {}

    public function summary(?string $month = null, int $months = 6): array
    {
        $targetMonth = ($month && preg_match('/^\d{4}-\d{2}$/', $month))
            ? $month
            : now()->format('Y-m');

        $months = max(1, min(24, $months));
        $settings = Setting::current();

        $invoices = Document::query()
            ->invoices()
            ->with('lineItems')
            ->get();

        $totalInvoiced = 0.0;
        $totalPaid = 0.0;
        $totalOutstanding = 0.0;
        $draftTotal = 0.0;

        $monthInvoiced = 0.0;
        $monthPaid = 0.0;
        $monthOutstanding = 0.0;

        $invoiceCounts = [
            'all' => $invoices->count(),
            'draft' => 0,
            'sent' => 0,
            'paid' => 0,
            'overdue' => 0,
        ];

        $revenueBuckets = [];
        $cursor = Carbon::createFromFormat('Y-m', $targetMonth)->startOfMonth()->subMonths($months - 1);
        for ($i = 0; $i < $months; $i++) {
            $key = $cursor->format('Y-m');
            $revenueBuckets[$key] = [
                'month' => $cursor->format('M'),
                'monthKey' => $key,
                'label' => $cursor->format('M Y'),
                'revenue' => 0.0,
                'count' => 0,
            ];
            $cursor->addMonth();
        }

        foreach ($invoices as $invoice) {
            $totals = $this->calculator->documentTotals($invoice->lineItems);
            $grandTotal = $totals['grandTotal'];
            $effectiveStatus = $invoice->effective_status;
            $issueMonth = $invoice->issue_date?->format('Y-m');

            if (array_key_exists($effectiveStatus, $invoiceCounts)) {
                $invoiceCounts[$effectiveStatus]++;
            }

            if ($effectiveStatus === 'draft') {
                $draftTotal += $grandTotal;
                continue;
            }

            $totalInvoiced += $grandTotal;
            if ($issueMonth === $targetMonth) {
                $monthInvoiced += $grandTotal;
            }

            if ($effectiveStatus === 'paid') {
                $totalPaid += $grandTotal;
                if ($issueMonth === $targetMonth) {
                    $monthPaid += $grandTotal;
                }
                if ($issueMonth && isset($revenueBuckets[$issueMonth])) {
                    $revenueBuckets[$issueMonth]['revenue'] = round(
                        $revenueBuckets[$issueMonth]['revenue'] + $grandTotal,
                        2,
                    );
                    $revenueBuckets[$issueMonth]['count']++;
                }
            } else {
                $totalOutstanding += $grandTotal;
                if ($issueMonth === $targetMonth) {
                    $monthOutstanding += $grandTotal;
                }
            }
        }

        $monthExpensesQuery = Expense::query()->forMonth($targetMonth);
        $monthExpensesTotal = round((float) (clone $monthExpensesQuery)->sum('amount'), 2);
        $allTimeExpensesTotal = round((float) Expense::query()->sum('amount'), 2);

        $expensesByCategory = (clone $monthExpensesQuery)
            ->selectRaw('category, SUM(amount) as total, COUNT(*) as count')
            ->groupBy('category')
            ->orderByDesc('total')
            ->get()
            ->map(fn ($row): array => [
                'name' => $row->category,
                'value' => round((float) $row->total, 2),
                'count' => (int) $row->count,
            ])
            ->values()
            ->all();

        $quoteCounts = Document::query()
            ->quotes()
            ->selectRaw('status, COUNT(*) as total')
            ->groupBy('status')
            ->pluck('total', 'status');

        $recentDocuments = Document::query()
            ->with(['client', 'lineItems'])
            ->latest('updated_at')
            ->limit(10)
            ->get()
            ->map(function (Document $doc): array {
                $totals = $this->calculator->documentTotals($doc->lineItems);
                $clientName = $doc->client?->name
                    ?: ($doc->client_snapshot['name'] ?? 'Walk-in Client');

                return [
                    'id' => $doc->id,
                    'type' => $doc->type,
                    'number' => $doc->number,
                    'clientId' => $doc->client_id,
                    'clientName' => $clientName,
                    'issueDate' => $doc->issue_date?->format('Y-m-d'),
                    'dueDate' => $doc->due_date?->format('Y-m-d'),
                    'validUntil' => $doc->valid_until?->format('Y-m-d'),
                    'status' => $doc->effective_status,
                    'currency' => $doc->currency,
                    'grandTotal' => $totals['grandTotal'],
                    'updatedAt' => $doc->updated_at?->toIso8601String(),
                ];
            })
            ->values()
            ->all();

        return [
            'currency' => $settings->default_currency ?: 'INR',
            'month' => $targetMonth,
            'overview' => [
                'totalInvoiced' => round($totalInvoiced, 2),
                'totalPaid' => round($totalPaid, 2),
                'totalOutstanding' => round($totalOutstanding, 2),
                'totalExpenses' => $monthExpensesTotal,
                'allTimeExpenses' => $allTimeExpensesTotal,
                'draftTotal' => round($draftTotal, 2),
            ],
            'currentMonth' => [
                'month' => $targetMonth,
                'totalInvoiced' => round($monthInvoiced, 2),
                'totalPaid' => round($monthPaid, 2),
                'totalOutstanding' => round($monthOutstanding, 2),
                'totalExpenses' => $monthExpensesTotal,
            ],
            'counts' => [
                'invoices' => $invoiceCounts,
                'quotes' => [
                    'all' => (int) $quoteCounts->sum(),
                    'draft' => (int) ($quoteCounts['draft'] ?? 0),
                    'sent' => (int) ($quoteCounts['sent'] ?? 0),
                    'accepted' => (int) ($quoteCounts['accepted'] ?? 0),
                    'declined' => (int) ($quoteCounts['declined'] ?? 0),
                ],
                'clients' => Client::query()->count(),
                'items' => ItemTemplate::query()->count(),
            ],
            'monthlyRevenue' => array_values($revenueBuckets),
            'expensesByCategory' => $expensesByCategory,
            'recentActivity' => $recentDocuments,
        ];
    }
}
