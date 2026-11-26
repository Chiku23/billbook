import type { ReactNode, SelectHTMLAttributes } from 'react'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'

interface SelectOption {
  label: string
  value: string
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  error?: string
  options?: SelectOption[]
  leftIcon?: ReactNode
}

export function Select({
  label,
  error,
  options,
  leftIcon,
  className,
  id,
  children,
  ...props
}: SelectProps) {
  const selectId = id ?? props.name

  return (
    <div className="w-full space-y-1.5">
      {label && (
        <label
          htmlFor={selectId}
          className="block text-sm font-medium text-slate-700 dark:text-slate-300"
        >
          {label}
        </label>
      )}
      <div className="relative">
        {leftIcon && (
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
            {leftIcon}
          </div>
        )}
        <select
          id={selectId}
          className={cn(
            'w-full h-10 appearance-none rounded-lg border bg-white pr-9 text-sm text-slate-900 focus:outline-none focus:ring-2 disabled:bg-slate-50 dark:bg-slate-900 dark:text-slate-100',
            leftIcon ? 'pl-9' : 'pl-3',
            error
              ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
              : 'border-slate-300 focus:border-blue-500 focus:ring-blue-500/20 dark:border-slate-700',
            className,
          )}
          {...props}
        >
          {options
            ? options.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))
            : children}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400">
          <ChevronDown className="h-4 w-4" />
        </div>
      </div>
      {error && <p className="text-xs text-red-600 dark:text-red-400">{error}</p>}
    </div>
  )
}
