import { PageContainer } from '@/components/layout'
import { InvoiceForm } from '../components/InvoiceForm'

export function InvoiceCreatePage() {
  return (
    <PageContainer title="Create Invoice">
      <InvoiceForm />
    </PageContainer>
  )
}
