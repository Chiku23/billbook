import { Routes, Route } from 'react-router-dom'

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<div>Dashboard</div>} />
      <Route path="/invoices" element={<div>Invoices</div>} />
      <Route path="/invoices/new" element={<div>New Invoice</div>} />
      <Route path="/invoices/:id" element={<div>View Invoice</div>} />
      <Route path="/invoices/:id/edit" element={<div>Edit Invoice</div>} />
      <Route path="/quotes" element={<div>Quotes</div>} />
      <Route path="/quotes/new" element={<div>New Quote</div>} />
      <Route path="/quotes/:id" element={<div>View Quote</div>} />
      <Route path="/quotes/:id/edit" element={<div>Edit Quote</div>} />
      <Route path="/clients" element={<div>Clients</div>} />
      <Route path="/clients/:id" element={<div>Client Detail</div>} />
      <Route path="/expenses" element={<div>Expenses</div>} />
      <Route path="/expenses/new" element={<div>New Expense</div>} />
      <Route path="/settings" element={<div>Settings</div>} />
      <Route path="/settings/backup" element={<div>Backup</div>} />
    </Routes>
  )
}
