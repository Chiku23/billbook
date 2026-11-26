import type { InputHTMLAttributes, ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  leftIcon?: ReactNode
  rightIcon?: ReactNode
}

export function Input({
  label,
  error,
  leftIcon,
  rightIcon,
  className,
  id,
  ...props
}: InputProps) {
  const inputId = id ?? props.name

  return (
    <div className="w-full space-y-1.5">
      {label && (
        <label
          htmlFor={inputId}
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
        <input
          id={inputId}
          className={cn(
            'w-full h-10 rounded-lg border bg-white text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 disabled:bg-slate-50 disabled:text-slate-500 dark:bg-slate-900 dark:text-slate-100 dark:placeholder:text-slate-500',
            leftIcon ? 'pl-9' : 'pl-3',
            rightIcon ? 'pr-9' : 'pr-3',
            error
              ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
              : 'border-slate-300 focus:border-blue-500 focus:ring-blue-500/20 dark:border-slate-700',
            className,
          )}
          {...props}
        />
        {rightIcon && (
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400">
            {rightIcon}
          </div>
        )}
      </div>
      {error && <p className="text-xs text-red-600 dark:text-red-400">{error}</p>}
    </div>
  )
}
