import { Link } from 'react-router-dom'
import { Pencil, Trash2 } from 'lucide-react'
import { Badge, TableCell, TableRow } from '@/components/ui'
import { CurrencyDisplay } from '@/components/common'

export interface ItemListRow {
  id: string
  name: string
  description: string
  unit: string
  defaultRate: string
  defaultTaxPercent: string
}

interface ItemListItemProps {
  item: ItemListRow
}

export function ItemListItem({ item }: ItemListItemProps) {
  return (
    <TableRow>
      <TableCell className="font-medium text-slate-900 dark:text-slate-100">
        {item.name}
      </TableCell>
      <TableCell className="text-slate-600 dark:text-slate-400">{item.description}</TableCell>
      <TableCell>
        <Badge variant="default">{item.unit}</Badge>
      </TableCell>
      <TableCell className="text-right font-medium text-slate-900 dark:text-slate-100">
        <CurrencyDisplay amount={item.defaultRate} />
      </TableCell>
      <TableCell className="text-right tabular-nums text-slate-600 dark:text-slate-400">
        {item.defaultTaxPercent}%
      </TableCell>
      <TableCell>
        <div className="flex items-center justify-end gap-1">
          <Link
            to={`/items/${item.id}/edit`}
            aria-label={`Edit ${item.name}`}
            className="rounded-md p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-200"
          >
            <Pencil className="h-4 w-4" />
          </Link>
          <button
            type="button"
            aria-label={`Delete ${item.name}`}
            className="rounded-md p-1.5 text-slate-400 hover:bg-slate-100 hover:text-red-600 dark:hover:bg-slate-800 cursor-pointer"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </TableCell>
    </TableRow>
  )
}
