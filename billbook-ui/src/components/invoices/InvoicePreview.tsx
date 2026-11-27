import { ReceiptText } from 'lucide-react'
import { Card } from '@/components/ui'

const previewItems = [
  {
    id: '1',
    name: 'Web Development',
    description: 'React frontend & API',
    qty: '1',
    rate: '₹45,000.00',
    tax: '18%',
    amount: '₹53,100.00',
  },
  {
    id: '2',
    name: 'Logo Design',
    description: 'Brand kit & SVG files',
    qty: '1',
    rate: '₹15,000.00',
    tax: '18%',
    amount: '₹15,930.00',
  },
  {
    id: '3',
    name: 'Hosting Setup',
    description: 'Cloud deploy & SSL',
    qty: '2',
    rate: '₹4,000.00',
    tax: '18%',
    amount: '₹9,440.00',
  },
]

export function InvoicePreview() {
  return (
    <Card className="mx-auto max-w-3xl bg-white p-8 text-slate-900 shadow-sm sm:p-10 dark:bg-slate-900 dark:text-slate-100 print:border-0 print:shadow-none">
      <div className="flex flex-col justify-between gap-6 border-b border-slate-200 pb-6 sm:flex-row sm:items-start dark:border-slate-800">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 bg-slate-50 text-slate-800 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200">
            <ReceiptText className="h-5 w-5" />
          </div>
          <div className="text-sm">
            <p className="font-semibold text-slate-900 dark:text-slate-100">Acme Studio</p>
            <p className="text-slate-500 dark:text-slate-400">223 Indiranagar, Bengaluru</p>
            <p className="text-slate-500 dark:text-slate-400">billing@acmestudio.in</p>
            <p className="text-slate-500 dark:text-slate-400">+91 98765 43210</p>
          </div>
        </div>
        <div className="text-left sm:text-right">
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            INVOICE
          </h2>
        </div>
      </div>

      <div className="mt-6 flex flex-col justify-between gap-6 sm:flex-row">
        <div className="text-sm">
          <p className="font-semibold text-slate-900 dark:text-slate-100">Bill To:</p>
          <p className="mt-1 font-medium text-slate-900 dark:text-slate-100">
            Acme Solutions Pvt Ltd
          </p>
          <p className="text-slate-500 dark:text-slate-400">Aarav Sharma</p>
          <p className="text-slate-500 dark:text-slate-400">Bengaluru, India</p>
        </div>
        <div className="space-y-1.5 text-sm sm:min-w-52">
          <div className="flex justify-between gap-6">
            <span className="text-slate-500 dark:text-slate-400">Invoice #:</span>
            <span className="font-medium text-slate-900 dark:text-slate-100">INV-0042</span>
          </div>
          <div className="flex justify-between gap-6">
            <span className="text-slate-500 dark:text-slate-400">Issue Date:</span>
            <span className="font-medium text-slate-900 dark:text-slate-100">25 Nov 2026</span>
          </div>
          <div className="flex justify-between gap-6">
            <span className="text-slate-500 dark:text-slate-400">Due Date:</span>
            <span className="font-medium text-slate-900 dark:text-slate-100">25 Dec 2026</span>
          </div>
        </div>
      </div>

      <div className="mt-8 overflow-x-auto">
        <table className="w-full border-collapse text-left text-sm">
          <thead>
            <tr className="bg-slate-100 text-xs font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-300">
              <th className="rounded-l-md px-3 py-2.5">Item</th>
              <th className="px-3 py-2.5">Description</th>
              <th className="px-3 py-2.5 text-right">Qty</th>
              <th className="px-3 py-2.5 text-right">Rate</th>
              <th className="px-3 py-2.5 text-right">Tax</th>
              <th className="rounded-r-md px-3 py-2.5 text-right">Amount</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {previewItems.map((item) => (
              <tr key={item.id}>
                <td className="px-3 py-3 font-medium text-slate-900 dark:text-slate-100">
                  {item.name}
                </td>
                <td className="px-3 py-3 text-slate-500 dark:text-slate-400">{item.description}</td>
                <td className="px-3 py-3 text-right tabular-nums">{item.qty}</td>
                <td className="px-3 py-3 text-right tabular-nums">{item.rate}</td>
                <td className="px-3 py-3 text-right tabular-nums">{item.tax}</td>
                <td className="px-3 py-3 text-right font-medium tabular-nums text-slate-900 dark:text-slate-100">
                  {item.amount}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-6 flex justify-end">
        <div className="w-full max-w-xs space-y-2 text-sm">
          <div className="flex justify-between text-slate-600 dark:text-slate-400">
            <span>Subtotal</span>
            <span className="tabular-nums text-slate-900 dark:text-slate-100">₹68,000.00</span>
          </div>
          <div className="flex justify-between text-slate-600 dark:text-slate-400">
            <span>Tax (18% GST)</span>
            <span className="tabular-nums text-slate-900 dark:text-slate-100">₹11,970.00</span>
          </div>
          <div className="flex justify-between border-t border-slate-200 pt-2 text-base font-bold text-slate-900 dark:border-slate-800 dark:text-slate-100">
            <span>Grand Total</span>
            <span className="tabular-nums">₹78,470.00</span>
          </div>
        </div>
      </div>

      <div className="mt-10 space-y-6 border-t border-slate-100 pt-6 text-sm dark:border-slate-800">
        <div>
          <p className="font-semibold text-slate-900 dark:text-slate-100">Notes</p>
          <p className="mt-1 text-slate-600 dark:text-slate-400">Thank you for your business!</p>
        </div>
        <p className="text-xs text-slate-400">
          Payment Terms — Payment due within 30 days of issue date.
        </p>
      </div>
    </Card>
  )
}
