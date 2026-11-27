# BillBook UI

Beginner-friendly React + TypeScript + Tailwind CSS frontend for **BillBook**, wired to the Laravel API (`billbook-api`) using plain function components, React hooks (`useState`, `useEffect`), prop drilling, and **Axios**.

## Stack

- **React 19** + **Vite** + **TypeScript**
- **React Router (`react-router-dom`)** for multi-page navigation
- **Axios** (`src/lib/api.ts` + `src/api/*.ts`) for all HTTP requests and CSV/JSON file transfers
- **Tailwind CSS v4** & **Lucide React** icons

## Folder Structure

```text
src/
├── App.tsx                 # Top-level theme/settings state and route definitions
├── main.tsx                # Entry point
├── api/                    # Axios endpoint functions (backup, clients, dashboard, expenses, invoices, items, quotes, settings, system)
├── components/
│   ├── ui/                 # Reusable UI primitives (Button, Card, Input, Select, Textarea, Table, Tabs, Modal, Badge)
│   ├── common/             # StatusBadge, CurrencyDisplay, EmptyState, ConfirmDialog, DocumentPreview
│   ├── layout/             # RootLayout, Sidebar, Header, PageContainer
│   └── ...                 # Domain components (dashboard, invoices, quotes, clients, items, expenses, settings)
├── pages/                  # Route pages connected to the API
├── types/                  # TypeScript interfaces matching billbook-api responses
└── lib/                    # Axios instance, error helpers, currency/date formatting, invoice math
```

## Wired Features

- **Dashboard**: Overview totals, monthly paid revenue chart, category expense donut chart, and recent documents.
- **Invoices**: List with live status tabs (`all`, `draft`, `sent`, `paid`, `overdue`), search, CSV export, create/edit with dynamic line items & saved item insertion, live total calculation, duplicate, status transitions (`draft` → `sent` → `paid`), print/PDF view, and delete.
- **Quotes**: List with live status tabs (`all`, `draft`, `sent`, `accepted`, `declined`), create/edit, duplicate, status updates, one-click convert to invoice, print/PDF view, and delete.
- **Clients**: Directory with search, create/edit/delete, and detail view with linked invoices & quotes.
- **Items**: Reusable line-item templates CRUD and quick-insert selector inside invoice/quote forms.
- **Expenses**: Month/category/search filters, live summary bar, receipt file upload & preview, CSV export, create/edit/delete.
- **Settings & Backup**: Live API/DB health badge, business profile with logo upload, invoice/quote defaults, light/dark theme persistence, JSON backup export/restore (`replace` or `merge`), and CSV exports.

## Running Locally

1. Ensure `billbook-api` is running on `http://127.0.0.1:8000` (or set `VITE_API_URL` in `.env.local`).
2. Install dependencies and start Vite:
   ```bash
   npm install
   npm run dev
   ```

## Scripts

- `npm run dev` — Start Vite development server (`http://localhost:5173`)
- `npm run build` — Type-check and build production bundle
- `npm run lint` — Run Oxlint checks
