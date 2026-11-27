import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { createQuote, getNextQuoteNumber, type QuotePayload } from '@/api/quotes'
import { PageContainer } from '@/components/layout'
import { QuoteForm } from '@/components/quotes/QuoteForm'
import { Card, CardContent } from '@/components/ui'
import { getApiErrorMessage, getApiFieldErrors } from '@/lib/api'
import type { SettingsData } from '@/types'

interface QuoteCreatePageProps {
  settings: SettingsData | null
}

export function QuoteCreatePage({ settings }: QuoteCreatePageProps) {
  const navigate = useNavigate()
  const [nextNumber, setNextNumber] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [errors, setErrors] = useState<Record<string, string[]>>({})
  const [formError, setFormError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    getNextQuoteNumber()
      .then((num) => {
        if (!cancelled) setNextNumber(num)
      })
      .catch(() => {
        // User can enter quote number manually if lookup fails
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [])

  const handleCreate = async (payload: QuotePayload) => {
    setSaving(true)
    setErrors({})
    setFormError(null)

    try {
      const created = await createQuote(payload)
      navigate(`/quotes/${created.id}`)
    } catch (err) {
      setErrors(getApiFieldErrors(err))
      setFormError(getApiErrorMessage(err, 'Failed to create quote.'))
    } finally {
      setSaving(false)
    }
  }

  return (
    <PageContainer title="Create Quote">
      <div className="space-y-4">
        <Link
          to="/quotes"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Quotes
        </Link>
        {loading ? (
          <Card>
            <CardContent className="text-sm text-slate-500 dark:text-slate-400">
              Preparing quote form...
            </CardContent>
          </Card>
        ) : (
          <QuoteForm
            defaultNumber={nextNumber}
            settings={settings}
            onSubmit={handleCreate}
            cancelTo="/quotes"
            saving={saving}
            errors={errors}
            formError={formError}
          />
        )}
      </div>
    </PageContainer>
  )
}
