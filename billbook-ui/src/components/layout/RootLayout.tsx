import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import type { Theme } from '@/App'
import { Header } from './Header'
import { Sidebar } from './Sidebar'

interface RootLayoutProps {
  theme: Theme
  onToggleTheme: () => void
}

export function RootLayout({ theme, onToggleTheme }: RootLayoutProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <Sidebar mobileOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />
      <div className="flex min-w-0 flex-1 flex-col">
        <Header
          theme={theme}
          onToggleTheme={onToggleTheme}
          onOpenMenu={() => setMobileMenuOpen(true)}
        />
        <main className="flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
