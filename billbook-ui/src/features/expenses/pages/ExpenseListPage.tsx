import { Link } from 'react-router-dom'
import { Calendar, Plus } from 'lucide-react'
import { PageContainer } from '@/components/layout'
import {
  Button,
  Card,
  Select,
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui'
import { ExpenseSummaryCard } from '../components/ExpenseSummaryCard'
import { ExpenseListItem, type ExpenseListRow } from '../components/ExpenseListItem'

const monthOptions = [
  { value: '2026-11', label: 'November 2026' },
  { value: '2026-10', label: 'October 2026' },
  { value: '2026-09', label: 'September 2026' },
]

const categoryFilterOptions = [
  { value: 'all', label: 'All Categories' },
  { value: 'Travel', label: 'Travel' },
  { value: 'Software', label: 'Software' },
  { value: 'Office Supplies', label: 'Office' },
  { value: 'Miscellaneous', label: 'Other' },
]

const placeholderExpenses: ExpenseListRow[] = [
  {
    id: '1',
    date: 'Nov 22, 2026',
    category: 'Software',
    variant: 'primary',
    vendor: 'AWS Hosting',
    amount: '₹4,800',
  },
  {
    id: '2',
    date: 'Nov 19, 2026',
    category: 'Travel',
    variant: 'success',
    vendor: 'Uber Business',
    amount: '₹1,450',
  },
  {
    id: '3',
    date: 'Nov 16, 2026',
    category: 'Software',
    variant: 'primary',
    vendor: 'Figma Subscription',
    amount: '₹3,700',
  },
  {
    id: '4',
    date: 'Nov 12, 2026',
    category: 'Office',
    variant: 'warning',
    vendor: 'Office Chair',
    amount: '₹6,200',
  },
  {
    id: '5',
    date: 'Nov 09, 2026',
    category: 'Travel',
    variant: 'success',
    vendor: 'IndiGo Flight - Mumbai',
    amount: '₹10,550',
  },
  {
    id: '6',
    date: 'Nov 05, 2026',
    category: 'Other',
    variant: 'default',
    vendor: 'Client Lunch - Blue Tokai',
    amount: '₹2,400',
  },
  {
    id: '7',
    date: 'Nov 02, 2026',
    category: 'Other',
    variant: 'default',
    vendor: 'Courier & Postage',
    amount: '₹3,300',
  },
]

export function ExpenseListPage() {
  return (
    <PageContainer
      title="Expenses"
      actions={
        <Link to="/expenses/new">
          <Button>
            <Plus className="h-4 w-4" />
            Log Expense
          </Button>
        </Link>
      }
    >
      <div className="space-y-5">
        <div className="flex flex-wrap items-center gap-3">
          <div className="w-48">
            <Select
              name="month"
              defaultValue="2026-11"
              options={monthOptions}
              leftIcon={<Calendar className="h-4 w-4" />}
            />
          </div>
          <div className="w-44">
            <Select name="category" defaultValue="all" options={categoryFilterOptions} />
          </div>
        </div>

        <ExpenseSummaryCard />

        <Card className="overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead>Date</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Description / Vendor</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead className="w-24" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {placeholderExpenses.map((expense) => (
                <ExpenseListItem key={expense.id} expense={expense} />
              ))}
            </TableBody>
          </Table>
        </Card>
      </div>
    </PageContainer>
  )
}
