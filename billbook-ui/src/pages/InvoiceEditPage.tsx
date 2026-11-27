import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { getInvoice, updateInvoice, type InvoicePayload } from '@/api/invoices'
import { InvoiceForm } from '@/components/invoices/InvoiceForm'
import { PageContainer } from '@/components/layout'
import { Card, CardContent } from '@/components/ui'
import { getApiErrorMessage, getApiFieldErrors } from '@/lib/api'
import type { Document, SettingsData } from '@/types'

interface InvoiceEditPageProps {
  settings: SettingsData | null
}

export function InvoiceEditPage({ settings }: InvoiceEditPageProps) {
  const { id } = useParams()
  const navigate = useNavigate()
  const backTarget = id ? `/invoices/${id}` : '/invoices'

  const [invoice, setInvoice] = useState<Document | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [errors, setErrors] = useState<Record<string, string[]>>({})
  const [formError, setFormError] = useState<string | null>(null)

  useEffect(() => {
    if (!id) return
    let cancelled = false

    getInvoice(id)
      .then((data) => {
        if (!cancelled) setInvoice(data)
      })
      .catch((err) => {
        if (!cancelled) {
          setFormError(getApiErrorMessage(err, 'Failed to load invoice.'))
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [id])

  const handleUpdate = async (payload: InvoicePayload) => {
    if (!id) return
    setSaving(true)
    setErrors({})
    setFormError(null)

    try {
      const updated = await updateInvoice(id, payload)
      navigate(`/invoices/${updated.id}`)
    } catch (err) {
      setErrors(getApiFieldErrors(err))
      setFormError(getApiErrorMessage(err, 'Failed to update invoice.'))
    } finally {
      setSaving(false)
    }
  }

  return (
    <PageContainer title="Edit Invoice">
      <div className="space-y-4">
        <Link
          to={backTarget}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Invoice
        </Link>

        {loading ? (
          <Card>
            <CardContent className="text-sm text-slate-500 dark:text-slate-400">
              Loading invoice...
            </CardContent>
          </Card>
        ) : !invoice ? (
          <Card>
            <CardContent className="text-sm text-red-600 dark:text-red-400">
              {formError ?? 'Invoice not found.'}
            </CardContent>
          </Card>
        ) : (
          <InvoiceForm
            initialDocument={invoice}
            settings={settings}
            onSubmit={handleUpdate}
            cancelTo={backTarget}
            saving={saving}
            errors={errors}
            formError={formError}
          />
        )}
      </div>
    </PageContainer>
  )
}
