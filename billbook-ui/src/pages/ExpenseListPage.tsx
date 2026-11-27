import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Calendar, FileSpreadsheet, Plus, Search, Wallet } from 'lucide-react'
import {
  deleteExpense,
  exportExpensesCsv,
  getExpenses,
  type ExpenseSummaryCategory,
} from '@/api/expenses'
import { ConfirmDialog, EmptyState } from '@/components/common'
import { ExpenseListItem } from '@/components/expenses/ExpenseListItem'
import { ExpenseSummaryCard } from '@/components/expenses/ExpenseSummaryCard'
import { PageContainer } from '@/components/layout'
import {
  Button,
  Card,
  CardContent,
  Input,
  Select,
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui'
import { getApiErrorMessage } from '@/lib/api'
import { EXPENSE_CATEGORIES } from '@/lib/constants'
import type { Expense } from '@/types'

function formatMonthLabel(monthKey: string): string {
  const parsed = new Date(`${monthKey}-01T00:00:00`)
  if (Number.isNaN(parsed.getTime())) return monthKey
  return new Intl.DateTimeFormat('en-US', { month: 'long', year: 'numeric' }).format(parsed)
}

export function ExpenseListPage() {
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [summaryTotal, setSummaryTotal] = useState(0)
  const [summaryCategories, setSummaryCategories] = useState<ExpenseSummaryCategory[]>([])
  const [availableMonths, setAvailableMonths] = useState<string[]>([])
  const [categories, setCategories] = useState<string[]>([...EXPENSE_CATEGORIES])
  const [month, setMonth] = useState('all')
  const [category, setCategory] = useState('all')
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [expenseToDelete, setExpenseToDelete] = useState<Expense | null>(null)

  useEffect(() => {
    let cancelled = false

    getExpenses({
      month: month === 'all' ? undefined : month,
      category: category === 'all' ? undefined : category,
      search: search || undefined,
    })
      .then((res) => {
        if (cancelled) return
        setExpenses(res.data)
        setSummaryTotal(res.meta.summary.total)
        setSummaryCategories(res.meta.summary.byCategory)
        setAvailableMonths(res.meta.availableMonths)
        if (res.meta.categories.length > 0) {
          setCategories(res.meta.categories)
        }
        setError(null)
      })
      .catch((err) => {
        if (!cancelled) {
          setError(getApiErrorMessage(err, 'Failed to load expenses.'))
        }
      })
      .finally(() => {
        if (!cancelled) {
          setLoading(false)
        }
      })

    return () => {
      cancelled = true
    }
  }, [month, category, search])

  const handleConfirmDelete = async () => {
    if (!expenseToDelete) return
    try {
      await deleteExpense(expenseToDelete.id)
      const remaining = expenses.filter((item) => item.id !== expenseToDelete.id)
      setExpenses(remaining)
      setSummaryTotal((prev) => Math.max(0, prev - expenseToDelete.amount))
      setExpenseToDelete(null)
    } catch (err) {
      setError(getApiErrorMessage(err, 'Failed to delete expense.'))
      setExpenseToDelete(null)
    }
  }

  const monthOptions = [
    { value: 'all', label: 'All Months' },
    ...availableMonths.map((m) => ({ value: m, label: formatMonthLabel(m) })),
  ]

  const categoryOptions = [
    { value: 'all', label: 'All Categories' },
    ...categories.map((cat) => ({ value: cat, label: cat })),
  ]

  return (
    <PageContainer
      title="Expenses"
      actions={
        <>
          <Button
            variant="outline"
            onClick={() =>
              void exportExpensesCsv({
                month: month === 'all' ? undefined : month,
                category: category === 'all' ? undefined : category,
                search: search || undefined,
              })
            }
          >
            <FileSpreadsheet className="h-4 w-4" />
            Export CSV
          </Button>
          <Link to="/expenses/new">
            <Button>
              <Plus className="h-4 w-4" />
              Log Expense
            </Button>
          </Link>
        </>
      }
    >
      <div className="space-y-5">
        <div className="flex flex-wrap items-center gap-3">
          <div className="w-48">
            <Select
              name="month"
              value={month}
              onChange={(e) => setMonth(e.target.value)}
              options={monthOptions}
              leftIcon={<Calendar className="h-4 w-4" />}
            />
          </div>
          <div className="w-48">
            <Select
              name="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              options={categoryOptions}
            />
          </div>
          <div className="w-full sm:w-64 sm:ml-auto">
            <Input
              placeholder="Search expenses..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              leftIcon={<Search className="h-4 w-4" />}
            />
          </div>
        </div>

        <ExpenseSummaryCard total={summaryTotal} byCategory={summaryCategories} />

        {error && (
          <Card>
            <CardContent className="text-sm text-red-600 dark:text-red-400">{error}</CardContent>
          </Card>
        )}

        {loading ? (
          <Card>
            <CardContent className="text-sm text-slate-500 dark:text-slate-400">
              Loading expenses...
            </CardContent>
          </Card>
        ) : expenses.length === 0 ? (
          <EmptyState
            icon={<Wallet className="h-5 w-5" />}
            title="No expenses found"
            description="Log an expense or adjust your month and category filters."
            action={
              <Link to="/expenses/new">
                <Button>
                  <Plus className="h-4 w-4" />
                  Log Expense
                </Button>
              </Link>
            }
          />
        ) : (
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
                {expenses.map((expense) => (
                  <ExpenseListItem
                    key={expense.id}
                    expense={expense}
                    onDelete={setExpenseToDelete}
                  />
                ))}
              </TableBody>
            </Table>
          </Card>
        )}
      </div>

      <ConfirmDialog
        open={expenseToDelete !== null}
        onClose={() => setExpenseToDelete(null)}
        onConfirm={handleConfirmDelete}
        title="Delete Expense"
        description={`Delete expense for "${expenseToDelete?.vendor ?? 'this item'}"?`}
        confirmLabel="Delete"
        destructive
      />
    </PageContainer>
  )
}
