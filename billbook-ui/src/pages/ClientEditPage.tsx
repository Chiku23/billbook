import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { getClient, updateClient, type ClientPayload } from '@/api/clients'
import { ClientForm } from '@/components/clients/ClientForm'
import { PageContainer } from '@/components/layout'
import { Card, CardContent } from '@/components/ui'
import { getApiErrorMessage, getApiFieldErrors } from '@/lib/api'

export function ClientEditPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const backTarget = id ? `/clients/${id}` : '/clients'

  const [initialData, setInitialData] = useState<ClientPayload | undefined>(undefined)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [errors, setErrors] = useState<Record<string, string[]>>({})
  const [formError, setFormError] = useState<string | null>(null)

  useEffect(() => {
    if (!id) return
    let cancelled = false

    getClient(id)
      .then((client) => {
        if (!cancelled) {
          setInitialData({
            name: client.name,
            email: client.email,
            phone: client.phone,
            address: client.address,
            taxId: client.taxId,
          })
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setFormError(getApiErrorMessage(err, 'Failed to load client.'))
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

  const handleUpdate = async (payload: ClientPayload) => {
    if (!id) return
    setSaving(true)
    setErrors({})
    setFormError(null)

    try {
      await updateClient(id, payload)
      navigate(backTarget)
    } catch (err) {
      setErrors(getApiFieldErrors(err))
      setFormError(getApiErrorMessage(err, 'Failed to update client.'))
    } finally {
      setSaving(false)
    }
  }

  return (
    <PageContainer title="Edit Client">
      <div className="max-w-2xl space-y-4">
        <Link
          to={backTarget}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Client
        </Link>
        <Card>
          <CardContent>
            {loading ? (
              <p className="text-sm text-slate-500 dark:text-slate-400">Loading client...</p>
            ) : (
              <ClientForm
                initialData={initialData}
                onSubmit={handleUpdate}
                cancelTo={backTarget}
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
