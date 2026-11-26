import { Link } from 'react-router-dom'
import { Button, Input, Textarea } from '@/components/ui'

interface ClientFormProps {
  cancelTo?: string
}

export function ClientForm({ cancelTo = '/clients' }: ClientFormProps) {
  return (
    <form className="space-y-4">
      <Input label="Client Name" name="name" placeholder="Aarav Sharma" />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Input label="Email" name="email" type="email" placeholder="name@company.com" />
        <Input label="Phone" name="phone" type="tel" placeholder="+91 98201 45321" />
      </div>
      <Input label="GSTIN / Tax ID" name="taxId" placeholder="29ABCDE1234F1Z5" />
      <Textarea label="Address" name="address" placeholder="Street, City, State, PIN" />
      <div className="flex items-center justify-end gap-3 pt-2">
        <Link to={cancelTo}>
          <Button variant="outline">Cancel</Button>
        </Link>
        <Button type="submit">Save Client</Button>
      </div>
    </form>
  )
}
