import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Search, Users } from 'lucide-react'
import { deleteClient, getClients } from '@/api/clients'
import { ClientListItem } from '@/components/clients/ClientListItem'
import { ConfirmDialog, EmptyState } from '@/components/common'
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
import type { Client } from '@/types'

export function ClientListPage() {
  const [clients, setClients] = useState<Client[]>([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [clientToDelete, setClientToDelete] = useState<Client | null>(null)

  useEffect(() => {
    let cancelled = false

    getClients({ search: search || undefined })
      .then((data) => {
        if (!cancelled) {
          setClients(data)
          setError(null)
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setError(getApiErrorMessage(err, 'Failed to load clients.'))
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
    if (!clientToDelete) return
    try {
      await deleteClient(clientToDelete.id)
      setClients((prev) => prev.filter((item) => item.id !== clientToDelete.id))
      setClientToDelete(null)
    } catch (err) {
      setError(getApiErrorMessage(err, 'Failed to delete client.'))
      setClientToDelete(null)
    }
  }

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
              Loading clients...
            </CardContent>
          </Card>
        ) : clients.length === 0 ? (
          <EmptyState
            icon={<Users className="h-5 w-5" />}
            title="No clients found"
            description={
              search
                ? 'No clients match your search query.'
                : 'Add your first client to pre-fill invoices and quotes.'
            }
            action={
              !search && (
                <Link to="/clients/new">
                  <Button>
                    <Plus className="h-4 w-4" />
                    Add Client
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
                  <TableHead>Email</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Total Invoiced</TableHead>
                  <TableHead>Last Invoice Date</TableHead>
                  <TableHead className="w-28" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {clients.map((client) => (
                  <ClientListItem
                    key={client.id}
                    client={client}
                    onDelete={setClientToDelete}
                  />
                ))}
              </TableBody>
            </Table>
          </Card>
        )}
      </div>

      <ConfirmDialog
        open={clientToDelete !== null}
        onClose={() => setClientToDelete(null)}
        onConfirm={handleConfirmDelete}
        title="Delete Client"
        description={`Delete ${clientToDelete?.name ?? 'this client'}? Existing invoices will keep their client snapshot.`}
        confirmLabel="Delete"
        destructive
      />
    </PageContainer>
  )
}
