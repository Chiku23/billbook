import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, Mail, MapPin, Pencil, Phone, FileText } from 'lucide-react'
import { PageContainer } from '@/components/layout'
import {
  Button,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Tabs,
} from '@/components/ui'
import { CurrencyDisplay, StatusBadge } from '@/components/common'

const documentTabs = [
  { id: 'invoices', label: 'Invoices', count: 3 },
  { id: 'quotes', label: 'Quotes', count: 1 },
]

export function ClientDetailPage() {
  const { id } = useParams()
  const clientId = id ?? '2'

  return (
    <PageContainer
      actions={
        <Link to={`/clients/${clientId}/edit`}>
          <Button variant="outline">
            <Pencil className="h-4 w-4" />
            Edit Client
          </Button>
        </Link>
      }
    >
      <div className="space-y-6">
        <Link
          to="/clients"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Clients
        </Link>

        <Card>
          <CardContent className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-slate-200/80 text-sm font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                PN
              </div>
              <div className="space-y-1.5">
                <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100">Priya Nair</h1>
                <div className="flex flex-wrap gap-x-5 gap-y-1 text-sm text-slate-500 dark:text-slate-400">
                  <span className="inline-flex items-center gap-1.5">
                    <Mail className="h-3.5 w-3.5" />
                    priya@nairdesigns.co.in
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <Phone className="h-3.5 w-3.5" />
                    +91 99452 78104
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <MapPin className="h-3.5 w-3.5" />
                    Kochi, Kerala
                  </span>
                </div>
                <p className="text-xs text-slate-400">GSTIN: 32AABCN1234F1Z2</p>
              </div>
            </div>

            <div className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-right dark:border-slate-800 dark:bg-slate-800/50">
              <p className="text-xs text-slate-500 dark:text-slate-400">Total Invoiced</p>
              <p className="mt-0.5 text-lg font-bold text-slate-900 dark:text-slate-100">
                <CurrencyDisplay amount="₹85,000" />
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Tabs items={documentTabs} activeId="invoices" />
            <Link to="/invoices/new">
              <Button variant="outline" size="sm">
                <FileText className="h-3.5 w-3.5" />
                New Invoice for Client
              </Button>
            </Link>
          </div>

          <Card className="overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead>Number</TableHead>
                  <TableHead>Issue Date</TableHead>
                  <TableHead>Due Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="font-medium text-slate-900 dark:text-slate-100">
                    <Link to="/invoices/INV-0041" className="hover:text-blue-600 hover:underline">
                      INV-0041
                    </Link>
                  </TableCell>
                  <TableCell className="text-slate-500 dark:text-slate-400">08 Nov 2026</TableCell>
                  <TableCell className="text-slate-500 dark:text-slate-400">08 Dec 2026</TableCell>
                  <TableCell>
                    <StatusBadge status="paid" />
                  </TableCell>
                  <TableCell className="text-right font-medium text-slate-900 dark:text-slate-100">
                    <CurrencyDisplay amount="₹85,000" />
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </Card>
        </div>
      </div>
    </PageContainer>
  )
}
