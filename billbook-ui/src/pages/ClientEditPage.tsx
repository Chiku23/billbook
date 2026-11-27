import { Link, useParams } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { PageContainer } from '@/components/layout'
import { Card, CardContent } from '@/components/ui'
import { ClientForm } from '@/components/clients/ClientForm'

export function ClientEditPage() {
  const { id } = useParams()
  const backTarget = id ? `/clients/${id}` : '/clients'

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
            <ClientForm cancelTo={backTarget} />
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  )
}
