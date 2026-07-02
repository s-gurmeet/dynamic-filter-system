export interface Transaction {
  id: number;
  reference: string;
  amount: number;
  paymentMethod: 'card' | 'bank' | 'upi';
  isRefunded: boolean;
  status: 'completed' | 'pending' | 'failed';
  createdAt: string;
  customer: string;
}
