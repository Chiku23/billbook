# BillBook API

Laravel 12 REST API backend for **BillBook** (`billbook-ui`).

## Setup

1. Ensure MySQL is running (`DB_DATABASE=billbook` in `.env`).
2. Install dependencies & configure environment (already done in this workspace):
   ```bash
   composer install
   php artisan migrate --seed
   php artisan storage:link
   ```
3. Start the API server:
   ```bash
   php artisan serve
   ```
   The API will be available at `http://localhost:8000/api` (CORS is pre-configured for `http://localhost:5173` and `http://127.0.0.1:5173`).

## Documentation

See [API_REFERENCE.md](./API_REFERENCE.md) for all endpoints, query parameters, and payload schemas matching `billbook-ui`.
