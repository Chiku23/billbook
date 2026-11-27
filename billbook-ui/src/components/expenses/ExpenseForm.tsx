import { Link } from 'react-router-dom'
import { Upload } from 'lucide-react'
import { Button, Input, Select, Textarea } from '@/components/ui'
import { CURRENCIES, EXPENSE_CATEGORIES } from '@/lib/constants'

const categoryOptions = EXPENSE_CATEGORIES.map((category) => ({
  value: category,
  label: category,
}))

const currencyOptions = CURRENCIES.map((c) => ({
  value: c.code,
  label: `${c.code} (${c.symbol})`,
}))

interface ExpenseFormProps {
  cancelTo?: string
}

export function ExpenseForm({ cancelTo = '/expenses' }: ExpenseFormProps) {
  return (
    <form className="space-y-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Input label="Date" name="date" type="date" defaultValue="2026-11-22" />
        <Select label="Category" name="category" defaultValue="Software" options={categoryOptions} />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Input label="Amount" name="amount" type="number" placeholder="0.00" />
        <Select label="Currency" name="currency" defaultValue="INR" options={currencyOptions} />
      </div>

      <Input label="Description / Vendor" name="vendor" placeholder="AWS Hosting" />

      <Textarea label="Notes" name="notes" placeholder="Optional expense notes" rows={2} />

      <div className="space-y-1.5">
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
          Receipt
        </label>
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-slate-300 px-6 py-6 text-center dark:border-slate-700">
          <Upload className="h-5 w-5 text-slate-400" />
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
            Drop receipt image here or click to upload
          </p>
          <p className="mt-0.5 text-xs text-slate-400">PNG, JPG up to 5MB</p>
        </div>
      </div>

      <div className="flex items-center justify-end gap-3 pt-2">
        <Link to={cancelTo}>
          <Button variant="outline">Cancel</Button>
        </Link>
        <Button type="submit">Save Expense</Button>
      </div>
    </form>
  )
}
