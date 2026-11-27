import { Card, CardContent } from '@/components/ui'
import { CurrencyDisplay } from '@/components/common'

const overviewItems = [
  { label: 'Total Invoiced', amount: '₹2,45,000' },
  { label: 'Total Paid', amount: '₹1,80,000' },
  { label: 'Outstanding', amount: '₹65,000' },
  { label: 'Expenses', amount: '₹32,400' },
]

export function OverviewCards() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {overviewItems.map((item) => (
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
