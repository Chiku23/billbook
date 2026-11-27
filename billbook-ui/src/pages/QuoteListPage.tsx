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
import { QuoteListItem, type QuoteListRow } from '@/components/quotes/QuoteListItem'

const statusTabs = [
  { id: 'all', label: 'All', count: 3 },
  { id: 'draft', label: 'Draft', count: 1 },
  { id: 'sent', label: 'Sent', count: 1 },
  { id: 'accepted', label: 'Accepted', count: 1 },
  { id: 'declined', label: 'Declined', count: 0 },
]

const placeholderQuotes: QuoteListRow[] = [
  {
    id: 'QT-0015',
    number: 'QT-0015',
    clientName: 'Priya Nair',
    issueDate: '25 Nov 2026',
    validUntil: '10 Dec 2026',
    status: 'sent',
    amount: '₹69,030',
  },
  {
    id: 'QT-0014',
    number: 'QT-0014',
    clientName: 'Ananya Iyer',
    issueDate: '14 Nov 2026',
    validUntil: '29 Nov 2026',
    status: 'accepted',
    amount: '₹62,000',
  },
  {
    id: 'QT-0013',
    number: 'QT-0013',
    clientName: 'Meera Deshmukh',
    issueDate: '05 Nov 2026',
    validUntil: '20 Nov 2026',
    status: 'draft',
    amount: '₹48,500',
  },
]

export function QuoteListPage() {
  return (
    <PageContainer
      title="Quotes"
      actions={
        <Link to="/quotes/new">
          <Button>
            <Plus className="h-4 w-4" />
            New Quote
          </Button>
        </Link>
      }
    >
      <div className="space-y-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <Tabs items={statusTabs} activeId="all" />
          <div className="w-full sm:w-72">
            <Input
              placeholder="Search quotes..."
              leftIcon={<Search className="h-4 w-4" />}
            />
          </div>
        </div>

        <Card className="overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead>Quote #</TableHead>
                <TableHead>Client</TableHead>
                <TableHead>Issue Date</TableHead>
                <TableHead>Valid Until</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead className="w-28" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {placeholderQuotes.map((quote) => (
                <QuoteListItem key={quote.id} quote={quote} />
              ))}
            </TableBody>
          </Table>
        </Card>
      </div>
    </PageContainer>
  )
}
