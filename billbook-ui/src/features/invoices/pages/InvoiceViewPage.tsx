import { Link, useParams } from 'react-router-dom'
import { Copy, Download, Check, Pencil, Trash2 } from 'lucide-react'
import { PageContainer } from '@/components/layout'
import { Button, Card } from '@/components/ui'
import { StatusBadge } from '@/components/common'
import { InvoicePreview } from '../components/InvoicePreview'

export function InvoiceViewPage() {
  const { id } = useParams()
  const invoiceNumber = id ?? 'INV-0042'

  return (
    <PageContainer title="Invoice Preview">
      <div className="space-y-6">
        <Card className="flex flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:justify-between print:hidden">
          <div className="flex items-center gap-3">
            <StatusBadge status="sent" />
            <span className="text-sm font-semibold text-slate-900 dark:text-slate-100">
              {invoiceNumber}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Link to={`/invoices/${invoiceNumber}/edit`}>
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
            <Button variant="outline" size="sm">
              <Check className="h-3.5 w-3.5" />
              Mark as Paid
            </Button>
            <Button variant="ghost" size="icon" aria-label="Delete invoice">
              <Trash2 className="h-4 w-4 text-slate-500 hover:text-red-600" />
            </Button>
          </div>
        </Card>

        <InvoicePreview />
      </div>
    </PageContainer>
  )
}
