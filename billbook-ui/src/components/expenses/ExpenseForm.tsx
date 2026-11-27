import { useEffect, useRef, useState, type ChangeEvent, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { Trash2, Upload } from 'lucide-react'
import { getMeta } from '@/api/system'
import { Button, Input, Select, Textarea } from '@/components/ui'
import { CURRENCIES, EXPENSE_CATEGORIES } from '@/lib/constants'
import { todayIsoDate } from '@/lib/utils'
import type { Expense } from '@/types'

interface ExpenseFormProps {
  initialData?: Expense
  defaultCurrency?: string
  onSubmit: (formData: FormData) => Promise<void>
  cancelTo?: string
  saving?: boolean
  errors?: Record<string, string[]>
  formError?: string | null
}

export function ExpenseForm({
  initialData,
  defaultCurrency = 'INR',
  onSubmit,
  cancelTo = '/expenses',
  saving = false,
  errors = {},
  formError = null,
}: ExpenseFormProps) {
  const [date, setDate] = useState(initialData?.date ?? todayIsoDate())
  const [category, setCategory] = useState(initialData?.category ?? 'Software')
  const [amount, setAmount] = useState(initialData ? String(initialData.amount) : '')
  const [currency, setCurrency] = useState(initialData?.currency ?? defaultCurrency)
  const [vendor, setVendor] = useState(initialData?.vendor ?? '')
  const [notes, setNotes] = useState(initialData?.notes ?? '')
  const [receiptFile, setReceiptFile] = useState<File | null>(null)
  const [existingReceipt, setExistingReceipt] = useState<string | null>(
    initialData?.receiptUrl ?? initialData?.receiptBase64 ?? null,
  )
  const [removeReceipt, setRemoveReceipt] = useState(false)
  const [categories, setCategories] = useState<string[]>([...EXPENSE_CATEGORIES])
  const [currencyOptions, setCurrencyOptions] = useState<Array<{ value: string; label: string }>>(
    CURRENCIES.map((c) => ({ value: c.code, label: `${c.code} (${c.symbol})` })),
  )

  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    let cancelled = false

    getMeta()
      .then((meta) => {
        if (cancelled) return
        if (meta.expenseCategories.length > 0) {
          setCategories(meta.expenseCategories)
        }
        if (meta.currencies.length > 0) {
          setCurrencyOptions(
            meta.currencies.map((c) => ({ value: c.code, label: `${c.code} (${c.symbol})` })),
          )
        }
      })
      .catch(() => {
        // Fallback to static constants
      })

    return () => {
      cancelled = true
    }
  }, [])

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null
    if (!file) return
    setReceiptFile(file)
    setRemoveReceipt(false)
  }

  const handleClearReceipt = () => {
    setReceiptFile(null)
    setExistingReceipt(null)
    setRemoveReceipt(true)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData()
    formData.append('date', date)
    formData.append('category', category)
    formData.append('amount', amount || '0')
    formData.append('currency', currency)
    formData.append('vendor', vendor)
    formData.append('notes', notes)

    if (receiptFile) {
      formData.append('receipt', receiptFile)
    }
    if (removeReceipt) {
      formData.append('removeReceipt', '1')
    }

    await onSubmit(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {formError && (
        <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300">
          {formError}
        </p>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Input
          label="Date"
          name="date"
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          error={errors.date?.[0]}
          required
        />
        <Select
          label="Category"
          name="category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          options={categories.map((cat) => ({ value: cat, label: cat }))}
          error={errors.category?.[0]}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Input
          label="Amount"
          name="amount"
          type="number"
          step="0.01"
          min="0"
          placeholder="0.00"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          error={errors.amount?.[0]}
          required
        />
        <Select
          label="Currency"
          name="currency"
          value={currency}
          onChange={(e) => setCurrency(e.target.value)}
          options={currencyOptions}
          error={errors.currency?.[0]}
        />
      </div>

      <Input
        label="Description / Vendor"
        name="vendor"
        placeholder="AWS Hosting"
        value={vendor}
        onChange={(e) => setVendor(e.target.value)}
        error={errors.vendor?.[0]}
        required
      />

      <Textarea
        label="Notes"
        name="notes"
        placeholder="Optional expense notes"
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        error={errors.notes?.[0]}
        rows={2}
      />

      <div className="space-y-1.5">
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
          Receipt
        </label>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/png,image/jpeg,image/webp,application/pdf"
          onChange={handleFileChange}
          className="hidden"
        />
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="flex w-full cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed border-slate-300 px-6 py-6 text-center transition-colors hover:border-slate-400 hover:bg-slate-50/70 dark:border-slate-700 dark:hover:border-slate-600 dark:hover:bg-slate-800/40"
        >
          <Upload className="h-5 w-5 text-slate-400" />
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
            {receiptFile
              ? receiptFile.name
              : existingReceipt
                ? 'Replace existing receipt'
                : 'Click to upload receipt image or PDF'}
          </p>
          <p className="mt-0.5 text-xs text-slate-400">PNG, JPG, WEBP, or PDF up to 5MB</p>
        </button>

        {(receiptFile || existingReceipt) && (
          <div className="flex items-center justify-between pt-1 text-xs text-slate-500 dark:text-slate-400">
            {existingReceipt && !receiptFile ? (
              <a
                href={existingReceipt}
                target="_blank"
                rel="noreferrer"
                className="text-blue-600 hover:underline dark:text-blue-400"
              >
                View current receipt
              </a>
            ) : (
              <span>Selected: {receiptFile?.name}</span>
            )}
            <Button variant="ghost" size="sm" onClick={handleClearReceipt}>
              <Trash2 className="h-3.5 w-3.5" />
              Remove receipt
            </Button>
          </div>
        )}
        {errors.receipt?.[0] && (
          <p className="text-xs text-red-600 dark:text-red-400">{errors.receipt[0]}</p>
        )}
      </div>

      <div className="flex items-center justify-end gap-3 pt-2">
        <Link to={cancelTo}>
          <Button variant="outline">Cancel</Button>
        </Link>
        <Button type="submit" disabled={saving}>
          {saving ? 'Saving...' : 'Save Expense'}
        </Button>
      </div>
    </form>
  )
}
