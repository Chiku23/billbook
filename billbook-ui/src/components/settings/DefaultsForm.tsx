import { useEffect, useState, type ChangeEvent, type FormEvent } from 'react'
import { updateInvoiceDefaults } from '@/api/settings'
import { getMeta } from '@/api/system'
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Input,
  Select,
  Textarea,
} from '@/components/ui'
import { getApiErrorMessage, getApiFieldErrors } from '@/lib/api'
import { CURRENCIES } from '@/lib/constants'
import type { InvoiceDefaults, SettingsData } from '@/types'

interface DefaultsFormProps {
  initialData: InvoiceDefaults
  onSaved: (updated: SettingsData) => void
}

export function DefaultsForm({ initialData, onSaved }: DefaultsFormProps) {
  const [form, setForm] = useState<InvoiceDefaults>(initialData)
  const [currencyOptions, setCurrencyOptions] = useState<Array<{ value: string; label: string }>>(
    CURRENCIES.map((c) => ({
      value: c.code,
      label: `${c.code} — ${c.name} (${c.symbol})`,
    })),
  )
  const [saving, setSaving] = useState(false)
  const [errors, setErrors] = useState<Record<string, string[]>>({})
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  useEffect(() => {
    let cancelled = false

    getMeta()
      .then((meta) => {
        if (!cancelled && meta.currencies.length > 0) {
          setCurrencyOptions(
            meta.currencies.map((c) => ({
              value: c.code,
              label: `${c.code} — ${c.name} (${c.symbol})`,
            })),
          )
        }
      })
      .catch(() => {
        // Keep static currency list if meta fetch fails
      })

    return () => {
      cancelled = true
    }
  }, [])

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  ) => {
    const { name, value, type } = e.target
    setForm((prev) => ({
      ...prev,
      [name]: type === 'number' ? Number(value) : value,
    }))
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setSaving(true)
    setErrors({})
    setFeedback(null)

    try {
      const updated = await updateInvoiceDefaults(form)
      onSaved(updated)
      setFeedback({ type: 'success', text: 'Invoice defaults saved.' })
    } catch (err) {
      setErrors(getApiFieldErrors(err))
      setFeedback({
        type: 'error',
        text: getApiErrorMessage(err, 'Failed to save defaults.'),
      })
    } finally {
      setSaving(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Invoice & Quote Defaults</CardTitle>
        <CardDescription>Pre-filled values when creating a new invoice or quote.</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <Select
              label="Default Currency"
              name="currency"
              value={form.currency}
              onChange={handleChange}
              options={currencyOptions}
              error={errors.currency?.[0]}
            />
            <Input
              label="Default Tax %"
              name="defaultTaxPercent"
              type="number"
              step="0.01"
              value={form.defaultTaxPercent}
              onChange={handleChange}
              error={errors.defaultTaxPercent?.[0]}
            />
            <Input
              label="Payment Terms (Days)"
              name="paymentTermsDays"
              type="number"
              value={form.paymentTermsDays}
              onChange={handleChange}
              error={errors.paymentTermsDays?.[0]}
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Input
              label="Invoice Prefix"
              name="invoicePrefix"
              value={form.invoicePrefix}
              onChange={handleChange}
              error={errors.invoicePrefix?.[0]}
            />
            <Input
              label="Quote Prefix"
              name="quotePrefix"
              value={form.quotePrefix}
              onChange={handleChange}
              error={errors.quotePrefix?.[0]}
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Textarea
              label="Default Notes"
              name="defaultNotes"
              value={form.defaultNotes}
              onChange={handleChange}
              error={errors.defaultNotes?.[0]}
              rows={2}
            />
            <Textarea
              label="Default Terms"
              name="defaultTerms"
              value={form.defaultTerms}
              onChange={handleChange}
              error={errors.defaultTerms?.[0]}
              rows={2}
            />
          </div>
        </CardContent>
        <CardFooter>
          {feedback && (
            <span
              className={
                feedback.type === 'success'
                  ? 'mr-auto text-sm text-emerald-600 dark:text-emerald-400'
                  : 'mr-auto text-sm text-red-600 dark:text-red-400'
              }
            >
              {feedback.text}
            </span>
          )}
          <Button type="submit" disabled={saving}>
            {saving ? 'Saving...' : 'Save Defaults'}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}
