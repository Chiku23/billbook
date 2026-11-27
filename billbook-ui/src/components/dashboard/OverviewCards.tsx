import { CurrencyDisplay } from '@/components/common'
import { Card, CardContent } from '@/components/ui'
import { formatCurrency } from '@/lib/utils'
import type { DashboardOverview } from '@/types'

interface OverviewCardsProps {
  overview: DashboardOverview
  currency: string
}

export function OverviewCards({ overview, currency }: OverviewCardsProps) {
  const items = [
    { label: 'Total Invoiced', amount: formatCurrency(overview.totalInvoiced, currency, 0) },
    { label: 'Total Paid', amount: formatCurrency(overview.totalPaid, currency, 0) },
    { label: 'Outstanding', amount: formatCurrency(overview.totalOutstanding, currency, 0) },
    { label: 'Expenses', amount: formatCurrency(overview.totalExpenses, currency, 0) },
  ]

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {items.map((item) => (
        <Card key={item.label}>
          <CardContent className="p-5">
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{item.label}</p>
            <p className="mt-2 text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
              <CurrencyDisplay amount={item.amount} />
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
