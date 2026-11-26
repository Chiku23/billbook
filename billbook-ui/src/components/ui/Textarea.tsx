import type { TextareaHTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
}

export function Textarea({
  label,
  error,
  className,
  id,
  rows = 3,
  ...props
}: TextareaProps) {
  const textareaId = id ?? props.name

  return (
    <div className="w-full space-y-1.5">
      {label && (
        <label
          htmlFor={textareaId}
          className="block text-sm font-medium text-slate-700 dark:text-slate-300"
        >
          {label}
        </label>
      )}
      <textarea
        id={textareaId}
        rows={rows}
        className={cn(
          'w-full rounded-lg border bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 disabled:bg-slate-50 dark:bg-slate-900 dark:text-slate-100 dark:placeholder:text-slate-500',
          error
            ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
            : 'border-slate-300 focus:border-blue-500 focus:ring-blue-500/20 dark:border-slate-700',
          className,
        )}
        {...props}
      />
      {error && <p className="text-xs text-red-600 dark:text-red-400">{error}</p>}
    </div>
  )
}
