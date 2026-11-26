import { Calendar } from 'lucide-react'
import { Button, Card, CardContent, CardHeader, CardTitle, Input, Textarea } from '@/components/ui'
import { ClientSelect } from '@/features/clients/components/ClientSelect'
import { InvoiceLineItems } from './InvoiceLineItems'

export function InvoiceForm() {
  return (
    <form className="space-y-6">
      <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[1fr_320px]">
        <div className="space-y-6">
          <Card>
            <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <ClientSelect />
              <Input label="Invoice Number" name="number" defaultValue="INV-0042" />
              <Input
                label="Issue Date"
                name="issueDate"
                type="date"
                defaultValue="2026-11-25"
                rightIcon={<Calendar className="h-4 w-4" />}
              />
              <Input
                label="Due Date"
                name="dueDate"
                type="date"
                defaultValue="2026-12-25"
                rightIcon={<Calendar className="h-4 w-4" />}
              />
            </CardContent>
          </Card>

          <InvoiceLineItems />

          <Card>
            <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Textarea
                label="Notes"
                name="notes"
                defaultValue="Thank you for your business!"
                placeholder="Notes visible to the client"
              />
              <Textarea
                label="Payment Terms"
                name="terms"
                defaultValue="Payment due within 30 days."
                placeholder="Payment instructions and terms"
              />
            </CardContent>
          </Card>
        </div>

        <Card className="lg:sticky lg:top-6">
          <CardHeader className="border-b-0 pb-2">
            <CardTitle>Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 pt-2 text-sm">
            <div className="flex items-center justify-between text-slate-600 dark:text-slate-400">
              <span>Subtotal</span>
              <span className="font-medium tabular-nums text-slate-900 dark:text-slate-100">
                ₹68,000.00
              </span>
            </div>
            <div className="flex items-center justify-between text-slate-600 dark:text-slate-400">
              <span>Tax</span>
              <span className="font-medium tabular-nums text-slate-900 dark:text-slate-100">
                ₹11,970.00
              </span>
            </div>
            <div className="flex items-center justify-between text-slate-600 dark:text-slate-400">
              <span>Discount</span>
              <span className="font-medium tabular-nums text-slate-900 dark:text-slate-100">
                -₹1,500.00
              </span>
            </div>
            <div className="border-t border-slate-200 pt-3 dark:border-slate-800">
              <div className="flex items-center justify-between text-base font-bold text-slate-900 dark:text-slate-100">
                <span>Grand Total</span>
                <span className="tabular-nums">₹78,470.00</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-wrap items-center justify-end gap-3">
        <Button variant="secondary">Save Draft</Button>
        <Button variant="outline">Download PDF</Button>
        <Button variant="primary" type="submit">
          Mark as Sent
        </Button>
      </div>
    </form>
  )
}
