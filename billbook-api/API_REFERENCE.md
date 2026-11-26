# BillBook API Reference

Base URL (local dev): `http://localhost:8000/api`

All JSON payloads use `camelCase` keys matching the TypeScript interfaces in `billbook-ui`. Validation requests also accept `snake_case` equivalents.

---

## Response Envelope

- Single resource: `{ "data": { ... } }` (mutations also include `"message"`)
- Collection: `{ "data": [ ... ], "meta": { ... } }` (when `page` or `perPage` query params are sent, standard Laravel `links` & `meta` pagination metadata is included)
- Validation error (`422`): `{ "message": "...", "errors": { "field": ["..."] } }`

---

## Health & Metadata

### `GET /api/health`
Returns API and MySQL database connectivity status.

### `GET /api/meta`
Returns constants needed by dropdowns & badges (`currencies`, `expenseCategories`, `invoiceStatuses`, `quoteStatuses`).

---

## Dashboard

### `GET /api/dashboard`
Query params:
- `month` (optional `YYYY-MM`, defaults to current month)
- `months` (optional integer `1..24`, defaults to `6` for revenue chart)

Response `data`:
- `currency`: default currency code (`"INR"`)
- `month`: target `YYYY-MM`
- `overview`: `{ totalInvoiced, totalPaid, totalOutstanding, totalExpenses, allTimeExpenses, draftTotal }`
- `currentMonth`: `{ month, totalInvoiced, totalPaid, totalOutstanding, totalExpenses }`
- `counts`: `{ invoices: { all, draft, sent, paid, overdue }, quotes: { all, draft, sent, accepted, declined }, clients, items }`
- `monthlyRevenue`: `[{ month: "Nov", monthKey: "2026-11", label: "Nov 2026", revenue: 85000, count: 1 }]`
- `expensesByCategory`: `[{ name: "Travel", value: 12000, count: 2 }]`
- `recentActivity`: last 10 updated invoices/quotes with `{ id, type, number, clientId, clientName, issueDate, dueDate, validUntil, status, currency, grandTotal, updatedAt }`

---

## Clients

### `GET /api/clients`
Query params: `search`, `sort` (`name` | `createdAt`), `dir` (`asc` | `desc`), `page`, `perPage`.
Each client includes `totalInvoiced`, `totalPaid`, `totalOutstanding`, `lastInvoiceDate`, `initials`, `invoicesCount`, `quotesCount`.

### `POST /api/clients`
Body: `{ name, email?, phone?, address?, taxId? }`

### `GET /api/clients/{client}`
Returns client details plus embedded `invoices` and `quotes` arrays (with `lineItems` and computed totals).

### `PUT|PATCH /api/clients/{client}`
Body: partial or full `{ name, email, phone, address, taxId }`.

### `DELETE /api/clients/{client}`
Deletes client. Linked documents retain their `clientSnapshot` with `clientId` set to `null`.

---

## Item Templates

### `GET /api/items`
Query params: `search`, `page`, `perPage`.

### `POST /api/items`
Body: `{ name, description?, defaultRate, defaultTaxPercent?, unit? }`

### `GET /api/items/{item}`
### `PUT|PATCH /api/items/{item}`
### `DELETE /api/items/{item}`

---

## Invoices

Note: Invoices with `status = "sent"` and `dueDate < today` automatically report `status: "overdue"` and `isOverdue: true` (while preserving `rawStatus: "sent"`). Status counts and `?status=overdue` filtering follow this rule automatically.

### `GET /api/invoices`
Query params:
- `status`: `all` | `draft` | `sent` | `paid` | `overdue`
- `search`: matches invoice number, notes, or client details
- `clientId`: filter by client ID
- `from`, `to`: filter `issueDate` range (`YYYY-MM-DD`)
- `sort`: `issueDate` | `dueDate` | `number` | `updatedAt` | `createdAt`
- `dir`: `asc` | `desc`
- `page`, `perPage`

Includes `meta.counts`: `{ all, draft, sent, paid, overdue }`.

### `GET /api/invoices/next-number`
Returns `{ data: { number: "INV-0043" } }` using configured `invoicePrefix`.

### `GET /api/invoices/export/csv`
Downloads CSV stream (`status` and `search` query params supported).

### `POST /api/invoices`
Body:
```json
{
  "clientId": "client-aarav-sharma",
  "number": "INV-0043",
  "status": "draft",
  "currency": "INR",
  "issueDate": "2026-11-26",
  "dueDate": "2026-12-26",
  "notes": "Thank you for your business!",
  "terms": "Payment due within 30 days.",
  "lineItems": [
    {
      "itemTemplateId": "item-web-dev",
      "name": "Web Development",
      "description": "React frontend & API",
      "quantity": 1,
      "unitPrice": 45000,
      "taxPercent": 18,
      "discountPercent": 0
    }
  ]
}
```
`number`, `issueDate`, `dueDate`, `currency`, `notes`, `terms`, and `clientSnapshot` are optional and auto-populated from settings/client when omitted.

### `GET /api/invoices/{invoice}`
Lookup accepts either `id` or `number` (e.g. `inv-0042` or `INV-0042`).

### `PUT|PATCH /api/invoices/{invoice}`
### `PATCH /api/invoices/{invoice}/status`
Body: `{ "status": "draft" | "sent" | "paid" | "overdue" }`

### `POST /api/invoices/{invoice}/duplicate`
Clones invoice & line items into a new `draft` invoice with the next sequential number and today's dates.

### `DELETE /api/invoices/{invoice}`

---

## Quotes

### `GET /api/quotes`
Same query params as `/api/invoices`, with `status`: `all` | `draft` | `sent` | `accepted` | `declined`.

### `GET /api/quotes/next-number`
Returns `{ data: { number: "QT-0016" } }`.

### `POST /api/quotes`
Same payload as invoices, using `validUntil` instead of `dueDate`.

### `GET /api/quotes/{quote}`
### `PUT|PATCH /api/quotes/{quote}`
### `PATCH /api/quotes/{quote}/status`
Body: `{ "status": "draft" | "sent" | "accepted" | "declined" }`

### `POST /api/quotes/{quote}/duplicate`
### `POST /api/quotes/{quote}/convert`
Converts the quote to a new `draft` invoice in a database transaction, preserves all line items and client info, links `convertedInvoiceId` / `sourceQuoteId`, and marks `draft`/`sent` quotes as `accepted`.

### `DELETE /api/quotes/{quote}`

---

## Expenses

### `GET /api/expenses`
Query params: `month` (`YYYY-MM` or `all`), `category` (or `all`), `search`, `from`, `to`, `page`, `perPage`.
Includes `meta.summary`: `{ total, count, byCategory: [{ category, total, count }] }`, `meta.availableMonths`, and `meta.categories`.

### `GET /api/expenses/export/csv`
Downloads CSV stream (`month`, `category`, `search` query params supported).

### `POST /api/expenses`
Supports JSON (`receiptBase64`) or `multipart/form-data` (`receipt` file upload up to 5MB).

### `GET /api/expenses/{expense}`
### `PUT|PATCH|POST /api/expenses/{expense}`
Supports `removeReceipt: true` to clear existing receipt.

### `DELETE /api/expenses/{expense}`

---

## Settings

### `GET /api/settings`
Returns `{ data: { theme, businessProfile, invoiceDefaults, updatedAt } }`.

### `PUT|PATCH /api/settings`
Updates any combination of `theme`, `businessProfile`, and `invoiceDefaults`.

### `PUT|PATCH|POST /api/settings/business-profile`
Updates company details. Supports JSON (`logoBase64`), `multipart/form-data` (`logo` image), or `removeLogo: true`.

### `PUT|PATCH /api/settings/invoice-defaults`
Updates `{ currency, defaultTaxPercent, paymentTermsDays, defaultNotes, defaultTerms, invoicePrefix, quotePrefix }`.

### `PATCH /api/settings/theme`
Body: `{ "theme": "light" | "dark" }`.

---

## Backup & Restore

### `GET /api/backup/export`
Returns `{ version: 1, exportedAt, data: { invoices, quotes, clients, items, expenses, settings } }`. Pass `?download=1` for `Content-Disposition: attachment`.

### `POST /api/backup/import`
Restores backup from either JSON request body (`{ mode: "replace" | "merge", data: { ... } }`) or `multipart/form-data` (`file` JSON upload + optional `mode`).
