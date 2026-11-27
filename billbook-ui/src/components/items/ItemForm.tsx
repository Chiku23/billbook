import { useState, type ChangeEvent, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import type { ItemPayload } from '@/api/items'
import { Button, Input, Textarea } from '@/components/ui'

interface ItemFormProps {
  initialData?: ItemPayload
  onSubmit: (data: ItemPayload) => Promise<void>
  cancelTo?: string
  saving?: boolean
  errors?: Record<string, string[]>
  formError?: string | null
}

const emptyItem: ItemPayload = {
  name: '',
  description: '',
  defaultRate: 0,
  defaultTaxPercent: 18,
  unit: 'unit',
}

export function ItemForm({
  initialData,
  onSubmit,
  cancelTo = '/items',
  saving = false,
  errors = {},
  formError = null,
}: ItemFormProps) {
  const [form, setForm] = useState<ItemPayload>(initialData ?? emptyItem)

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target
    setForm((prev) => ({
      ...prev,
      [name]: type === 'number' ? Number(value) : value,
    }))
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    await onSubmit(form)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {formError && (
        <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300">
          {formError}
        </p>
      )}

      <Input
        label="Item Name"
        name="name"
        placeholder="Web Development"
        value={form.name}
        onChange={handleChange}
        error={errors.name?.[0]}
        required
      />

      <Textarea
        label="Description"
        name="description"
        placeholder="Default description"
        value={form.description}
        onChange={handleChange}
        error={errors.description?.[0]}
        rows={2}
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Input
          label="Default Rate"
          name="defaultRate"
          type="number"
          step="0.01"
          min="0"
          value={form.defaultRate}
          onChange={handleChange}
          error={errors.defaultRate?.[0]}
          required
        />
        <Input
          label="Default Tax %"
          name="defaultTaxPercent"
          type="number"
          step="0.01"
          min="0"
          max="100"
          value={form.defaultTaxPercent}
          onChange={handleChange}
          error={errors.defaultTaxPercent?.[0]}
        />
        <Input
          label="Unit"
          name="unit"
          placeholder="hr, unit, project"
          value={form.unit}
          onChange={handleChange}
          error={errors.unit?.[0]}
        />
      </div>

      <div className="flex items-center justify-end gap-3 pt-2">
        <Link to={cancelTo}>
          <Button variant="outline">Cancel</Button>
        </Link>
        <Button type="submit" disabled={saving}>
          {saving ? 'Saving...' : 'Save Item'}
        </Button>
      </div>
    </form>
  )
}
