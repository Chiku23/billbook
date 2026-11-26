import { cn } from '@/lib/utils'

interface TabItem {
  id: string
  label: string
  count?: number
}

interface TabsProps {
  items: TabItem[]
  activeId: string
  onChange?: (id: string) => void
  className?: string
}

export function Tabs({ items, activeId, onChange, className }: TabsProps) {
  return (
    <div
      className={cn(
        'inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white p-1 dark:border-slate-800 dark:bg-slate-900',
        className,
      )}
    >
      {items.map((item) => {
        const isActive = item.id === activeId
        return (
          <button
            key={item.id}
            type="button"
            onClick={() => onChange?.(item.id)}
            className={cn(
              'inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-colors cursor-pointer',
              isActive
                ? 'bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300'
                : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100',
            )}
          >
            <span>{item.label}</span>
            {item.count !== undefined && (
              <span
                className={cn(
                  'rounded-full px-1.5 py-0.5 text-xs tabular-nums',
                  isActive
                    ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200'
                    : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400',
                )}
              >
                {item.count}
              </span>
            )}
          </button>
        )
      })}
    </div>
  )
}
