import { Link } from 'react-router-dom'
import {
  Card,
  CardHeader,
  CardTitle,
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@/components/ui'
import { CurrencyDisplay, StatusBadge } from '@/components/common'
import type { InvoiceStatus } from '@/lib/constants'

const recentRows: Array<{
  id: string
  number: string
  client: string
  date: string
  status: InvoiceStatus
  amount: string
}> = [
  {
    id: 'INV-0042',
    number: 'INV-0042',
    client: 'Acme Solutions Pvt Ltd',
    date: '25 Nov 2026',
    status: 'paid',
    amount: '₹78,470',
  },
  {
    id: 'INV-0041',
    number: 'INV-0041',
    client: 'Nair Designs',
    date: '18 Nov 2026',
    status: 'sent',
    amount: '₹42,000',
  },
  {
    id: 'INV-0040',
    number: 'INV-0040',
    client: 'Kulkarni Labs',
    date: '12 Nov 2026',
    status: 'draft',
    amount: '₹35,500',
  },
  {
    id: 'INV-0039',
    number: 'INV-0039',
    client: 'Jaipur Craft Co',
    date: '02 Nov 2026',
    status: 'overdue',
    amount: '₹29,000',
  },
]

export function RecentActivity() {
  return (
    <Card className="overflow-hidden">
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead>Invoice ID</TableHead>
            <TableHead>Client</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Amount</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {recentRows.map((row) => (
            <TableRow key={row.id}>
              <TableCell className="font-medium text-slate-900 dark:text-slate-100">
                <Link to={`/invoices/${row.id}`} className="hover:text-blue-600 hover:underline">
                  {row.number}
                </Link>
              </TableCell>
              <TableCell>{row.client}</TableCell>
              <TableCell className="text-slate-500 dark:text-slate-400">{row.date}</TableCell>
              <TableCell>
                <StatusBadge status={row.status} />
              </TableCell>
              <TableCell className="text-right font-medium text-slate-900 dark:text-slate-100">
                <CurrencyDisplay amount={row.amount} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  )
}
