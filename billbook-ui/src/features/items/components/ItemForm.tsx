import { Link } from 'react-router-dom'
import { Button, Input, Textarea } from '@/components/ui'

interface ItemFormProps {
  cancelTo?: string
}

export function ItemForm({ cancelTo = '/items' }: ItemFormProps) {
  return (
    <form className="space-y-4">
      <Input label="Item Name" name="name" placeholder="Web Development" />
      <Textarea label="Description" name="description" placeholder="Default description" rows={2} />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Input label="Default Rate" name="defaultRate" type="number" placeholder="0.00" />
        <Input label="Default Tax %" name="defaultTaxPercent" type="number" defaultValue="18" />
        <Input label="Unit" name="unit" placeholder="hr, unit, project" />
      </div>
      <div className="flex items-center justify-end gap-3 pt-2">
        <Link to={cancelTo}>
          <Button variant="outline">Cancel</Button>
        </Link>
        <Button type="submit">Save Item</Button>
      </div>
    </form>
  )
}
