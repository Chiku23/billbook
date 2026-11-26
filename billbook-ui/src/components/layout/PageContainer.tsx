import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface PageContainerProps {
  title?: string
  description?: string
  actions?: ReactNode
  children: ReactNode
  className?: string
}

export function PageContainer({
  title,
  description,
  actions,
  children,
  className,
}: PageContainerProps) {
  return (
    <div className={cn('mx-auto w-full max-w-7xl px-4 pb-10 pt-2 sm:px-6 lg:px-8', className)}>
      {(title || actions) && (
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            {title && (
              <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
                {title}
              </h1>
            )}
            {description && (
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{description}</p>
            )}
          </div>
          {actions && <div className="flex items-center gap-2.5">{actions}</div>}
        </div>
      )}
      {children}
    </div>
  )
}
