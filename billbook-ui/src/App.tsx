import { useEffect, useState } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { getSettings, updateTheme } from '@/api/settings'
import { RootLayout } from '@/components/layout'
import { BackupPage } from '@/pages/BackupPage'
import { ClientCreatePage } from '@/pages/ClientCreatePage'
import { ClientDetailPage } from '@/pages/ClientDetailPage'
import { ClientEditPage } from '@/pages/ClientEditPage'
import { ClientListPage } from '@/pages/ClientListPage'
import { DashboardPage } from '@/pages/DashboardPage'
import { ExpenseCreatePage } from '@/pages/ExpenseCreatePage'
import { ExpenseEditPage } from '@/pages/ExpenseEditPage'
import { ExpenseListPage } from '@/pages/ExpenseListPage'
import { InvoiceCreatePage } from '@/pages/InvoiceCreatePage'
import { InvoiceEditPage } from '@/pages/InvoiceEditPage'
import { InvoiceListPage } from '@/pages/InvoiceListPage'
import { InvoiceViewPage } from '@/pages/InvoiceViewPage'
import { ItemCreatePage } from '@/pages/ItemCreatePage'
import { ItemEditPage } from '@/pages/ItemEditPage'
import { ItemListPage } from '@/pages/ItemListPage'
import { QuoteCreatePage } from '@/pages/QuoteCreatePage'
import { QuoteEditPage } from '@/pages/QuoteEditPage'
import { QuoteListPage } from '@/pages/QuoteListPage'
import { QuoteViewPage } from '@/pages/QuoteViewPage'
import { SettingsPage } from '@/pages/SettingsPage'
import type { SettingsData } from '@/types'

export type Theme = 'light' | 'dark'

export function App() {
  const [theme, setTheme] = useState<Theme>('light')
  const [settings, setSettings] = useState<SettingsData | null>(null)

  useEffect(() => {
    let cancelled = false

    getSettings()
      .then((data) => {
        if (cancelled) return
        setSettings(data)
        setTheme(data.theme)
        document.documentElement.classList.toggle('dark', data.theme === 'dark')
      })
      .catch(() => {
        // Keep default light theme when API is unreachable on startup
      })

    return () => {
      cancelled = true
    }
  }, [])

  const handleChangeTheme = async (nextTheme: Theme) => {
    setTheme(nextTheme)
    document.documentElement.classList.toggle('dark', nextTheme === 'dark')

    try {
      const updated = await updateTheme(nextTheme)
      setSettings(updated)
    } catch {
      // Visual toggle stays responsive even if persistence fails
    }
  }

  const handleToggleTheme = () => {
    const nextTheme: Theme = theme === 'light' ? 'dark' : 'light'
    void handleChangeTheme(nextTheme)
  }

  const handleSettingsUpdated = (updated: SettingsData) => {
    setSettings(updated)
    setTheme(updated.theme)
    document.documentElement.classList.toggle('dark', updated.theme === 'dark')
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route element={<RootLayout theme={theme} onToggleTheme={handleToggleTheme} />}>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/invoices" element={<InvoiceListPage />} />
          <Route path="/invoices/new" element={<InvoiceCreatePage settings={settings} />} />
          <Route path="/invoices/:id" element={<InvoiceViewPage settings={settings} />} />
          <Route path="/invoices/:id/edit" element={<InvoiceEditPage settings={settings} />} />
          <Route path="/quotes" element={<QuoteListPage />} />
          <Route path="/quotes/new" element={<QuoteCreatePage settings={settings} />} />
          <Route path="/quotes/:id" element={<QuoteViewPage settings={settings} />} />
          <Route path="/quotes/:id/edit" element={<QuoteEditPage settings={settings} />} />
          <Route path="/clients" element={<ClientListPage />} />
          <Route path="/clients/new" element={<ClientCreatePage />} />
          <Route path="/clients/:id" element={<ClientDetailPage />} />
          <Route path="/clients/:id/edit" element={<ClientEditPage />} />
          <Route path="/items" element={<ItemListPage />} />
          <Route path="/items/new" element={<ItemCreatePage />} />
          <Route path="/items/:id/edit" element={<ItemEditPage />} />
          <Route path="/expenses" element={<ExpenseListPage />} />
          <Route path="/expenses/new" element={<ExpenseCreatePage settings={settings} />} />
          <Route path="/expenses/:id/edit" element={<ExpenseEditPage />} />
          <Route
            path="/settings"
            element={
              <SettingsPage
                theme={theme}
                settings={settings}
                onChangeTheme={handleChangeTheme}
                onSettingsUpdated={handleSettingsUpdated}
              />
            }
          />
          <Route path="/settings/backup" element={<BackupPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
