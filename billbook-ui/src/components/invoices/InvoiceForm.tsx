import { useEffect, useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { Calendar } from 'lucide-react'
import { getClients } from '@/api/clients'
import type { DocumentLineItemInput, InvoicePayload } from '@/api/invoices'
import { getItems } from '@/api/items'
import { ClientSelect } from '@/components/clients/ClientSelect'
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Input,
  Select,
  Textarea,
} from '@/components/ui'
import { CURRENCIES, type InvoiceStatus } from '@/lib/constants'
import {
  addDaysToIsoDate,
  calculateDocumentTotals,
  formatCurrency,
  todayIsoDate,
} from '@/lib/utils'
import type { Client, Document, ItemTemplate, SettingsData } from '@/types'
import { InvoiceLineItems } from './InvoiceLineItems'

interface InvoiceFormProps {
  initialDocument?: Document
  defaultNumber?: string
  initialClientId?: string
  settings: SettingsData | null
  onSubmit: (payload: InvoicePayload, status: InvoiceStatus) => Promise<void>
  cancelTo?: string
  saving?: boolean
  errors?: Record<string, string[]>
  formError?: string | null
}

export function InvoiceForm({
  initialDocument,
  defaultNumber = '',
  initialClientId = '',
  settings,
  onSubmit,
  cancelTo = '/invoices',
  saving = false,
  errors = {},
  formError = null,
}: InvoiceFormProps) {
  const defaultCurrency = settings?.invoiceDefaults.currency ?? 'INR'
  const defaultTaxPercent = settings?.invoiceDefaults.defaultTaxPercent ?? 18
  const defaultTermsDays = settings?.invoiceDefaults.paymentTermsDays ?? 30
  const today = todayIsoDate()

  const [clients, setClients] = useState<Client[]>([])
  const [savedItems, setSavedItems] = useState<ItemTemplate[]>([])

  const [clientId, setClientId] = useState(initialDocument?.clientId ?? initialClientId)
  const [number, setNumber] = useState(initialDocument?.number ?? defaultNumber)
  const [currency, setCurrency] = useState(initialDocument?.currency ?? defaultCurrency)
  const [issueDate, setIssueDate] = useState(initialDocument?.issueDate ?? today)
  const [dueDate, setDueDate] = useState(
    initialDocument?.dueDate ?? addDaysToIsoDate(today, defaultTermsDays),
  )
  const [notes, setNotes] = useState(
    initialDocument?.notes ?? settings?.invoiceDefaults.defaultNotes ?? 'Thank you for your business!',
  )
  const [terms, setTerms] = useState(
    initialDocument?.terms ??
      settings?.invoiceDefaults.defaultTerms ??
      `Payment due within ${defaultTermsDays} days.`,
  )
  const [lineItems, setLineItems] = useState<DocumentLineItemInput[]>(
    initialDocument?.lineItems.map((item) => ({
      id: item.id,
      itemTemplateId: item.itemTemplateId,
      name: item.name,
      description: item.description,
      quantity: item.quantity,
      unitPrice: item.unitPrice,
      taxPercent: item.taxPercent,
      discountPercent: item.discountPercent,
    })) ?? [
      {
        itemTemplateId: null,
        name: '',
        description: '',
        quantity: 1,
        unitPrice: 0,
        taxPercent: defaultTaxPercent,
        discountPercent: 0,
      },
    ],
  )

  useEffect(() => {
    let cancelled = false

    Promise.all([getClients(), getItems()])
      .then(([clientList, itemList]) => {
        if (cancelled) return
        setClients(clientList)
        setSavedItems(itemList)
      })
      .catch(() => {
        // Dropdowns remain selectable even if auxiliary lists fail to load
      })

    return () => {
      cancelled = true
    }
  }, [])

  const totals = calculateDocumentTotals(lineItems)
  const currencyOptions = CURRENCIES.map((c) => ({
    value: c.code,
    label: `${c.code} (${c.symbol})`,
  }))

  const submitWithStatus = async (status: InvoiceStatus) => {
    await onSubmit(
      {
        clientId: clientId || null,
        number: number || undefined,
        currency,
        issueDate,
        dueDate: dueDate || null,
        notes,
        terms,
        status,
        lineItems: lineItems.filter((item) => item.name.trim() !== ''),
      },
      status,
    )
  }

  const handleFormSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    await submitWithStatus('sent')
  }

  return (
    <form onSubmit={handleFormSubmit} className="space-y-6">
      {formError && (
        <Card>
          <CardContent className="text-sm text-red-600 dark:text-red-400">
            {formError}
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[1fr_320px]">
        <div className="space-y-6">
          <Card>
            <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <ClientSelect
                clients={clients}
                value={clientId}
                onChange={setClientId}
                error={errors.clientId?.[0]}
              />
              <Input
                label="Invoice Number"
                name="number"
                value={number}
                onChange={(e) => setNumber(e.target.value)}
                error={errors.number?.[0]}
              />
              <Input
                label="Issue Date"
                name="issueDate"
                type="date"
                value={issueDate}
                onChange={(e) => setIssueDate(e.target.value)}
                error={errors.issueDate?.[0]}
                rightIcon={<Calendar className="h-4 w-4" />}
              />
              <Input
                label="Due Date"
                name="dueDate"
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                error={errors.dueDate?.[0]}
                rightIcon={<Calendar className="h-4 w-4" />}
              />
              <Select
                label="Currency"
                name="currency"
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                options={currencyOptions}
              />
            </CardContent>
          </Card>

          <InvoiceLineItems
            items={lineItems}
            savedItems={savedItems}
            currency={currency}
            defaultTaxPercent={defaultTaxPercent}
            onChange={setLineItems}
          />

          <Card>
            <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Textarea
                label="Notes"
                name="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Notes visible to the client"
              />
              <Textarea
                label="Payment Terms"
                name="terms"
                value={terms}
                onChange={(e) => setTerms(e.target.value)}
                placeholder="Payment instructions and terms"
              />
            </CardContent>
          </Card>
        </div>

        <Card className="lg:sticky lg:top-6">
          <CardHeader className="border-b-0 pb-2">
            <CardTitle>Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 pt-2 text-sm">
            <div className="flex items-center justify-between text-slate-600 dark:text-slate-400">
              <span>Subtotal</span>
              <span className="font-medium tabular-nums text-slate-900 dark:text-slate-100">
                {formatCurrency(totals.subtotal, currency)}
              </span>
            </div>
            <div className="flex items-center justify-between text-slate-600 dark:text-slate-400">
              <span>Tax</span>
              <span className="font-medium tabular-nums text-slate-900 dark:text-slate-100">
                {formatCurrency(totals.taxTotal, currency)}
              </span>
            </div>
            <div className="flex items-center justify-between text-slate-600 dark:text-slate-400">
              <span>Discount</span>
              <span className="font-medium tabular-nums text-slate-900 dark:text-slate-100">
                -{formatCurrency(totals.discountTotal, currency)}
              </span>
            </div>
            <div className="border-t border-slate-200 pt-3 dark:border-slate-800">
              <div className="flex items-center justify-between text-base font-bold text-slate-900 dark:text-slate-100">
                <span>Grand Total</span>
                <span className="tabular-nums">{formatCurrency(totals.grandTotal, currency)}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-wrap items-center justify-end gap-3">
        <Link to={cancelTo}>
          <Button variant="outline">Cancel</Button>
        </Link>
        <Button
          variant="secondary"
          onClick={() => void submitWithStatus('draft')}
          disabled={saving}
        >
          Save Draft
        </Button>
        <Button variant="primary" type="submit" disabled={saving}>
          {saving ? 'Saving...' : 'Mark as Sent'}
        </Button>
      </div>
    </form>
  )
}
