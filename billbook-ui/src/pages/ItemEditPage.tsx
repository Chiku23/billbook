import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { getItem, updateItem, type ItemPayload } from '@/api/items'
import { ItemForm } from '@/components/items/ItemForm'
import { PageContainer } from '@/components/layout'
import { Card, CardContent } from '@/components/ui'
import { getApiErrorMessage, getApiFieldErrors } from '@/lib/api'

export function ItemEditPage() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [initialData, setInitialData] = useState<ItemPayload | undefined>(undefined)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [errors, setErrors] = useState<Record<string, string[]>>({})
  const [formError, setFormError] = useState<string | null>(null)

  useEffect(() => {
    if (!id) return
    let cancelled = false

    getItem(id)
      .then((item) => {
        if (!cancelled) {
          setInitialData({
            name: item.name,
            description: item.description,
            defaultRate: item.defaultRate,
            defaultTaxPercent: item.defaultTaxPercent,
            unit: item.unit,
          })
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setFormError(getApiErrorMessage(err, 'Failed to load item template.'))
        }
      })
      .finally(() => {
        if (!cancelled) {
          setLoading(false)
        }
      })

    return () => {
      cancelled = true
    }
  }, [id])

  const handleUpdate = async (payload: ItemPayload) => {
    if (!id) return
    setSaving(true)
    setErrors({})
    setFormError(null)

    try {
      await updateItem(id, payload)
      navigate('/items')
    } catch (err) {
      setErrors(getApiFieldErrors(err))
      setFormError(getApiErrorMessage(err, 'Failed to update item template.'))
    } finally {
      setSaving(false)
    }
  }

  return (
    <PageContainer title="Edit Item">
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
            {loading ? (
              <p className="text-sm text-slate-500 dark:text-slate-400">Loading item...</p>
            ) : (
              <ItemForm
                initialData={initialData}
                onSubmit={handleUpdate}
                cancelTo="/items"
                saving={saving}
                errors={errors}
                formError={formError}
              />
            )}
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  )
}
