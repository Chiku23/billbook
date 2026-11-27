import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui'

const placeholderRevenue = [
  { month: 'Jun', revenue: 32000, label: '₹32k' },
  { month: 'Jul', revenue: 44000, label: '₹44k' },
  { month: 'Aug', revenue: 61000, label: '₹61k' },
  { month: 'Sep', revenue: 48000, label: '₹48k' },
  { month: 'Oct', revenue: 64000, label: '₹64k' },
  { month: 'Nov', revenue: 55000, label: '₹55k' },
]

export function RevenueChart() {
  const maxRevenue = Math.max(...placeholderRevenue.map((item) => item.revenue), 1)

  return (
    <Card>
      <CardHeader className="border-b-0 pb-0">
        <CardTitle>Monthly Revenue</CardTitle>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="relative flex h-64 flex-col justify-end pt-6">
          <div className="pointer-events-none absolute inset-x-0 top-6 bottom-7 flex flex-col justify-between">
            <div className="border-b border-slate-200 dark:border-slate-800" />
            <div className="border-b border-slate-200 dark:border-slate-800" />
            <div className="border-b border-slate-200 dark:border-slate-800" />
            <div className="border-b border-slate-200 dark:border-slate-800" />
          </div>

          <div className="relative z-10 flex h-full items-end justify-around gap-3 px-2">
            {placeholderRevenue.map((item) => {
              const heightPercent = Math.round((item.revenue / maxRevenue) * 100)
              return (
                <div key={item.month} className="group flex h-full flex-1 flex-col items-center justify-end gap-2">
                  <div className="flex w-full flex-1 items-end justify-center">
                    <div
                      title={`${item.month}: ${item.label}`}
                      style={{ height: `${heightPercent}%` }}
                      className="w-7 rounded-t bg-[#5b7db1] transition-opacity group-hover:opacity-85 sm:w-8"
                    />
                  </div>
                  <span className="text-xs text-slate-500 dark:text-slate-400">{item.month}</span>
                </div>
              )
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
