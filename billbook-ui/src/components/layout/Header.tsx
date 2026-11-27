import { Menu, Moon, Sun, ReceiptText } from 'lucide-react'
import { useState } from 'react'

export function Header() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light')

  const handleToggleTheme = () => {
    const nextTheme = theme === 'light' ? 'dark' : 'light'
    setTheme(nextTheme)
    document.documentElement.classList.toggle('dark', nextTheme === 'dark')
  }
  return (
    <header className="flex h-14 items-center justify-between border-b border-slate-200 bg-white px-4 sm:px-6 lg:border-b-0 lg:bg-transparent lg:px-8 dark:border-slate-800 dark:bg-slate-900 lg:dark:bg-transparent print:hidden">
      <div className="flex items-center gap-3 lg:hidden">
        <button
          type="button"
          aria-label="Open navigation menu"
          className="rounded-lg p-1.5 text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
        >
          <Menu className="h-5 w-5" />
        </button>
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-slate-900 text-white dark:bg-blue-600">
            <ReceiptText className="h-3.5 w-3.5" />
          </div>
          <span className="text-sm font-semibold text-slate-900 dark:text-slate-100">BillBook</span>
        </div>
      </div>

      <div className="hidden lg:block" />

      <button
        type="button"
        aria-label="Toggle theme"
        className="inline-flex relative items-center gap-1.5 rounded-full border border-slate-200 bg-white px-2.5 py-1 text-slate-600 shadow-2xs transition-colors hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 cursor-pointer"
        onClick={handleToggleTheme}
        title={`Switch to ${theme==='light'?'Dark':'Light'} mode`}
      >
        <Moon className="h-3.5 w-3.5" />
        <span className={`absolute h-4 w-4 rounded-full bg-slate-900 dark:bg-slate-100 ${theme === 'light'? ' translate-x-[130%]':''}`} />
        <Sun className="h-3.5 w-3.5" />
      </button>
    </header>
  )
}
