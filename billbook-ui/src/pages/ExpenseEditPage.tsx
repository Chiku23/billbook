import { Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { PageContainer } from '@/components/layout'
import { Card, CardContent } from '@/components/ui'
import { ExpenseForm } from '@/components/expenses/ExpenseForm'

export function ExpenseEditPage() {
  return (
    <PageContainer title="Edit Expense">
      <div className="max-w-2xl space-y-4">
        <Link
          to="/expenses"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Expenses
        </Link>
        <Card>
          <CardContent>
            <ExpenseForm />
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  )
}
