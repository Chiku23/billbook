import { Plus, Trash2 } from 'lucide-react'
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
} from '@/components/ui'
import { ItemSelect } from '@/components/items/ItemSelect'

const placeholderItems = [
  {
    id: '1',
    name: 'Web Development',
    description: 'React frontend & API',
    qty: '1',
    unitPrice: '45000',
    taxPercent: '18',
    discountPercent: '0',
    amount: '₹53,100',
  },
  {
    id: '2',
    name: 'Logo Design',
    description: 'Brand kit & SVG files',
    qty: '1',
    unitPrice: '15000',
    taxPercent: '18',
    discountPercent: '10',
    amount: '₹15,930',
  },
  {
    id: '3',
    name: 'Hosting Setup',
    description: 'Cloud deploy & SSL',
    qty: '2',
    unitPrice: '4000',
    taxPercent: '18',
    discountPercent: '0',
    amount: '₹9,440',
  },
]

export function InvoiceLineItems() {
  return (
    <Card className="overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead>Item Name</TableHead>
            <TableHead>Description</TableHead>
            <TableHead className="w-20">Qty</TableHead>
            <TableHead className="w-28">Unit Price</TableHead>
            <TableHead className="w-20">Tax %</TableHead>
            <TableHead className="w-24">Discount %</TableHead>
            <TableHead className="text-right">Amount</TableHead>
            <TableHead className="w-10" />
          </TableRow>
        </TableHeader>
        <TableBody>
          {placeholderItems.map((item) => (
            <TableRow key={item.id}>
              <TableCell className="min-w-36">
                <input
                  type="text"
                  defaultValue={item.name}
                  placeholder="Item name"
                  className="w-full rounded-md border border-transparent bg-transparent px-2 py-1 text-sm font-medium text-slate-900 focus:border-slate-300 focus:bg-white focus:outline-none dark:text-slate-100 dark:focus:border-slate-700 dark:focus:bg-slate-900"
                />
              </TableCell>
              <TableCell className="min-w-44">
                <input
                  type="text"
                  defaultValue={item.description}
                  placeholder="Description"
                  className="w-full rounded-md border border-transparent bg-transparent px-2 py-1 text-sm text-slate-600 focus:border-slate-300 focus:bg-white focus:outline-none dark:text-slate-300 dark:focus:border-slate-700 dark:focus:bg-slate-900"
                />
              </TableCell>
              <TableCell>
                <input
                  type="number"
                  defaultValue={item.qty}
                  className="w-16 rounded-md border border-transparent bg-transparent px-2 py-1 text-sm tabular-nums text-slate-900 focus:border-slate-300 focus:bg-white focus:outline-none dark:text-slate-100 dark:focus:border-slate-700 dark:focus:bg-slate-900"
                />
              </TableCell>
              <TableCell>
                <input
                  type="number"
                  defaultValue={item.unitPrice}
                  className="w-24 rounded-md border border-transparent bg-transparent px-2 py-1 text-sm tabular-nums text-slate-900 focus:border-slate-300 focus:bg-white focus:outline-none dark:text-slate-100 dark:focus:border-slate-700 dark:focus:bg-slate-900"
                />
              </TableCell>
              <TableCell>
                <input
                  type="number"
                  defaultValue={item.taxPercent}
                  className="w-16 rounded-md border border-transparent bg-transparent px-2 py-1 text-sm tabular-nums text-slate-900 focus:border-slate-300 focus:bg-white focus:outline-none dark:text-slate-100 dark:focus:border-slate-700 dark:focus:bg-slate-900"
                />
              </TableCell>
              <TableCell>
                <input
                  type="number"
                  defaultValue={item.discountPercent}
                  className="w-16 rounded-md border border-transparent bg-transparent px-2 py-1 text-sm tabular-nums text-slate-900 focus:border-slate-300 focus:bg-white focus:outline-none dark:text-slate-100 dark:focus:border-slate-700 dark:focus:bg-slate-900"
                />
              </TableCell>
              <TableCell className="text-right font-medium tabular-nums text-slate-900 dark:text-slate-100">
                {item.amount}
              </TableCell>
              <TableCell>
                <button
                  type="button"
                  aria-label="Remove line item"
                  className="rounded-md p-1 text-slate-400 hover:bg-slate-100 hover:text-red-600 dark:hover:bg-slate-800 cursor-pointer"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <CardContent className="flex flex-col gap-3 border-t border-slate-100 px-4 py-3 sm:flex-row sm:items-center sm:justify-between dark:border-slate-800">
        <Button
          variant="ghost"
          size="sm"
          className="bg-blue-50 text-blue-700 hover:bg-blue-100 hover:text-blue-800 dark:bg-blue-950/60 dark:text-blue-300 dark:hover:bg-blue-900/60"
        >
          <Plus className="h-4 w-4" />
          Add Line Item
        </Button>

        <div className="w-full sm:w-72">
          <ItemSelect />
        </div>
      </CardContent>
    </Card>
  )
}
