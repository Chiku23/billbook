import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { getExpense, updateExpense } from '@/api/expenses'
import { ExpenseForm } from '@/components/expenses/ExpenseForm'
import { PageContainer } from '@/components/layout'
import { Card, CardContent } from '@/components/ui'
import { getApiErrorMessage, getApiFieldErrors } from '@/lib/api'
import type { Expense } from '@/types'

export function ExpenseEditPage() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [expense, setExpense] = useState<Expense | undefined>(undefined)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [errors, setErrors] = useState<Record<string, string[]>>({})
  const [formError, setFormError] = useState<string | null>(null)

  useEffect(() => {
    if (!id) return
    let cancelled = false

    getExpense(id)
      .then((data) => {
        if (!cancelled) setExpense(data)
      })
      .catch((err) => {
        if (!cancelled) {
          setFormError(getApiErrorMessage(err, 'Failed to load expense.'))
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [id])

  const handleUpdate = async (formData: FormData) => {
    if (!id) return
    setSaving(true)
    setErrors({})
    setFormError(null)

    try {
      await updateExpense(id, formData)
      navigate('/expenses')
    } catch (err) {
      setErrors(getApiFieldErrors(err))
      setFormError(getApiErrorMessage(err, 'Failed to update expense.'))
    } finally {
      setSaving(false)
    }
  }

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
            {loading ? (
              <p className="text-sm text-slate-500 dark:text-slate-400">Loading expense...</p>
            ) : (
              <ExpenseForm
                initialData={expense}
                onSubmit={handleUpdate}
                cancelTo="/expenses"
                saving={saving}
                errors={errors}
                formError={formError}
              />
            )}
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  )
}
