import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { RootLayout } from '@/components/layout'
import { DashboardPage } from '@/pages/DashboardPage'
import { InvoiceListPage } from '@/pages/InvoiceListPage'
import { InvoiceCreatePage } from '@/pages/InvoiceCreatePage'
import { InvoiceViewPage } from '@/pages/InvoiceViewPage'
import { InvoiceEditPage } from '@/pages/InvoiceEditPage'
import { QuoteListPage } from '@/pages/QuoteListPage'
import { QuoteCreatePage } from '@/pages/QuoteCreatePage'
import { QuoteViewPage } from '@/pages/QuoteViewPage'
import { QuoteEditPage } from '@/pages/QuoteEditPage'
import { ClientListPage } from '@/pages/ClientListPage'
import { ClientCreatePage } from '@/pages/ClientCreatePage'
import { ClientDetailPage } from '@/pages/ClientDetailPage'
import { ClientEditPage } from '@/pages/ClientEditPage'
import { ItemListPage } from '@/pages/ItemListPage'
import { ItemCreatePage } from '@/pages/ItemCreatePage'
import { ItemEditPage } from '@/pages/ItemEditPage'
import { ExpenseListPage } from '@/pages/ExpenseListPage'
import { ExpenseCreatePage } from '@/pages/ExpenseCreatePage'
import { ExpenseEditPage } from '@/pages/ExpenseEditPage'
import { SettingsPage } from '@/pages/SettingsPage'
import { BackupPage } from '@/pages/BackupPage'

export function App() {
  return (
    <BrowserRouter>
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
    </BrowserRouter>
  )
}
