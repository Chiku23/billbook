import type { HTMLAttributes, ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
}

export function Card({ className, children, ...props }: CardProps) {
  return (
    <div
      className={cn(
        'bg-white border border-slate-200 rounded-xl shadow-xs dark:bg-slate-900 dark:border-slate-800',
        className,
      )}
      {...props}
    >
      {children}
    </div>
  )
}

export function CardHeader({ className, children, ...props }: CardProps) {
  const hasBorderOverride = /\bborder-b-0\b/.test(className ?? '')
  const hasBottomPaddingOverride = /\bpb-/.test(className ?? '')

  return (
    <div
      className={cn(
        'px-6 pt-4 dark:border-slate-800',
        !hasBottomPaddingOverride && 'pb-4',
        !hasBorderOverride && 'border-b border-slate-100',
        className,
      )}
      {...props}
    >
      {children}
    </div>
  )
}

export function CardTitle({ className, children, ...props }: HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h2 className={cn('text-base font-semibold text-slate-900 dark:text-slate-100', className)} {...props}>
      {children}
    </h2>
  )
}

export function CardDescription({ className, children, ...props }: HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p className={cn('mt-0.5 text-sm text-slate-500 dark:text-slate-400', className)} {...props}>
      {children}
    </p>
  )
}

export function CardContent({ className, children, ...props }: CardProps) {
  const hasFullPadding = /\bp-/.test(className ?? '')
  const hasHorizontalPadding = hasFullPadding || /\bpx-/.test(className ?? '')
  const hasTopPadding = hasFullPadding || /\bpy-/.test(className ?? '') || /\bpt-/.test(className ?? '')
  const hasBottomPadding = hasFullPadding || /\bpy-/.test(className ?? '') || /\bpb-/.test(className ?? '')

  return (
    <div
      className={cn(
        !hasHorizontalPadding && 'px-6',
        !hasTopPadding && 'pt-6',
        !hasBottomPadding && 'pb-6',
        className,
      )}
      {...props}
    >
      {children}
    </div>
  )
}

export function CardFooter({ className, children, ...props }: CardProps) {
  return (
    <div
      className={cn(
        'px-6 py-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-3',
        className,
      )}
      {...props}
    >
      {children}
    </div>
  )
}
