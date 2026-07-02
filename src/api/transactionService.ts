import transactionsData from '../data/transactions.json';
import type { Transaction } from '../types/transaction';

export async function fetchTransactions(): Promise<Transaction[]> {
  try {
    const response = await fetch('/api/transactions');
    if (!response.ok) {
      throw new Error(`Failed to load transactions (${response.status})`);
    }

    return (await response.json()) as Transaction[];
  } catch {
    return transactionsData as Transaction[];
  }
}
