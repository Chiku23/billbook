# BillBook — UI Architecture & Learning Blueprint

An invoice, quote, client, item template, and expense management React UI designed to connect to the **BillBook Laravel API** (`billbook-api`) while learning React step by step.

---

## Tech Stack (React Basics)

| Layer | Choice | Purpose |
|---|---|---|
| Framework | React 19 + Vite | Component UI and fast local dev server |
| Language | TypeScript (strict) | Type safety matching `billbook-api` JSON contracts |
| Routing | `react-router-dom` | Multi-page layouts, URL params, and navigation |
| Styling | Tailwind CSS v4 | Utility-first styling, dark mode classes, print styles |
| Icons | `lucide-react` | Clean icon components |

---

## Progressive Learning Path

### Stage 1 — Static UI (Current Baseline)
- Static pages and reusable UI primitives (`Button`, `Card`, `Input`, `Select`, `Textarea`, `Table`, `Tabs`, `Modal`, `Badge`).
- Pure JSX/SVG dashboard charts (`RevenueChart`, `ExpenseChart`) with zero chart library overhead.
- Complete navigation across Dashboard, Invoices, Quotes, Clients, Items, Expenses, Settings, and Backup.

### Stage 2 — Beginner React Logic
- Controlled form inputs (`useState`) and form `onSubmit` handlers.
- Client-side line-item math (subtotal, discount, tax, grand total) and search/tab state.
- Fetching and mutating data via `useEffect` + `fetch('http://localhost:8000/api/...')`.

### Stage 3 — Medium React Patterns
- Custom hooks per feature (`useInvoices`, `useClients`, `useItems`, `useExpenses`, `useSettings`).
- React Context (`SettingsContext`) for theme (`light`/`dark`) and business defaults.
- Optimistic UI feedback, loading skeletons, and error banners.

### Stage 4 — Advanced Ecosystem (Optional Later)
- TanStack Query for server-state caching and invalidation.
- React Hook Form + Zod for complex form validation.
- `@react-pdf/renderer` or server-side PDF if browser `window.print()` is not enough.

---

## Routing & Page Map

```
/                           → Dashboard (OverviewCards, Charts, RecentActivity)
/invoices                   → Invoice List
/invoices/new               → Create Invoice
/invoices/:id               → View Invoice (print-ready preview)
/invoices/:id/edit          → Edit Invoice
/quotes                     → Quote List
/quotes/new                 → Create Quote
/quotes/:id                 → View Quote
/quotes/:id/edit            → Edit Quote
/clients                    → Client List
/clients/new                → Add Client
/clients/:id                → Client Detail (profile + linked documents)
/clients/:id/edit           → Edit Client
/items                      → Item Templates List
/items/new                  → Add Item Template
/items/:id/edit             → Edit Item Template
/expenses                   → Expense List
/expenses/new               → Log Expense
/expenses/:id/edit          → Edit Expense
/settings                   → Business Profile, Defaults, Theme
/settings/backup            → JSON Backup / Restore & CSV Export
```

---

## Folder Structure

```
src/
├── App.tsx                 # Router setup, top-level state, and routes
├── main.tsx                # Application entry point
├── pages/                  # Route pages (DashboardPage, InvoiceListPage, SettingsPage, ...)
├── components/
│   ├── ui/                 # Button, Card, Input, Select, Textarea, Table, Tabs, Modal, Badge
│   ├── common/             # StatusBadge, CurrencyDisplay, EmptyState, ConfirmDialog
│   ├── layout/             # RootLayout, Sidebar, Header, PageContainer
│   ├── dashboard/          # OverviewCards, RevenueChart, ExpenseChart, RecentActivity
│   ├── invoices/           # InvoiceForm, InvoiceLineItems, InvoiceListItem, InvoicePreview
│   ├── quotes/             # QuoteForm, QuoteListItem, QuotePreview
│   ├── clients/            # ClientForm, ClientListItem, ClientSelect
│   ├── items/              # ItemForm, ItemListItem, ItemSelect
│   ├── expenses/           # ExpenseForm, ExpenseListItem, ExpenseSummaryCard
│   └── settings/           # BusinessProfileForm, DefaultsForm, ThemeToggle
├── types/                  # TypeScript interfaces matching billbook-api responses
├── lib/
│   ├── constants.ts
│   └── utils.ts
└── styles/
    └── globals.css
```
