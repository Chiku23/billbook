# BillBook — Architecture & Feature Blueprint

A local-first, browser-based invoice, quote, and expense management tool for freelancers and small agencies. No mandatory backend — all data lives in the browser with optional export/import.

---

## Table of Contents
1. [Feature Specification](#feature-specification)
2. [Tech Stack](#tech-stack)
3. [Application Architecture](#application-architecture)
4. [Folder Structure](#folder-structure)
5. [Data Models](#data-models)
6. [State Management Strategy](#state-management-strategy)
7. [Routing & Page Map](#routing--page-map)
8. [Key UI Screens](#key-ui-screens)
9. [PDF Generation Strategy](#pdf-generation-strategy)
10. [Persistence Layer](#persistence-layer)
11. [Build Phases](#build-phases)

---

## Feature Specification

### Core — Invoice & Quote Management
| Feature | Description |
|---|---|
| Create Invoice / Quote | Multi-line-item form with item name, description, quantity, unit price, tax %, and discount. |
| Duplicate | Clone an existing invoice/quote as a new draft. |
| Convert Quote → Invoice | One-click conversion that preserves all line items and client info. |
| Status Workflow | `Draft` → `Sent` → `Paid` / `Overdue` for invoices. `Draft` → `Sent` → `Accepted` / `Declined` for quotes. |
| Auto Numbering | Sequential invoice/quote numbers with configurable prefix (e.g., `INV-0042`). |
| Due Date & Overdue Flag | Auto-computed overdue status based on due date vs. current date. |
| Notes & Terms | Per-document free-text fields for payment terms, thank-you notes, etc. |
| Currency Selection | Support for common currencies with symbol formatting. |

### Client Directory
| Feature | Description |
|---|---|
| Client CRUD | Name, email, phone, address, GSTIN/tax ID. |
| Client Linking | Associate any invoice/quote to a saved client; auto-fill fields. |
| Client History | View all invoices and quotes tied to a client in one place. |

### Item Templates
| Feature | Description |
|---|---|
| Saved Items | Reusable line-item templates (name, default rate, tax %, unit). |
| Quick Add | Search and insert a saved item into any invoice with one click. |

### Expense Tracking
| Feature | Description |
|---|---|
| Log Expenses | Date, category, amount, vendor, notes, and optional receipt image (stored as base64 or object URL). |
| Categories | Configurable categories (`Travel`, `Software`, `Office Supplies`, etc.). |
| Monthly Summary | Aggregate expenses by category for a given month. |

### Dashboard & Reports
| Feature | Description |
|---|---|
| Overview Cards | Total invoiced, total paid, total outstanding, total expenses (current month / all time). |
| Revenue Chart | Monthly revenue bar chart (paid invoices). |
| Expense Chart | Monthly expense breakdown by category (pie or bar). |
| Recent Activity | Last 10 created/updated documents. |

### Export, Import & Backup
| Feature | Description |
|---|---|
| PDF Export | Download any invoice/quote as a clean, print-ready PDF. |
| JSON Backup | Export all data (invoices, quotes, clients, items, expenses, settings) as a single JSON file. |
| JSON Restore | Import a backup JSON to restore or migrate data. |
| CSV Export | Export invoice or expense lists as CSV for spreadsheet use. |

### Settings & Personalization
| Feature | Description |
|---|---|
| Business Profile | Company name, logo (base64), address, email, phone, tax ID — printed on every invoice/quote header. |
| Invoice Defaults | Default currency, tax rate, payment terms, and notes. |
| Theme | Light / Dark mode toggle. |

---

## Tech Stack

| Layer | Choice | Rationale |
|---|---|---|
| Framework | React 18+ (Vite) | Fast dev server, native ESM, modern defaults. |
| Language | TypeScript (strict) | Type safety across data models, forms, and hooks. |
| Routing | React Router v6 | Nested layouts, URL params for document IDs, search-param filters on list pages. |
| State (Client UI) | Zustand | Lightweight, no boilerplate, supports middleware (persist, devtools, immer). |
| State (Server/Async) | TanStack Query (optional, for future API sync) | Not required in Phase 1; add when/if a backend is introduced. |
| Forms | React Hook Form + Zod | Performant uncontrolled forms with schema-based validation. |
| Styling | Tailwind CSS | Utility-first, easy print styles, dark mode support via class strategy. |
| Charts | Recharts | Lightweight, composable React charting library. |
| PDF Generation | `@react-pdf/renderer` | Render React components directly to PDF in the browser. |
| Persistence | Dexie.js (IndexedDB wrapper) | Structured, queryable, async local storage with good TypeScript support. |
| Icons | Lucide React | Clean, consistent icon set. |
| Date Handling | `date-fns` | Tree-shakeable, no-mutation date utilities. |
| Notifications | `sonner` | Minimal toast library. |

---

## Application Architecture

```
┌─────────────────────────────────────────────────────────┐
│                      UI Layer                           │
│  Pages ─► Feature Components ─► Shared UI Components    │
├─────────────────────────────────────────────────────────┤
│                    Hook Layer                           │
│  useInvoices · useClients · useExpenses · useSettings   │
│  useAutoSave · usePdfExport · useBackup · useDarkMode   │
├─────────────────────────────────────────────────────────┤
│                   Store Layer (Zustand)                  │
│  uiStore (modals, toasts, sidebar)                      │
│  settingsStore (business profile, defaults, theme)      │
├─────────────────────────────────────────────────────────┤
│                 Persistence Layer (Dexie)                │
│  invoices · quotes · clients · items · expenses         │
├─────────────────────────────────────────────────────────┤
│                  IndexedDB (Browser)                    │
└─────────────────────────────────────────────────────────┘
```

### Data Flow
1. **Read:** Custom hooks query Dexie tables → return data to components.
2. **Write:** Form submission → Zod validation → hook calls Dexie put/add → re-query or optimistic local update → toast confirmation.
3. **Derived values:** Subtotals, taxes, grand totals, and overdue flags are computed inline in hooks or components, never stored.
4. **PDF:** A dedicated `<InvoicePdfDocument />` React component is rendered by `@react-pdf/renderer` on demand — it reads the same invoice data the UI does.

---

## Folder Structure

```
src/
├── app/
│   ├── App.tsx                   # Root component, router setup, providers
│   └── routes.tsx                # Route definitions
│
├── components/
│   ├── ui/                       # Shared primitives (Button, Input, Modal, Badge, Card, Table, etc.)
│   ├── layout/                   # Shell, Sidebar, Header, PageContainer
│   └── common/                   # StatusBadge, CurrencyDisplay, EmptyState, ConfirmDialog
│
├── features/
│   ├── invoices/
│   │   ├── components/           # InvoiceForm, InvoiceLineItems, InvoicePreview, InvoiceListItem
│   │   ├── hooks/                # useInvoices, useInvoiceMutations, useInvoiceNumber
│   │   ├── pages/                # InvoiceListPage, InvoiceCreatePage, InvoiceEditPage, InvoiceViewPage
│   │   ├── pdf/                  # InvoicePdfDocument, InvoicePdfStyles
│   │   └── types.ts
│   │
│   ├── quotes/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── pages/
│   │   ├── pdf/
│   │   └── types.ts
│   │
│   ├── clients/
│   │   ├── components/           # ClientForm, ClientListItem, ClientSelect
│   │   ├── hooks/                # useClients, useClientMutations
│   │   ├── pages/                # ClientListPage, ClientDetailPage
│   │   └── types.ts
│   │
│   ├── items/
│   │   ├── components/           # ItemForm, ItemSelect
│   │   ├── hooks/                # useItems
│   │   └── types.ts
│   │
│   ├── expenses/
│   │   ├── components/           # ExpenseForm, ExpenseListItem, ExpenseSummaryCard
│   │   ├── hooks/                # useExpenses
│   │   ├── pages/                # ExpenseListPage
│   │   └── types.ts
│   │
│   ├── dashboard/
│   │   ├── components/           # OverviewCards, RevenueChart, ExpenseChart, RecentActivity
│   │   └── pages/                # DashboardPage
│   │
│   ├── settings/
│   │   ├── components/           # BusinessProfileForm, DefaultsForm, ThemeToggle
│   │   ├── hooks/                # useSettings
│   │   └── pages/                # SettingsPage
│   │
│   └── backup/
│       ├── hooks/                # useBackupExport, useBackupImport
│       └── pages/                # BackupPage
│
├── db/
│   ├── database.ts               # Dexie database class definition and schema
│   ├── seed.ts                   # Optional demo data seeder
│   └── migrations.ts             # Schema version migrations
│
├── lib/
│   ├── utils.ts                  # formatCurrency, generateId, cn (classname merge), etc.
│   ├── constants.ts              # Currency list, default categories, status enums
│   └── validators.ts             # Zod schemas shared across features
│
├── stores/
│   ├── uiStore.ts                # Sidebar state, active modals, global loading
│   └── settingsStore.ts          # Persisted settings (Zustand persist middleware)
│
├── styles/
│   └── globals.css               # Tailwind directives, print overrides
│
└── main.tsx                      # Entry point
```

---

## Data Models

### Invoice / Quote
```typescript
interface Document {
  id: string;                     // nanoid
  type: 'invoice' | 'quote';
  number: string;                 // e.g., "INV-0042" or "QT-0015"
  status: InvoiceStatus | QuoteStatus;
  clientId: string | null;
  clientSnapshot: ClientSnapshot; // Frozen copy of client info at creation time

  lineItems: LineItem[];

  subtotal: never;                // Derived — not stored
  taxTotal: never;                // Derived — not stored
  discountTotal: never;           // Derived — not stored
  grandTotal: never;              // Derived — not stored

  currency: string;               // ISO 4217 code, e.g., "INR", "USD"
  notes: string;
  terms: string;

  issueDate: string;              // ISO date
  dueDate: string | null;         // ISO date (invoices)
  validUntil: string | null;      // ISO date (quotes)

  createdAt: string;              // ISO timestamp
  updatedAt: string;              // ISO timestamp
}

type InvoiceStatus = 'draft' | 'sent' | 'paid' | 'overdue';
type QuoteStatus = 'draft' | 'sent' | 'accepted' | 'declined';

interface LineItem {
  id: string;
  itemTemplateId: string | null;
  name: string;
  description: string;
  quantity: number;
  unitPrice: number;
  taxPercent: number;
  discountPercent: number;
}

interface ClientSnapshot {
  name: string;
  email: string;
  address: string;
  taxId: string;
}
```

### Client
```typescript
interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  taxId: string;                  // GSTIN or equivalent
  createdAt: string;
  updatedAt: string;
}
```

### Item Template
```typescript
interface ItemTemplate {
  id: string;
  name: string;
  description: string;
  defaultRate: number;
  defaultTaxPercent: number;
  unit: string;                   // "hr", "unit", "project", etc.
}
```

### Expense
```typescript
interface Expense {
  id: string;
  date: string;                   // ISO date
  category: string;
  amount: number;
  currency: string;
  vendor: string;
  notes: string;
  receiptBase64: string | null;   // Optional receipt image
  createdAt: string;
  updatedAt: string;
}
```

### Business Settings
```typescript
interface BusinessProfile {
  companyName: string;
  logoBase64: string | null;
  address: string;
  email: string;
  phone: string;
  taxId: string;
  website: string;
}

interface InvoiceDefaults {
  currency: string;
  defaultTaxPercent: number;
  paymentTermsDays: number;
  defaultNotes: string;
  defaultTerms: string;
  invoicePrefix: string;          // "INV"
  quotePrefix: string;            // "QT"
}
```

---

## State Management Strategy

| What | Where | Why |
|---|---|---|
| Invoices, Quotes, Clients, Items, Expenses | Dexie (IndexedDB) via custom hooks | Persistent, survives refresh, queryable, async. |
| Business Profile & Defaults | Zustand `settingsStore` with `persist` middleware (localStorage) | Small, frequently read, synchronous access needed for PDF rendering. |
| UI State (sidebar open, active modal, toast queue) | Zustand `uiStore` (non-persisted) | Ephemeral, no need to survive refresh. |
| Form State | React Hook Form (local to form component) | Isolated per form, no global leaking. |
| Derived Values (totals, overdue flags) | Computed in hooks/components | Never stored — single source of truth is `lineItems` and dates. |
| Theme (dark/light) | Zustand `settingsStore` persisted + `<html>` class toggle | Tailwind dark mode via `class` strategy. |

---

## Routing & Page Map

```
/                           → Dashboard (OverviewCards, Charts, RecentActivity)
/invoices                   → Invoice List (filterable by status, searchable)
/invoices/new               → Create Invoice
/invoices/:id               → View Invoice (read-only preview with PDF download)
/invoices/:id/edit          → Edit Invoice
/quotes                     → Quote List
/quotes/new                 → Create Quote
/quotes/:id                 → View Quote
/quotes/:id/edit            → Edit Quote
/clients                    → Client List
/clients/:id                → Client Detail (profile + linked documents)
/expenses                   → Expense List (filterable by month, category)
/expenses/new               → Log Expense
/settings                   → Business Profile, Defaults, Theme
/settings/backup            → Export / Import JSON backup
```

### Layout Structure
```
<RootLayout>                      # Sidebar + Header shell
  <Outlet />                      # Page content
</RootLayout>
```

---

## Key UI Screens

### Dashboard
- 4 summary cards: Total Invoiced, Total Paid, Total Outstanding, Total Expenses (current month).
- Revenue bar chart (monthly, last 6 months).
- Expense pie chart (current month by category).
- Recent activity list (last 10 documents created/updated).

### Invoice/Quote Form
- Top section: Client selector (dropdown or modal), document number (auto-generated, editable), issue date, due date.
- Line items table: Each row has name (with item template autocomplete), description, qty, unit price, tax %, discount %. Add/remove/reorder rows.
- Summary panel: Subtotal, total tax, total discount, grand total — all derived live.
- Bottom section: Notes, terms (pre-filled from defaults, editable).
- Actions: Save Draft, Mark as Sent, Download PDF.

### Invoice/Quote View
- Clean, print-style preview matching the PDF output.
- Action bar: Edit, Duplicate, Download PDF, Mark as Paid/Accepted, Delete.
- Status badge and timeline.

### Client Detail
- Client profile card.
- Tabbed list of invoices and quotes linked to this client.

### Expense List
- Filterable by month and category.
- Running total for the filtered view.
- Quick-add form inline or via modal.

---

## PDF Generation Strategy

Using `@react-pdf/renderer` to define a `<InvoicePdfDocument />` component:

```
InvoicePdfDocument
├── Header: Company logo, name, address, contact
├── Client Block: Client name, address, tax ID
├── Meta Row: Invoice #, issue date, due date, status
├── Line Items Table: # | Item | Description | Qty | Rate | Tax | Discount | Amount
├── Summary Block: Subtotal, Tax, Discount, Grand Total
├── Notes Section
└── Terms Section
```

- The component receives the same `Document` data the UI uses.
- Totals are computed by a shared `calculateLineItemTotals()` utility used by both the form and the PDF.
- Triggered on demand via a "Download PDF" button — `pdf(<InvoicePdfDocument />).toBlob()` → download.

---

## Persistence Layer

### Dexie Database Schema
```typescript
class BillBookDB extends Dexie {
  invoices!: Table<Document>;
  clients!: Table<Client>;
  items!: Table<ItemTemplate>;
  expenses!: Table<Expense>;

  constructor() {
    super('BillBookDB');
    this.version(1).stores({
      invoices: 'id, type, status, clientId, number, issueDate, dueDate, updatedAt',
      clients:  'id, name, email',
      items:    'id, name',
      expenses: 'id, date, category, vendor',
    });
  }
}
```

### Backup Format
A single JSON file containing:
```json
{
  "version": 1,
  "exportedAt": "2026-11-26T00:00:00Z",
  "data": {
    "invoices": [],
    "clients": [],
    "items": [],
    "expenses": [],
    "settings": {}
  }
}
```

Import validates the JSON structure with Zod before writing to Dexie, with a confirmation prompt showing record counts.

---

## Build Phases

### Phase 1 — Foundation
- [ ] Vite + React + TypeScript + Tailwind project scaffold.
- [ ] Dexie database setup with schema and seed data.
- [ ] React Router layout with sidebar navigation.
- [ ] Shared UI components (Button, Input, Modal, Badge, Card, Table, EmptyState).
- [ ] Zustand stores (settings, UI).
- [ ] Dark/Light theme toggle.

### Phase 2 — Client & Item Management
- [ ] Client CRUD pages and form (React Hook Form + Zod).
- [ ] Item template CRUD.
- [ ] `ClientSelect` and `ItemSelect` components for use in invoice forms.

### Phase 3 — Invoice & Quote Core
- [ ] Invoice form with dynamic line items (add, remove, reorder).
- [ ] Live-computed subtotal, tax, discount, and grand total.
- [ ] Auto-generated invoice numbers with configurable prefix.
- [ ] Invoice list page with status filters and search.
- [ ] Invoice view page (read-only preview).
- [ ] Status transitions (Draft → Sent → Paid).
- [ ] Duplicate and delete actions.
- [ ] Quote pages (reuse invoice components, different status workflow).
- [ ] Convert Quote → Invoice action.

### Phase 4 — PDF Export
- [ ] `@react-pdf/renderer` setup.
- [ ] `InvoicePdfDocument` component matching the view layout.
- [ ] Shared `calculateTotals` utility used by form, view, and PDF.
- [ ] "Download PDF" button on view page.

### Phase 5 — Expenses & Dashboard
- [ ] Expense form and list page.
- [ ] Expense filters (month, category).
- [ ] Dashboard page with summary cards.
- [ ] Revenue chart (Recharts bar chart).
- [ ] Expense breakdown chart (Recharts pie chart).
- [ ] Recent activity feed.

### Phase 6 — Settings & Backup
- [ ] Business profile form (with logo upload as base64).
- [ ] Invoice defaults form.
- [ ] JSON full-backup export.
- [ ] JSON import with Zod validation and confirmation.
- [ ] CSV export for invoice and expense lists.

### Phase 7 — Polish
- [ ] Responsive layout for tablet and mobile.
- [ ] Keyboard shortcuts (Ctrl+N for new invoice, Ctrl+S for save, etc.).
- [ ] Empty states and onboarding hints for first-time users.
- [ ] Accessibility audit (focus management, ARIA labels, color contrast).
- [ ] Performance check (React DevTools Profiler, bundle size review).
