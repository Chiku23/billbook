import { Link } from 'react-router-dom'
import { Pencil, Trash2 } from 'lucide-react'
import { Badge, type BadgeVariant, TableCell, TableRow } from '@/components/ui'
import { CurrencyDisplay } from '@/components/common'

export interface ExpenseListRow {
  id: string
  date: string
  category: string
  variant: BadgeVariant
  vendor: string
  amount: string
}

interface ExpenseListItemProps {
  expense: ExpenseListRow
}

export function ExpenseListItem({ expense }: ExpenseListItemProps) {
  return (
    <TableRow>
      <TableCell className="text-slate-700 dark:text-slate-300">{expense.date}</TableCell>
      <TableCell>
        <Badge variant={expense.variant} dot>
          {expense.category}
        </Badge>
      </TableCell>
      <TableCell className="font-medium text-slate-900 dark:text-slate-100">
        {expense.vendor}
      </TableCell>
      <TableCell className="text-right font-medium text-slate-900 dark:text-slate-100">
        <CurrencyDisplay amount={expense.amount} />
      </TableCell>
      <TableCell>
        <div className="flex items-center justify-end gap-1">
          <Link
            to={`/expenses/${expense.id}/edit`}
            aria-label={`Edit ${expense.vendor}`}
            className="rounded-md p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-200"
          >
            <Pencil className="h-4 w-4" />
          </Link>
          <button
            type="button"
            aria-label={`Delete ${expense.vendor}`}
            className="rounded-md p-1.5 text-slate-400 hover:bg-slate-100 hover:text-red-600 dark:hover:bg-slate-800 cursor-pointer"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </TableCell>
    </TableRow>
  )
}
