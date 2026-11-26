import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui'

const placeholderExpenses = [
  { name: 'Travel', value: 12000, color: '#4673c2' },
  { name: 'Software', value: 8500, color: '#334155' },
  { name: 'Office', value: 6200, color: '#64748b' },
  { name: 'Marketing', value: 5700, color: '#94a3b8' },
]

export function ExpenseChart() {
  const total = placeholderExpenses.reduce((sum, item) => sum + item.value, 0)
  const radius = 64
  const circumference = 2 * Math.PI * radius

  const segments = placeholderExpenses.reduce<
    Array<{
      name: string
      value: number
      color: string
      length: number
      offset: number
    }>
  >((acc, entry) => {
    const previousEnd = acc.reduce((sum, item) => sum + item.length, 0)
    const length = total > 0 ? (entry.value / total) * circumference : 0
    return [
      ...acc,
      {
        ...entry,
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
        <div className="flex h-64 flex-col items-center justify-center gap-6 sm:flex-row">
          <div className="relative h-48 w-48 shrink-0">
            <svg viewBox="0 0 180 180" className="h-full w-full -rotate-90" aria-label="Expenses by category chart">
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
                ₹{total.toLocaleString('en-IN')}
              </span>
            </div>
          </div>

          <ul className="space-y-3 text-sm">
            {placeholderExpenses.map((item) => (
              <li key={item.name} className="flex items-center gap-2.5 text-slate-700 dark:text-slate-300">
                <span
                  className="h-3 w-3 shrink-0 rounded-xs"
                  style={{ backgroundColor: item.color }}
                />
                <span>{item.name}</span>
                <span className="ml-auto pl-3 text-xs tabular-nums text-slate-500 dark:text-slate-400">
                  ₹{item.value.toLocaleString('en-IN')}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}
