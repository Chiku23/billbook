import type { ExpenseSummaryCategory } from '@/api/expenses'
import { Card } from '@/components/ui'
import { formatCurrency } from '@/lib/utils'

interface ExpenseSummaryCardProps {
  total: number
  byCategory: ExpenseSummaryCategory[]
  currency?: string
}

export function ExpenseSummaryCard({
  total,
  byCategory,
  currency = 'INR',
}: ExpenseSummaryCardProps) {
  const summaryItems = [
    { label: 'Total', amount: formatCurrency(total, currency, 0) },
    ...byCategory.slice(0, 4).map((item) => ({
      label: item.category,
      amount: formatCurrency(item.total, currency, 0),
    })),
  ]

  return (
    <Card className="overflow-hidden">
      <div className="flex flex-wrap items-center divide-y divide-slate-200 sm:divide-x sm:divide-y-0 dark:divide-slate-800">
        {summaryItems.map((item) => (
          <div key={item.label} className="flex-1 min-w-36 px-5 py-3.5 text-sm">
            <span className="text-slate-500 dark:text-slate-400">{item.label}: </span>
            <span className="font-semibold tabular-nums text-slate-900 dark:text-slate-100">
              {item.amount}
            </span>
          </div>
        ))}
      </div>
    </Card>
  )
}
