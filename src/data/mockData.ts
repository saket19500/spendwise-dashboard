export interface Category {
  id: string;
  name: string;
  emoji: string;
  color: string;
  bgColor: string;
  budget: number;
}

export type PaymentMethod =
  | 'UPI'
  | 'QR Scan'
  | 'Credit Card'
  | 'Debit Card'
  | 'Net Banking'
  | 'Wallet'
  | 'Cash'
  | 'NEFT/IMPS';

export const PAYMENT_METHODS: PaymentMethod[] = [
  'UPI',
  'QR Scan',
  'Credit Card',
  'Debit Card',
  'Net Banking',
  'Wallet',
  'Cash',
  'NEFT/IMPS',
];

export interface Transaction {
  id: string;
  categoryId: string;
  merchant: string;
  amount: number;
  date: string;
  time: string;
  upiRef: string;
  paymentMethod?: PaymentMethod;
  remarks?: string;
  external?: boolean;
}

export const CATEGORIES: Category[] = [
  { id: 'food', name: 'Food', emoji: '🍔', color: '#1D9E75', bgColor: '#E1F5EE', budget: 6000 },
  { id: 'shopping', name: 'Shopping', emoji: '🛍', color: '#7F77DD', bgColor: '#EEEDFE', budget: 8000 },
  { id: 'travel', name: 'Travel', emoji: '✈', color: '#378ADD', bgColor: '#E6F1FB', budget: 5000 },
  { id: 'sutta', name: 'Sutta', emoji: '🚬', color: '#EF9F27', bgColor: '#FAEEDA', budget: 1500 },
];

export const TRANSACTIONS: Transaction[] = [
  { id: 't1', categoryId: 'food', merchant: "Domino's Pizza", amount: 649, date: '2026-05-16', time: '8:42 PM', upiRef: 'UPI2400516001' },
  { id: 't2', categoryId: 'shopping', merchant: 'Myntra', amount: 2000, date: '2026-05-16', time: '3:10 PM', upiRef: 'UPI2400516002' },
  { id: 't3', categoryId: 'food', merchant: 'Swiggy', amount: 340, date: '2026-05-15', time: '9:15 PM', upiRef: 'UPI2400515003' },
  { id: 't4', categoryId: 'sutta', merchant: 'Pan shop Koramangala', amount: 220, date: '2026-05-15', time: '6:00 PM', upiRef: 'UPI2400515004' },
  { id: 't5', categoryId: 'travel', merchant: 'Ola Cabs', amount: 480, date: '2026-05-14', time: '10:30 AM', upiRef: 'UPI2400514005' },
  { id: 't6', categoryId: 'food', merchant: 'Zomato', amount: 520, date: '2026-05-14', time: '1:20 PM', upiRef: 'UPI2400514006' },
  { id: 't7', categoryId: 'shopping', merchant: 'Amazon India', amount: 1299, date: '2026-05-13', time: '11:00 AM', upiRef: 'UPI2400513007' },
  { id: 't8', categoryId: 'food', merchant: 'Chai Point', amount: 110, date: '2026-05-13', time: '8:00 AM', upiRef: 'UPI2400513008' },
  { id: 't9', categoryId: 'travel', merchant: 'IndiGo Airlines', amount: 3200, date: '2026-05-10', time: '7:00 AM', upiRef: 'UPI2400510009' },
  { id: 't10', categoryId: 'shopping', merchant: 'Nykaa', amount: 860, date: '2026-05-09', time: '5:30 PM', upiRef: 'UPI2400509010' },
  { id: 't11', categoryId: 'sutta', merchant: 'General Store', amount: 180, date: '2026-05-08', time: '7:00 PM', upiRef: 'UPI2400508011' },
  { id: 't12', categoryId: 'food', merchant: "McDonald's", amount: 399, date: '2026-05-07', time: '2:00 PM', upiRef: 'UPI2400507012' },
];
