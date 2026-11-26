import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Input,
  Select,
  Textarea,
} from '@/components/ui'
import { CURRENCIES } from '@/lib/constants'

const currencyOptions = CURRENCIES.map((c) => ({
  value: c.code,
  label: `${c.code} — ${c.name} (${c.symbol})`,
}))

export function DefaultsForm() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Invoice & Quote Defaults</CardTitle>
        <CardDescription>Pre-filled values when creating a new invoice or quote.</CardDescription>
      </CardHeader>
      <form>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <Select label="Default Currency" name="currency" defaultValue="INR" options={currencyOptions} />
            <Input label="Default Tax %" name="defaultTaxPercent" type="number" defaultValue="18" />
            <Input label="Payment Terms (Days)" name="paymentTermsDays" type="number" defaultValue="30" />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Input label="Invoice Prefix" name="invoicePrefix" defaultValue="INV" />
            <Input label="Quote Prefix" name="quotePrefix" defaultValue="QT" />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Textarea
              label="Default Notes"
              name="defaultNotes"
              defaultValue="Thank you for your business!"
              rows={2}
            />
            <Textarea
              label="Default Terms"
              name="defaultTerms"
              defaultValue="Payment due within 30 days."
              rows={2}
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit">Save Defaults</Button>
        </CardFooter>
      </form>
    </Card>
  )
}
