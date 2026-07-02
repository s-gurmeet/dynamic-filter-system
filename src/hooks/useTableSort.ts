import { useMemo, useState, type ReactNode } from 'react';
import type { Employee } from '../types/employee';
import type { Transaction } from '../types/transaction';
import { getNestedValue } from '../utils/getNestedValue';

export type SortDirection = 'asc' | 'desc';

export interface TableColumn<T> {
  key: string;
  label: string;
  sortable?: boolean;
  align?: 'left' | 'right' | 'center';
  render?: (row: T) => ReactNode;
}

export function useSortedData<T extends object>(
  data: T[],
  defaultSortKey: string,
) {
  const [sortKey, setSortKey] = useState(defaultSortKey);
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');

  const sortedData = useMemo(() => {
    const copy = [...data];

    copy.sort((left, right) => {
      const leftValue = getNestedValue(left, sortKey);
      const rightValue = getNestedValue(right, sortKey);

      if (leftValue === rightValue) return 0;
      if (leftValue === null || leftValue === undefined) return 1;
      if (rightValue === null || rightValue === undefined) return -1;

      let comparison = 0;
      if (typeof leftValue === 'number' && typeof rightValue === 'number') {
        comparison = leftValue - rightValue;
      } else if (typeof leftValue === 'boolean' && typeof rightValue === 'boolean') {
        comparison = Number(leftValue) - Number(rightValue);
      } else {
        comparison = String(leftValue).localeCompare(String(rightValue));
      }

      return sortDirection === 'asc' ? comparison : -comparison;
    });

    return copy;
  }, [data, sortDirection, sortKey]);

  const toggleSort = (key: string) => {
    if (key === sortKey) {
      setSortDirection((current) => (current === 'asc' ? 'desc' : 'asc'));
      return;
    }

    setSortKey(key);
    setSortDirection('asc');
  };

  return {
    sortedData,
    sortKey,
    sortDirection,
    toggleSort,
  };
}

export function formatCellValue(value: unknown): string {
  if (value === null || value === undefined) return '—';
  if (Array.isArray(value)) return value.join(', ');
  if (typeof value === 'boolean') return value ? 'Yes' : 'No';
  if (typeof value === 'object') return JSON.stringify(value);
  return String(value);
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(value);
}

export const employeeColumns: TableColumn<Employee>[] = [
  { key: 'name', label: 'Name', sortable: true },
  { key: 'email', label: 'Email', sortable: true },
  { key: 'department', label: 'Department', sortable: true },
  { key: 'role', label: 'Role', sortable: true },
  {
    key: 'salary',
    label: 'Salary',
    sortable: true,
    align: 'right',
    render: (row) => formatCurrency(row.salary),
  },
  { key: 'joinDate', label: 'Join Date', sortable: true },
  {
    key: 'isActive',
    label: 'Active',
    sortable: true,
    render: (row) => (row.isActive ? 'Yes' : 'No'),
  },
  {
    key: 'skills',
    label: 'Skills',
    render: (row) => row.skills.join(', '),
  },
  {
    key: 'address.city',
    label: 'City',
    sortable: true,
    render: (row) => row.address.city,
  },
  {
    key: 'projects',
    label: 'Projects',
    sortable: true,
    align: 'right',
  },
  {
    key: 'performanceRating',
    label: 'Rating',
    sortable: true,
    align: 'right',
  },
];

export const transactionColumns: TableColumn<Transaction>[] = [
  { key: 'reference', label: 'Reference', sortable: true },
  {
    key: 'amount',
    label: 'Amount',
    sortable: true,
    align: 'right',
    render: (row) => formatCurrency(row.amount),
  },
  { key: 'paymentMethod', label: 'Payment Method', sortable: true },
  {
    key: 'isRefunded',
    label: 'Refunded',
    sortable: true,
    render: (row) => (row.isRefunded ? 'Yes' : 'No'),
  },
  { key: 'status', label: 'Status', sortable: true },
  { key: 'createdAt', label: 'Created', sortable: true },
  { key: 'customer', label: 'Customer', sortable: true },
];
