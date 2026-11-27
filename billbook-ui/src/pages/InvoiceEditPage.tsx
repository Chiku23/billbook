import { PageContainer } from '@/components/layout'
import { InvoiceForm } from '@/components/invoices/InvoiceForm'

export function InvoiceEditPage() {
  return (
    <PageContainer title="Edit Invoice">
      <InvoiceForm />
    </PageContainer>
  )
}
