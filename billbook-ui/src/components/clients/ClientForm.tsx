import { useState, type ChangeEvent, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import type { ClientPayload } from '@/api/clients'
import { Button, Input, Textarea } from '@/components/ui'

interface ClientFormProps {
  initialData?: ClientPayload
  onSubmit: (data: ClientPayload) => Promise<void>
  cancelTo?: string
  saving?: boolean
  errors?: Record<string, string[]>
  formError?: string | null
}

const emptyClient: ClientPayload = {
  name: '',
  email: '',
  phone: '',
  address: '',
  taxId: '',
}

export function ClientForm({
  initialData,
  onSubmit,
  cancelTo = '/clients',
  saving = false,
  errors = {},
  formError = null,
}: ClientFormProps) {
  const [form, setForm] = useState<ClientPayload>(initialData ?? emptyClient)

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
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
        label="Client Name"
        name="name"
        placeholder="Aarav Sharma"
        value={form.name}
        onChange={handleChange}
        error={errors.name?.[0]}
        required
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Input
          label="Email"
          name="email"
          type="email"
          placeholder="name@company.com"
          value={form.email}
          onChange={handleChange}
          error={errors.email?.[0]}
        />
        <Input
          label="Phone"
          name="phone"
          type="tel"
          placeholder="+91 98201 45321"
          value={form.phone}
          onChange={handleChange}
          error={errors.phone?.[0]}
        />
      </div>

      <Input
        label="GSTIN / Tax ID"
        name="taxId"
        placeholder="29ABCDE1234F1Z5"
        value={form.taxId}
        onChange={handleChange}
        error={errors.taxId?.[0]}
      />

      <Textarea
        label="Address"
        name="address"
        placeholder="Street, City, State, PIN"
        value={form.address}
        onChange={handleChange}
        error={errors.address?.[0]}
      />

      <div className="flex items-center justify-end gap-3 pt-2">
        <Link to={cancelTo}>
          <Button variant="outline">Cancel</Button>
        </Link>
        <Button type="submit" disabled={saving}>
          {saving ? 'Saving...' : 'Save Client'}
        </Button>
      </div>
    </form>
  )
}
