import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { getQuote, updateQuote, type QuotePayload } from '@/api/quotes'
import { PageContainer } from '@/components/layout'
import { QuoteForm } from '@/components/quotes/QuoteForm'
import { Card, CardContent } from '@/components/ui'
import { getApiErrorMessage, getApiFieldErrors } from '@/lib/api'
import type { Document, SettingsData } from '@/types'

interface QuoteEditPageProps {
  settings: SettingsData | null
}

export function QuoteEditPage({ settings }: QuoteEditPageProps) {
  const { id } = useParams()
  const navigate = useNavigate()
  const backTarget = id ? `/quotes/${id}` : '/quotes'

  const [quote, setQuote] = useState<Document | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [errors, setErrors] = useState<Record<string, string[]>>({})
  const [formError, setFormError] = useState<string | null>(null)

  useEffect(() => {
    if (!id) return
    let cancelled = false

    getQuote(id)
      .then((data) => {
        if (!cancelled) setQuote(data)
      })
      .catch((err) => {
        if (!cancelled) {
          setFormError(getApiErrorMessage(err, 'Failed to load quote.'))
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [id])

  const handleUpdate = async (payload: QuotePayload) => {
    if (!id) return
    setSaving(true)
    setErrors({})
    setFormError(null)

    try {
      const updated = await updateQuote(id, payload)
      navigate(`/quotes/${updated.id}`)
    } catch (err) {
      setErrors(getApiFieldErrors(err))
      setFormError(getApiErrorMessage(err, 'Failed to update quote.'))
    } finally {
      setSaving(false)
    }
  }

  return (
    <PageContainer title="Edit Quote">
      <div className="space-y-4">
        <Link
          to={backTarget}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Quote
        </Link>

        {loading ? (
          <Card>
            <CardContent className="text-sm text-slate-500 dark:text-slate-400">
              Loading quote...
            </CardContent>
          </Card>
        ) : !quote ? (
          <Card>
            <CardContent className="text-sm text-red-600 dark:text-red-400">
              {formError ?? 'Quote not found.'}
            </CardContent>
          </Card>
        ) : (
          <QuoteForm
            initialDocument={quote}
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
