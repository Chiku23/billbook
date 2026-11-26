import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard,
  FileText,
  FileCheck2,
  Users,
  Package,
  Wallet,
  Settings,
  ReceiptText,
} from 'lucide-react'
import { cn } from '@/lib/utils'

const navItems = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/invoices', label: 'Invoices', icon: FileText },
  { to: '/quotes', label: 'Quotes', icon: FileCheck2 },
  { to: '/clients', label: 'Clients', icon: Users },
  { to: '/items', label: 'Items', icon: Package },
  { to: '/expenses', label: 'Expenses', icon: Wallet },
  { to: '/settings', label: 'Settings', icon: Settings },
]

export function Sidebar() {
  return (
    <aside className="hidden lg:flex lg:w-60 lg:flex-col lg:shrink-0 border-r border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 print:hidden">
      <div className="flex h-16 items-center gap-2.5 px-5">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-900 text-white dark:bg-blue-600">
          <ReceiptText className="h-4 w-4" />
        </div>
        <span className="text-base font-semibold tracking-tight text-slate-900 dark:text-slate-100">
          BillBook
        </span>
      </div>

      <nav aria-label="Primary navigation" className="flex-1 space-y-1 px-3 py-3">
        {navItems.map((item) => {
          const Icon = item.icon
          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800/60 dark:hover:text-slate-100',
                )
              }
            >
              <Icon className="h-4 w-4 shrink-0" />
              <span>{item.label}</span>
            </NavLink>
          )
        })}
      </nav>
    </aside>
  )
}
