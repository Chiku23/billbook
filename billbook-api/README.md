# BillBook API

Laravel 12 REST API backend for **BillBook** (`billbook-ui`), backed by MySQL.

## Requirements

- PHP 8.2+
- Composer
- MySQL / MariaDB (`billbook` database configured in `.env`)

## Setup

1. Install dependencies & configure `.env`:
   ```bash
   composer install
   cp .env.example .env
   php artisan key:generate
   ```
2. Run database migrations and demo seeder (prefills clients, item templates, invoices, quotes, expenses, and studio settings):
   ```bash
   php artisan migrate --seed
   php artisan storage:link
   ```
3. Start the API server:
   ```bash
   php artisan serve
   ```
   The API runs at `http://127.0.0.1:8000/api` with CORS configured for `http://localhost:5173`, `http://127.0.0.1:5173`, `http://localhost:3000`, and `http://127.0.0.1:3000`.

## API Modules

- **Health & Meta**: `GET /api/health`, `GET /api/meta`
- **Dashboard**: `GET /api/dashboard`
- **Clients**: `GET|POST /api/clients`, `GET|PUT|PATCH|DELETE /api/clients/{client}`
- **Items**: `GET|POST /api/items`, `GET|PUT|PATCH|DELETE /api/items/{item}`
- **Invoices**: `GET|POST /api/invoices`, `GET|PUT|PATCH|DELETE /api/invoices/{invoice}`, `GET /api/invoices/next-number`, `GET /api/invoices/export/csv`, `PATCH /api/invoices/{invoice}/status`, `POST /api/invoices/{invoice}/duplicate`
- **Quotes**: `GET|POST /api/quotes`, `GET|PUT|PATCH|DELETE /api/quotes/{quote}`, `GET /api/quotes/next-number`, `PATCH /api/quotes/{quote}/status`, `POST /api/quotes/{quote}/duplicate`, `POST /api/quotes/{quote}/convert`
- **Expenses**: `GET|POST /api/expenses`, `GET|PUT|PATCH|POST|DELETE /api/expenses/{expense}`, `GET /api/expenses/export/csv`
- **Settings**: `GET|PUT|PATCH /api/settings`, `PUT|PATCH|POST /api/settings/business-profile`, `PUT|PATCH /api/settings/invoice-defaults`, `PATCH /api/settings/theme`
- **Backup**: `GET /api/backup/export`, `POST /api/backup/import`

See [API_REFERENCE.md](./API_REFERENCE.md) for request/response payloads and query parameters.
