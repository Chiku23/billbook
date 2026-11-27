import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { createClient, type ClientPayload } from '@/api/clients'
import { ClientForm } from '@/components/clients/ClientForm'
import { PageContainer } from '@/components/layout'
import { Card, CardContent } from '@/components/ui'
import { getApiErrorMessage, getApiFieldErrors } from '@/lib/api'

export function ClientCreatePage() {
  const navigate = useNavigate()
  const [saving, setSaving] = useState(false)
  const [errors, setErrors] = useState<Record<string, string[]>>({})
  const [formError, setFormError] = useState<string | null>(null)

  const handleCreate = async (payload: ClientPayload) => {
    setSaving(true)
    setErrors({})
    setFormError(null)

    try {
      const created = await createClient(payload)
      navigate(`/clients/${created.id}`)
    } catch (err) {
      setErrors(getApiFieldErrors(err))
      setFormError(getApiErrorMessage(err, 'Failed to create client.'))
    } finally {
      setSaving(false)
    }
  }

  return (
    <PageContainer title="Add Client">
      <div className="max-w-2xl space-y-4">
        <Link
          to="/clients"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Clients
        </Link>
        <Card>
          <CardContent>
            <ClientForm
              onSubmit={handleCreate}
              cancelTo="/clients"
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
