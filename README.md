# Dynamic Filter System

A reusable filter component for data tables. Pass a field configuration and the same UI handles text, number, date, amount, select, multi-select, and boolean filters without any internal changes.

**Author:** Gurmeet Singh Nandrajog

## Overview

I built this to solve a common frontend problem: every table ends up with its own hardcoded filter logic. Here, filter behavior is driven entirely by `FilterFieldDefinition[]` — switch datasets by swapping the config, not the components.

The demo includes two tables (Employees and Transactions) to show that the filter system works across different schemas.

## Features

- Add, remove, and clear filter conditions
- Operators change automatically based on field type
- Client-side filtering with AND across fields, OR within the same field
- Nested field support (`address.city`)
- Sortable table with total and filtered record counts
- Filter state persisted in `localStorage`
- CSV export for filtered results

## Tech Stack

React, TypeScript, Vite, Material UI, MUI Date Pickers, Lucide React, mock-json-api, dayjs

## Getting Started

```bash
npm install
npm run dev
```

- App: `http://localhost:5173`
- Mock API: `http://localhost:3001`

```bash
npm run build    # production build
npm run preview  # preview production build
```

## Project Structure

```
src/
  components/   # Filter UI, table, dataset panel
  config/       # Field definitions per dataset
  hooks/        # Data fetching, filter state, sorting
  types/        # Shared interfaces
  utils/        # Filter engine and helpers
  data/         # Seed JSON (employees, transactions)
server/         # mock-json-api dev server
```

## How It Works

Each dataset defines its own filter config:

```ts
export const transactionFilterConfig: FilterFieldDefinition[] = [
  { key: 'amount', label: 'Amount', type: 'amount' },
  {
    key: 'paymentMethod',
    label: 'Payment Method',
    type: 'select',
    options: [
      { label: 'Card', value: 'card' },
      { label: 'Bank', value: 'bank' },
      { label: 'UPI', value: 'upi' },
    ],
  },
  { key: 'isRefunded', label: 'Refunded', type: 'boolean' },
];
```

`FilterBuilder` renders the UI from this config. `applyFilters()` in `utils/filterEngine.ts` handles the actual filtering logic.

## Design Notes

I kept filter rendering, state management, and filtering logic in separate layers so each can evolve independently. Field types map to operators in `config/operators.ts`, which keeps the input components simple — they just read the field type and render the right control.

Validation runs at the row level (e.g. min > max on amount ranges) so bad input is caught before it affects results. Filtered data is memoized in `DatasetPanel` to avoid unnecessary re-renders on unrelated state changes.

For deployment, the app falls back to bundled JSON when the mock API isn't available, so the static build works on Vercel without a separate backend.

## API (Development)

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/employees` | GET | Employee records |
| `/api/employees/:id` | GET | Single employee |
| `/api/transactions` | GET | Transaction records |

## Author

Gurmeet Singh Nandrajog
