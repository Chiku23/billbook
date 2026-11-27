import { PageContainer } from '@/components/layout'
import { QuoteForm } from '@/components/quotes/QuoteForm'

export function QuoteCreatePage() {
  return (
    <PageContainer title="Create Quote">
      <QuoteForm />
    </PageContainer>
  )
}
