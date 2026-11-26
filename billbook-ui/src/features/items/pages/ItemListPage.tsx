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
import { ItemListItem, type ItemListRow } from '../components/ItemListItem'

const placeholderItems: ItemListRow[] = [
  {
    id: 'item-web-dev',
    name: 'Web Development',
    description: 'React frontend & API',
    unit: 'project',
    defaultRate: '₹45,000',
    defaultTaxPercent: '18',
  },
  {
    id: 'item-logo-design',
    name: 'Logo Design',
    description: 'Brand kit & SVG files',
    unit: 'unit',
    defaultRate: '₹15,000',
    defaultTaxPercent: '18',
  },
  {
    id: 'item-hosting-setup',
    name: 'Hosting Setup',
    description: 'Cloud deploy & SSL',
    unit: 'unit',
    defaultRate: '₹4,000',
    defaultTaxPercent: '18',
  },
  {
    id: 'item-ui-ux-sprint',
    name: 'UI/UX Design Sprint',
    description: 'Wireframes and interactive prototype',
    unit: 'sprint',
    defaultRate: '₹28,000',
    defaultTaxPercent: '18',
  },
]

export function ItemListPage() {
  return (
    <PageContainer
      title="Items"
      actions={
        <Link to="/items/new">
          <Button>
            <Plus className="h-4 w-4" />
            Add Item
          </Button>
        </Link>
      }
    >
      <div className="space-y-4">
        <Input
          placeholder="Search saved items..."
          leftIcon={<Search className="h-4 w-4" />}
        />

        <Card className="overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead>Name</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Unit</TableHead>
                <TableHead className="text-right">Default Rate</TableHead>
                <TableHead className="text-right">Tax %</TableHead>
                <TableHead className="w-24" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {placeholderItems.map((item) => (
                <ItemListItem key={item.id} item={item} />
              ))}
            </TableBody>
          </Table>
        </Card>
      </div>
    </PageContainer>
  )
}
