import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { createExpense } from '@/api/expenses'
import { ExpenseForm } from '@/components/expenses/ExpenseForm'
import { PageContainer } from '@/components/layout'
import { Card, CardContent } from '@/components/ui'
import { getApiErrorMessage, getApiFieldErrors } from '@/lib/api'
import type { SettingsData } from '@/types'

interface ExpenseCreatePageProps {
  settings: SettingsData | null
}

export function ExpenseCreatePage({ settings }: ExpenseCreatePageProps) {
  const navigate = useNavigate()
  const [saving, setSaving] = useState(false)
  const [errors, setErrors] = useState<Record<string, string[]>>({})
  const [formError, setFormError] = useState<string | null>(null)

  const handleCreate = async (formData: FormData) => {
    setSaving(true)
    setErrors({})
    setFormError(null)

    try {
      await createExpense(formData)
      navigate('/expenses')
    } catch (err) {
      setErrors(getApiFieldErrors(err))
      setFormError(getApiErrorMessage(err, 'Failed to save expense.'))
    } finally {
      setSaving(false)
    }
  }

  return (
    <PageContainer title="Log Expense">
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
            <ExpenseForm
              defaultCurrency={settings?.invoiceDefaults.currency ?? 'INR'}
              onSubmit={handleCreate}
              cancelTo="/expenses"
              saving={saving}
              errors={errors}
              formError={formError}
            />
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  )
}
