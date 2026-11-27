import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui'
import { formatCurrency } from '@/lib/utils'
import type { MonthlyRevenuePoint } from '@/types'

interface RevenueChartProps {
  data: MonthlyRevenuePoint[]
  currency: string
}

export function RevenueChart({ data, currency }: RevenueChartProps) {
  const maxRevenue = Math.max(...data.map((item) => item.revenue), 1)

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
            {data.map((item) => {
              const heightPercent = item.revenue > 0 ? Math.max(6, Math.round((item.revenue / maxRevenue) * 100)) : 2
              const formattedValue = formatCurrency(item.revenue, currency, 0)

              return (
                <div
                  key={item.monthKey}
                  className="group flex h-full flex-1 flex-col items-center justify-end gap-2"
                >
                  <div className="flex w-full flex-1 flex-col items-center justify-end gap-1">
                    <span className="opacity-0 text-[11px] font-medium tabular-nums text-slate-600 transition-opacity group-hover:opacity-100 dark:text-slate-300">
                      {formattedValue}
                    </span>
                    <div
                      title={`${item.label}: ${formattedValue}`}
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
