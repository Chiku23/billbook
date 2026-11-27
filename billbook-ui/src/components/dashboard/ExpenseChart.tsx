import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui'
import { formatCurrency } from '@/lib/utils'
import type { ExpenseCategoryPoint } from '@/types'

const chartColors = ['#4673c2', '#334155', '#64748b', '#94a3b8', '#cbd5e1']

interface ExpenseChartProps {
  data: ExpenseCategoryPoint[]
  currency: string
}

export function ExpenseChart({ data, currency }: ExpenseChartProps) {
  const total = data.reduce((sum, item) => sum + item.value, 0)
  const radius = 64
  const circumference = 2 * Math.PI * radius

  const segments = data.reduce<
    Array<{
      name: string
      value: number
      color: string
      length: number
      offset: number
    }>
  >((acc, entry, index) => {
    const previousEnd = acc.reduce((sum, item) => sum + item.length, 0)
    const length = total > 0 ? (entry.value / total) * circumference : 0
    return [
      ...acc,
      {
        name: entry.name,
        value: entry.value,
        color: chartColors[index % chartColors.length],
        length,
        offset: -previousEnd,
      },
    ]
  }, [])

  return (
    <Card>
      <CardHeader className="border-b-0 pb-0">
        <CardTitle>Expenses by Category</CardTitle>
      </CardHeader>
      <CardContent className="pt-4">
        {data.length === 0 ? (
          <div className="flex h-64 items-center justify-center text-sm text-slate-500 dark:text-slate-400">
            No expenses logged for this month yet.
          </div>
        ) : (
          <div className="flex h-64 flex-col items-center justify-center gap-6 sm:flex-row">
            <div className="relative h-48 w-48 shrink-0">
              <svg
                viewBox="0 0 180 180"
                className="h-full w-full -rotate-90"
                aria-label="Expenses by category chart"
              >
                {segments.map((segment) => (
                  <circle
                    key={segment.name}
                    cx="90"
                    cy="90"
                    r={radius}
                    fill="transparent"
                    stroke={segment.color}
                    strokeWidth="28"
                    strokeDasharray={`${segment.length} ${circumference}`}
                    strokeDashoffset={segment.offset}
                  />
                ))}
              </svg>
              <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="text-xs text-slate-500 dark:text-slate-400">Total</span>
                <span className="text-sm font-semibold tabular-nums text-slate-900 dark:text-slate-100">
                  {formatCurrency(total, currency, 0)}
                </span>
              </div>
            </div>

            <ul className="space-y-2.5 text-sm">
              {segments.map((item) => (
                <li
                  key={item.name}
                  className="flex items-center gap-2.5 text-slate-700 dark:text-slate-300"
                >
                  <span
                    className="h-3 w-3 shrink-0 rounded-xs"
                    style={{ backgroundColor: item.color }}
                  />
                  <span>{item.name}</span>
                  <span className="ml-auto pl-3 text-xs tabular-nums text-slate-500 dark:text-slate-400">
                    {formatCurrency(item.value, currency, 0)}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
