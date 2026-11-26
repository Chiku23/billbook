import { Link } from 'react-router-dom'
import { Plus, Search } from 'lucide-react'
import { PageContainer } from '@/components/layout'
import {
  Button,
  Card,
  Input,
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
  Tabs,
} from '@/components/ui'
import { InvoiceListItem, type InvoiceListRow } from '../components/InvoiceListItem'

const statusTabs = [
  { id: 'all', label: 'All', count: 4 },
  { id: 'draft', label: 'Draft', count: 1 },
  { id: 'sent', label: 'Sent', count: 1 },
  { id: 'paid', label: 'Paid', count: 1 },
  { id: 'overdue', label: 'Overdue', count: 1 },
]

const placeholderInvoices: InvoiceListRow[] = [
  {
    id: 'INV-0042',
    number: 'INV-0042',
    clientName: 'Acme Solutions Pvt Ltd',
    issueDate: '25 Nov 2026',
    dueDate: '25 Dec 2026',
    status: 'sent',
    amount: '₹78,470',
  },
  {
    id: 'INV-0041',
    number: 'INV-0041',
    clientName: 'Priya Nair',
    issueDate: '08 Nov 2026',
    dueDate: '08 Dec 2026',
    status: 'paid',
    amount: '₹85,000',
  },
  {
    id: 'INV-0040',
    number: 'INV-0040',
    clientName: 'Rohan Kulkarni',
    issueDate: '02 Nov 2026',
    dueDate: '02 Dec 2026',
    status: 'draft',
    amount: '₹42,500',
  },
  {
    id: 'INV-0039',
    number: 'INV-0039',
    clientName: 'Vikram Singh',
    issueDate: '18 Oct 2026',
    dueDate: '17 Nov 2026',
    status: 'overdue',
    amount: '₹1,18,000',
  },
]

export function InvoiceListPage() {
  return (
    <PageContainer
      title="Invoices"
      actions={
        <Link to="/invoices/new">
          <Button>
            <Plus className="h-4 w-4" />
            New Invoice
          </Button>
        </Link>
      }
    >
      <div className="space-y-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <Tabs items={statusTabs} activeId="all" />
          <div className="w-full sm:w-72">
            <Input
              placeholder="Search invoices..."
              leftIcon={<Search className="h-4 w-4" />}
            />
          </div>
        </div>

        <Card className="overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead>Invoice #</TableHead>
                <TableHead>Client</TableHead>
                <TableHead>Issue Date</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead className="w-28" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {placeholderInvoices.map((invoice) => (
                <InvoiceListItem key={invoice.id} invoice={invoice} />
              ))}
            </TableBody>
          </Table>
        </Card>
      </div>
    </PageContainer>
  )
}
