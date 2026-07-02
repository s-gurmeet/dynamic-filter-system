import type { FilterFieldDefinition } from '../types/filter';

export const transactionFilterConfig: FilterFieldDefinition[] = [
  { key: 'reference', label: 'Reference', type: 'text' },
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
  {
    key: 'status',
    label: 'Status',
    type: 'select',
    options: [
      { label: 'Completed', value: 'completed' },
      { label: 'Pending', value: 'pending' },
      { label: 'Failed', value: 'failed' },
    ],
  },
  { key: 'createdAt', label: 'Created Date', type: 'date' },
  { key: 'customer', label: 'Customer', type: 'text' },
];
