import { Link } from 'react-router-dom'
import { Plus, Search } from 'lucide-react'
import { PageContainer } from '@/components/layout'
import {
  Button,
  Card,
  Input,
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui'
import { ClientListItem, type ClientListRow } from '../components/ClientListItem'

const placeholderClients: ClientListRow[] = [
  {
    id: '1',
    initials: 'AS',
    name: 'Aarav Sharma',
    email: 'aarav.sharma@techvista.in',
    phone: '+91 98201 45321',
    totalInvoiced: '₹1,45,000',
    lastInvoiceDate: '14 Nov 2026',
  },
  {
    id: '2',
    initials: 'PN',
    name: 'Priya Nair',
    email: 'priya@nairdesigns.co.in',
    phone: '+91 99452 78104',
    totalInvoiced: '₹85,000',
    lastInvoiceDate: '08 Nov 2026',
  },
  {
    id: '3',
    initials: 'RK',
    name: 'Rohan Kulkarni',
    email: 'rohan.k@kulkarnilabs.in',
    phone: '+91 97650 33219',
    totalInvoiced: '₹2,10,500',
    lastInvoiceDate: '02 Nov 2026',
  },
  {
    id: '4',
    initials: 'AI',
    name: 'Ananya Iyer',
    email: 'ananya@iyerconsulting.in',
    phone: '+91 98409 11876',
    totalInvoiced: '₹62,000',
    lastInvoiceDate: '25 Oct 2026',
  },
  {
    id: '5',
    initials: 'VS',
    name: 'Vikram Singh',
    email: 'vikram@jaipurcraft.com',
    phone: '+91 98290 65432',
    totalInvoiced: '₹1,18,000',
    lastInvoiceDate: '18 Oct 2026',
  },
  {
    id: '6',
    initials: 'MD',
    name: 'Meera Deshmukh',
    email: 'meera@deshmukhmedia.in',
    phone: '+91 98220 90415',
    totalInvoiced: '₹48,500',
    lastInvoiceDate: '05 Oct 2026',
  },
]

export function ClientListPage() {
  return (
    <PageContainer
      title="Clients"
      actions={
        <Link to="/clients/new">
          <Button>
            <Plus className="h-4 w-4" />
            Add Client
          </Button>
        </Link>
      }
    >
      <div className="space-y-4">
        <Input
          placeholder="Search clients..."
          leftIcon={<Search className="h-4 w-4" />}
        />

        <Card className="overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Total Invoiced</TableHead>
                <TableHead>Last Invoice Date</TableHead>
                <TableHead className="w-24" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {placeholderClients.map((client) => (
                <ClientListItem key={client.id} client={client} />
              ))}
            </TableBody>
          </Table>
        </Card>
      </div>
    </PageContainer>
  )
}
