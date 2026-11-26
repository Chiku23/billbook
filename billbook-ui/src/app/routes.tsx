import { Navigate, Route, Routes } from 'react-router-dom'
import { RootLayout } from '@/components/layout'
import { DashboardPage } from '@/features/dashboard/pages/DashboardPage'
import { InvoiceListPage } from '@/features/invoices/pages/InvoiceListPage'
import { InvoiceCreatePage } from '@/features/invoices/pages/InvoiceCreatePage'
import { InvoiceViewPage } from '@/features/invoices/pages/InvoiceViewPage'
import { InvoiceEditPage } from '@/features/invoices/pages/InvoiceEditPage'
import { QuoteListPage } from '@/features/quotes/pages/QuoteListPage'
import { QuoteCreatePage } from '@/features/quotes/pages/QuoteCreatePage'
import { QuoteViewPage } from '@/features/quotes/pages/QuoteViewPage'
import { QuoteEditPage } from '@/features/quotes/pages/QuoteEditPage'
import { ClientListPage } from '@/features/clients/pages/ClientListPage'
import { ClientCreatePage } from '@/features/clients/pages/ClientCreatePage'
import { ClientEditPage } from '@/features/clients/pages/ClientEditPage'
import { ClientDetailPage } from '@/features/clients/pages/ClientDetailPage'
import { ItemListPage } from '@/features/items/pages/ItemListPage'
import { ItemCreatePage } from '@/features/items/pages/ItemCreatePage'
import { ItemEditPage } from '@/features/items/pages/ItemEditPage'
import { ExpenseListPage } from '@/features/expenses/pages/ExpenseListPage'
import { ExpenseCreatePage } from '@/features/expenses/pages/ExpenseCreatePage'
import { ExpenseEditPage } from '@/features/expenses/pages/ExpenseEditPage'
import { SettingsPage } from '@/features/settings/pages/SettingsPage'
import { BackupPage } from '@/features/backup/pages/BackupPage'

export function AppRoutes() {
  return (
    <Routes>
      <Route element={<RootLayout />}>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/invoices" element={<InvoiceListPage />} />
        <Route path="/invoices/new" element={<InvoiceCreatePage />} />
        <Route path="/invoices/:id" element={<InvoiceViewPage />} />
        <Route path="/invoices/:id/edit" element={<InvoiceEditPage />} />
        <Route path="/quotes" element={<QuoteListPage />} />
        <Route path="/quotes/new" element={<QuoteCreatePage />} />
        <Route path="/quotes/:id" element={<QuoteViewPage />} />
        <Route path="/quotes/:id/edit" element={<QuoteEditPage />} />
        <Route path="/clients" element={<ClientListPage />} />
        <Route path="/clients/new" element={<ClientCreatePage />} />
        <Route path="/clients/:id" element={<ClientDetailPage />} />
        <Route path="/clients/:id/edit" element={<ClientEditPage />} />
        <Route path="/items" element={<ItemListPage />} />
        <Route path="/items/new" element={<ItemCreatePage />} />
        <Route path="/items/:id/edit" element={<ItemEditPage />} />
        <Route path="/expenses" element={<ExpenseListPage />} />
        <Route path="/expenses/new" element={<ExpenseCreatePage />} />
        <Route path="/expenses/:id/edit" element={<ExpenseEditPage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/settings/backup" element={<BackupPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  )
}
