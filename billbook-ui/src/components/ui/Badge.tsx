import type { HTMLAttributes, ReactNode } from 'react'
import { cn } from '@/lib/utils'

export type BadgeVariant = 'default' | 'primary' | 'success' | 'warning' | 'danger'

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant
  dot?: boolean
  children: ReactNode
}

const variantClasses: Record<BadgeVariant, string> = {
  default: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
  primary: 'bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300',
  success: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300',
  warning: 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300',
  danger: 'bg-red-50 text-red-700 dark:bg-red-950/60 dark:text-red-300',
}

const dotClasses: Record<BadgeVariant, string> = {
  default: 'bg-slate-500',
  primary: 'bg-blue-600',
  success: 'bg-emerald-600',
  warning: 'bg-amber-500',
  danger: 'bg-red-600',
}

export function Badge({
  variant = 'default',
  dot = false,
  className,
  children,
  ...props
}: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium',
        variantClasses[variant],
        className,
      )}
      {...props}
    >
      {dot && <span className={cn('h-1.5 w-1.5 rounded-full', dotClasses[variant])} />}
      {children}
    </span>
  )
}
