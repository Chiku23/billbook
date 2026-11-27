import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Package, Plus, Search } from 'lucide-react'
import { deleteItem, getItems } from '@/api/items'
import { ConfirmDialog, EmptyState } from '@/components/common'
import { ItemListItem } from '@/components/items/ItemListItem'
import { PageContainer } from '@/components/layout'
import {
  Button,
  Card,
  CardContent,
  Input,
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui'
import { getApiErrorMessage } from '@/lib/api'
import type { ItemTemplate } from '@/types'

export function ItemListPage() {
  const [items, setItems] = useState<ItemTemplate[]>([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [itemToDelete, setItemToDelete] = useState<ItemTemplate | null>(null)

  useEffect(() => {
    let cancelled = false

    getItems({ search: search || undefined })
      .then((data) => {
        if (!cancelled) {
          setItems(data)
          setError(null)
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setError(getApiErrorMessage(err, 'Failed to load items.'))
        }
      })
      .finally(() => {
        if (!cancelled) {
          setLoading(false)
        }
      })

    return () => {
      cancelled = true
    }
  }, [search])

  const handleConfirmDelete = async () => {
    if (!itemToDelete) return
    try {
      await deleteItem(itemToDelete.id)
      setItems((prev) => prev.filter((item) => item.id !== itemToDelete.id))
      setItemToDelete(null)
    } catch (err) {
      setError(getApiErrorMessage(err, 'Failed to delete item.'))
      setItemToDelete(null)
    }
  }

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
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          leftIcon={<Search className="h-4 w-4" />}
        />

        {error && (
          <Card>
            <CardContent className="text-sm text-red-600 dark:text-red-400">{error}</CardContent>
          </Card>
        )}

        {loading ? (
          <Card>
            <CardContent className="text-sm text-slate-500 dark:text-slate-400">
              Loading saved items...
            </CardContent>
          </Card>
        ) : items.length === 0 ? (
          <EmptyState
            icon={<Package className="h-5 w-5" />}
            title="No saved items found"
            description={
              search
                ? 'No saved items match your search query.'
                : 'Create reusable line-item templates for faster invoicing.'
            }
            action={
              !search && (
                <Link to="/items/new">
                  <Button>
                    <Plus className="h-4 w-4" />
                    Add Item
                  </Button>
                </Link>
              )
            }
          />
        ) : (
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
                {items.map((item) => (
                  <ItemListItem key={item.id} item={item} onDelete={setItemToDelete} />
                ))}
              </TableBody>
            </Table>
          </Card>
        )}
      </div>

      <ConfirmDialog
        open={itemToDelete !== null}
        onClose={() => setItemToDelete(null)}
        onConfirm={handleConfirmDelete}
        title="Delete Item Template"
        description={`Delete "${itemToDelete?.name ?? 'this item'}"? Existing invoices using it will keep their saved line item text.`}
        confirmLabel="Delete"
        destructive
      />
    </PageContainer>
  )
}
