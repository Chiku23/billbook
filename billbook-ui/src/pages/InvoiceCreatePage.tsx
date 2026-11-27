import { useEffect, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { createInvoice, getNextInvoiceNumber, type InvoicePayload } from '@/api/invoices'
import { InvoiceForm } from '@/components/invoices/InvoiceForm'
import { PageContainer } from '@/components/layout'
import { Card, CardContent } from '@/components/ui'
import { getApiErrorMessage, getApiFieldErrors } from '@/lib/api'
import type { SettingsData } from '@/types'

interface InvoiceCreatePageProps {
  settings: SettingsData | null
}

export function InvoiceCreatePage({ settings }: InvoiceCreatePageProps) {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const preselectedClientId = searchParams.get('clientId') ?? ''

  const [nextNumber, setNextNumber] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [errors, setErrors] = useState<Record<string, string[]>>({})
  const [formError, setFormError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    getNextInvoiceNumber()
      .then((num) => {
        if (!cancelled) setNextNumber(num)
      })
      .catch(() => {
        // User can enter invoice number manually if lookup fails
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [])

  const handleCreate = async (payload: InvoicePayload) => {
    setSaving(true)
    setErrors({})
    setFormError(null)

    try {
      const created = await createInvoice(payload)
      navigate(`/invoices/${created.id}`)
    } catch (err) {
      setErrors(getApiFieldErrors(err))
      setFormError(getApiErrorMessage(err, 'Failed to create invoice.'))
    } finally {
      setSaving(false)
    }
  }

  return (
    <PageContainer title="Create Invoice">
      <div className="space-y-4">
        <Link
          to="/invoices"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Invoices
        </Link>
        {loading ? (
          <Card>
            <CardContent className="text-sm text-slate-500 dark:text-slate-400">
              Preparing invoice form...
            </CardContent>
          </Card>
        ) : (
          <InvoiceForm
            defaultNumber={nextNumber}
            initialClientId={preselectedClientId}
            settings={settings}
            onSubmit={handleCreate}
            cancelTo="/invoices"
            saving={saving}
            errors={errors}
            formError={formError}
          />
        )}
      </div>
    </PageContainer>
  )
}
