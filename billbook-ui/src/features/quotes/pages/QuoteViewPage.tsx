import { Link, useParams } from 'react-router-dom'
import { ArrowRightLeft, Copy, Download, Pencil, Trash2 } from 'lucide-react'
import { PageContainer } from '@/components/layout'
import { Button, Card } from '@/components/ui'
import { StatusBadge } from '@/components/common'
import { QuotePreview } from '../components/QuotePreview'

export function QuoteViewPage() {
  const { id } = useParams()
  const quoteNumber = id ?? 'QT-0015'

  return (
    <PageContainer title="Quote Preview">
      <div className="space-y-6">
        <Card className="flex flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:justify-between print:hidden">
          <div className="flex items-center gap-3">
            <StatusBadge status="sent" />
            <span className="text-sm font-semibold text-slate-900 dark:text-slate-100">
              {quoteNumber}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Link to={`/quotes/${quoteNumber}/edit`}>
              <Button variant="outline" size="sm">
                <Pencil className="h-3.5 w-3.5" />
                Edit
              </Button>
            </Link>
            <Button variant="outline" size="sm">
              <Copy className="h-3.5 w-3.5" />
              Duplicate
            </Button>
            <Button variant="outline" size="sm">
              <Download className="h-3.5 w-3.5" />
              Download PDF
            </Button>
            <Button variant="primary" size="sm">
              <ArrowRightLeft className="h-3.5 w-3.5" />
              Convert to Invoice
            </Button>
            <Button variant="ghost" size="icon" aria-label="Delete quote">
              <Trash2 className="h-4 w-4 text-slate-500 hover:text-red-600" />
            </Button>
          </div>
        </Card>

        <QuotePreview />
      </div>
    </PageContainer>
  )
}
