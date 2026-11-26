# BillBook UI

Static React + TypeScript + Tailwind CSS frontend for **BillBook**, structured to learn React progressively alongside the Laravel backend (`billbook-api`).

## Learning Roadmap

1. **Stage 1 — Static UI (Current)**: React components, props, TypeScript types, Tailwind CSS styling, and `react-router-dom` navigation with no advanced libraries.
2. **Stage 2 — Beginner React Logic**: Add `useState` for controlled forms, filters, tabs, modals, and `useEffect` + `fetch` to connect screens to `http://localhost:8000/api`.
3. **Stage 3 — Medium React**: Extract reusable custom hooks (`useInvoices`, `useClients`, `useExpenses`), shared `useContext` for theme/settings, and reusable API client helpers.
4. **Stage 4 — Advanced React**: Introduce TanStack Query caching, schema validation, dedicated PDF generation, or charting libraries if needed.

## Running Locally

```bash
npm install
npm run dev
```

## Scripts

- `npm run dev` — Start Vite development server (`http://localhost:5173`)
- `npm run build` — Type-check and build production bundle
- `npm run lint` — Run Oxlint checks
