import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { createItem, type ItemPayload } from '@/api/items'
import { ItemForm } from '@/components/items/ItemForm'
import { PageContainer } from '@/components/layout'
import { Card, CardContent } from '@/components/ui'
import { getApiErrorMessage, getApiFieldErrors } from '@/lib/api'

export function ItemCreatePage() {
  const navigate = useNavigate()
  const [saving, setSaving] = useState(false)
  const [errors, setErrors] = useState<Record<string, string[]>>({})
  const [formError, setFormError] = useState<string | null>(null)

  const handleCreate = async (payload: ItemPayload) => {
    setSaving(true)
    setErrors({})
    setFormError(null)

    try {
      await createItem(payload)
      navigate('/items')
    } catch (err) {
      setErrors(getApiFieldErrors(err))
      setFormError(getApiErrorMessage(err, 'Failed to create item template.'))
    } finally {
      setSaving(false)
    }
  }

  return (
    <PageContainer title="Add Item">
      <div className="max-w-2xl space-y-4">
        <Link
          to="/items"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Items
        </Link>
        <Card>
          <CardContent>
            <ItemForm
              onSubmit={handleCreate}
              cancelTo="/items"
              saving={saving}
              errors={errors}
              formError={formError}
            />
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  )
}
