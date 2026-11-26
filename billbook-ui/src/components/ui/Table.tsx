import type { HTMLAttributes, ReactNode, TableHTMLAttributes, TdHTMLAttributes, ThHTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

export function Table({ className, children, ...props }: TableHTMLAttributes<HTMLTableElement>) {
  return (
    <div className="w-full overflow-x-auto">
      <table className={cn('w-full border-collapse text-left text-sm', className)} {...props}>
        {children}
      </table>
    </div>
  )
}

export function TableHeader({ className, children, ...props }: HTMLAttributes<HTMLTableSectionElement>) {
  return (
    <thead
      className={cn(
        'bg-slate-50 border-b border-slate-200 text-xs font-medium text-slate-500 uppercase tracking-wider dark:bg-slate-800/50 dark:border-slate-800 dark:text-slate-400',
        className,
      )}
      {...props}
    >
      {children}
    </thead>
  )
}

export function TableBody({ className, children, ...props }: HTMLAttributes<HTMLTableSectionElement>) {
  return (
    <tbody className={cn('divide-y divide-slate-100 dark:divide-slate-800', className)} {...props}>
      {children}
    </tbody>
  )
}

export function TableRow({ className, children, ...props }: HTMLAttributes<HTMLTableRowElement>) {
  return (
    <tr
      className={cn('hover:bg-slate-50/70 transition-colors dark:hover:bg-slate-800/40', className)}
      {...props}
    >
      {children}
    </tr>
  )
}

export function TableHead({ className, children, ...props }: ThHTMLAttributes<HTMLTableCellElement>) {
  return (
    <th className={cn('px-4 py-3 font-medium', className)} {...props}>
      {children}
    </th>
  )
}

export function TableCell({
  className,
  children,
  ...props
}: TdHTMLAttributes<HTMLTableCellElement> & { children?: ReactNode }) {
  return (
    <td className={cn('px-4 py-3.5 text-slate-700 dark:text-slate-300', className)} {...props}>
      {children}
    </td>
  )
}
