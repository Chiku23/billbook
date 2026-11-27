import { Card } from '@/components/ui'

const summaryItems = [
  { label: 'Total', amount: '₹32,400' },
  { label: 'Travel', amount: '₹12,000' },
  { label: 'Software', amount: '₹8,500' },
  { label: 'Office', amount: '₹6,200' },
  { label: 'Other', amount: '₹5,700' },
]

export function ExpenseSummaryCard() {
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
