import { Plus, Trash2 } from 'lucide-react'
import type { DocumentLineItemInput } from '@/api/invoices'
import { ItemSelect } from '@/components/items/ItemSelect'
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
import { calculateLineItemTotals, formatCurrency } from '@/lib/utils'
import type { ItemTemplate } from '@/types'

interface InvoiceLineItemsProps {
  items: DocumentLineItemInput[]
  savedItems: ItemTemplate[]
  currency: string
  defaultTaxPercent?: number
  onChange: (items: DocumentLineItemInput[]) => void
}

export function InvoiceLineItems({
  items,
  savedItems,
  currency,
  defaultTaxPercent = 18,
  onChange,
}: InvoiceLineItemsProps) {
  const handleFieldChange = (
    index: number,
    field: keyof DocumentLineItemInput,
    value: string | number,
  ) => {
    const next = items.map((item, idx) =>
      idx === index
        ? {
            ...item,
            [field]: value,
          }
        : item,
    )
    onChange(next)
  }

  const handleAddBlank = () => {
    onChange([
      ...items,
      {
        itemTemplateId: null,
        name: '',
        description: '',
        quantity: 1,
        unitPrice: 0,
        taxPercent: defaultTaxPercent,
        discountPercent: 0,
      },
    ])
  }

  const handleSelectSavedItem = (template: ItemTemplate) => {
    onChange([
      ...items,
      {
        itemTemplateId: template.id,
        name: template.name,
        description: template.description,
        quantity: 1,
        unitPrice: template.defaultRate,
        taxPercent: template.defaultTaxPercent,
        discountPercent: 0,
      },
    ])
  }

  const handleRemove = (index: number) => {
    onChange(items.filter((_, idx) => idx !== index))
  }

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
          {items.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={8}
                className="py-6 text-center text-sm text-slate-500 dark:text-slate-400"
              >
                No line items yet. Add a line item or choose a saved item below.
              </TableCell>
            </TableRow>
          ) : (
            items.map((item, index) => {
              const totals = calculateLineItemTotals(item)
              return (
                <TableRow key={item.id ?? `row-${index}`}>
                  <TableCell className="min-w-36">
                    <input
                      type="text"
                      value={item.name}
                      onChange={(e) => handleFieldChange(index, 'name', e.target.value)}
                      placeholder="Item name"
                      required
                      className="w-full rounded-md border border-transparent bg-transparent px-2 py-1 text-sm font-medium text-slate-900 focus:border-slate-300 focus:bg-white focus:outline-none dark:text-slate-100 dark:focus:border-slate-700 dark:focus:bg-slate-900"
                    />
                  </TableCell>
                  <TableCell className="min-w-44">
                    <input
                      type="text"
                      value={item.description}
                      onChange={(e) => handleFieldChange(index, 'description', e.target.value)}
                      placeholder="Description"
                      className="w-full rounded-md border border-transparent bg-transparent px-2 py-1 text-sm text-slate-600 focus:border-slate-300 focus:bg-white focus:outline-none dark:text-slate-300 dark:focus:border-slate-700 dark:focus:bg-slate-900"
                    />
                  </TableCell>
                  <TableCell>
                    <input
                      type="number"
                      step="0.001"
                      min="0"
                      value={item.quantity}
                      onChange={(e) =>
                        handleFieldChange(index, 'quantity', Number(e.target.value))
                      }
                      className="w-16 rounded-md border border-transparent bg-transparent px-2 py-1 text-sm tabular-nums text-slate-900 focus:border-slate-300 focus:bg-white focus:outline-none dark:text-slate-100 dark:focus:border-slate-700 dark:focus:bg-slate-900"
                    />
                  </TableCell>
                  <TableCell>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={item.unitPrice}
                      onChange={(e) =>
                        handleFieldChange(index, 'unitPrice', Number(e.target.value))
                      }
                      className="w-24 rounded-md border border-transparent bg-transparent px-2 py-1 text-sm tabular-nums text-slate-900 focus:border-slate-300 focus:bg-white focus:outline-none dark:text-slate-100 dark:focus:border-slate-700 dark:focus:bg-slate-900"
                    />
                  </TableCell>
                  <TableCell>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      max="100"
                      value={item.taxPercent}
                      onChange={(e) =>
                        handleFieldChange(index, 'taxPercent', Number(e.target.value))
                      }
                      className="w-16 rounded-md border border-transparent bg-transparent px-2 py-1 text-sm tabular-nums text-slate-900 focus:border-slate-300 focus:bg-white focus:outline-none dark:text-slate-100 dark:focus:border-slate-700 dark:focus:bg-slate-900"
                    />
                  </TableCell>
                  <TableCell>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      max="100"
                      value={item.discountPercent}
                      onChange={(e) =>
                        handleFieldChange(index, 'discountPercent', Number(e.target.value))
                      }
                      className="w-16 rounded-md border border-transparent bg-transparent px-2 py-1 text-sm tabular-nums text-slate-900 focus:border-slate-300 focus:bg-white focus:outline-none dark:text-slate-100 dark:focus:border-slate-700 dark:focus:bg-slate-900"
                    />
                  </TableCell>
                  <TableCell className="text-right font-medium tabular-nums text-slate-900 dark:text-slate-100">
                    {formatCurrency(totals.total, currency, 0)}
                  </TableCell>
                  <TableCell>
                    <button
                      type="button"
                      onClick={() => handleRemove(index)}
                      aria-label="Remove line item"
                      className="rounded-md p-1 text-slate-400 hover:bg-slate-100 hover:text-red-600 dark:hover:bg-slate-800 cursor-pointer"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </TableCell>
                </TableRow>
              )
            })
          )}
        </TableBody>
      </Table>

      <CardContent className="flex flex-col gap-3 border-t border-slate-100 px-4 py-3 sm:flex-row sm:items-center sm:justify-between dark:border-slate-800">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleAddBlank}
          className="bg-blue-50 text-blue-700 hover:bg-blue-100 hover:text-blue-800 dark:bg-blue-950/60 dark:text-blue-300 dark:hover:bg-blue-900/60"
        >
          <Plus className="h-4 w-4" />
          Add Line Item
        </Button>

        <div className="w-full sm:w-72">
          <ItemSelect
            items={savedItems}
            currency={currency}
            onSelect={handleSelectSavedItem}
          />
        </div>
      </CardContent>
    </Card>
  )
}
