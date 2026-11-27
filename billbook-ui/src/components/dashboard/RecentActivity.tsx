import { Link } from 'react-router-dom'
import { CurrencyDisplay, StatusBadge } from '@/components/common'
import {
  Card,
  CardHeader,
  CardTitle,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui'
import { formatCurrency, formatDate } from '@/lib/utils'
import type { RecentActivityItem } from '@/types'

interface RecentActivityProps {
  rows: RecentActivityItem[]
}

export function RecentActivity({ rows }: RecentActivityProps) {
  return (
    <Card className="overflow-hidden">
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead>Document #</TableHead>
            <TableHead>Client</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Amount</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="py-8 text-center text-slate-500 dark:text-slate-400">
                No recent documents found.
              </TableCell>
            </TableRow>
          ) : (
            rows.map((row) => {
              const targetPath =
                row.type === 'quote' ? `/quotes/${row.id}` : `/invoices/${row.id}`

              return (
                <TableRow key={row.id}>
                  <TableCell className="font-medium text-slate-900 dark:text-slate-100">
                    <Link to={targetPath} className="hover:text-blue-600 hover:underline">
                      {row.number}
                    </Link>
                  </TableCell>
                  <TableCell>{row.clientName}</TableCell>
                  <TableCell className="text-slate-500 dark:text-slate-400">
                    {formatDate(row.issueDate)}
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={row.status} />
                  </TableCell>
                  <TableCell className="text-right font-medium text-slate-900 dark:text-slate-100">
                    <CurrencyDisplay amount={formatCurrency(row.grandTotal, row.currency, 0)} />
                  </TableCell>
                </TableRow>
              )
            })
          )}
        </TableBody>
      </Table>
    </Card>
  )
}
