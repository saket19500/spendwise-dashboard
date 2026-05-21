import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { CATEGORIES, TRANSACTIONS, type Category, type Transaction } from '@/data/mockData';
import { getThisWeekDates, getThisMonthDates } from '@/utils/dateHelpers';

interface StoreState {
  categories: Category[];
  transactions: Transaction[];
  addCategory: (cat: Category) => void;
  addTransaction: (txn: Transaction) => void;
  getMonthlyTotal: () => number;
  getWeeklyTotalByCategory: (categoryId: string) => number;
  getMonthlyTotalByCategory: (categoryId: string) => number;
  getAllTimeByCategory: (categoryId: string) => number;
}

export const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
      categories: CATEGORIES,
      transactions: TRANSACTIONS,
      addCategory: (cat) => set((s) => ({ categories: [...s.categories, cat] })),
      addTransaction: (txn) => set((s) => ({ transactions: [txn, ...s.transactions] })),
      getMonthlyTotal: () => {
        const { start, end } = getThisMonthDates();
        return get()
          .transactions.filter((t) => t.date >= start && t.date <= end)
          .reduce((sum, t) => sum + t.amount, 0);
      },
      getWeeklyTotalByCategory: (categoryId) => {
        const { start, end } = getThisWeekDates();
        return get()
          .transactions.filter((t) => t.categoryId === categoryId && t.date >= start && t.date <= end)
          .reduce((sum, t) => sum + t.amount, 0);
      },
      getMonthlyTotalByCategory: (categoryId) => {
        const { start, end } = getThisMonthDates();
        return get()
          .transactions.filter((t) => t.categoryId === categoryId && t.date >= start && t.date <= end)
          .reduce((sum, t) => sum + t.amount, 0);
      },
      getAllTimeByCategory: (categoryId) => {
        return get()
          .transactions.filter((t) => t.categoryId === categoryId)
          .reduce((sum, t) => sum + t.amount, 0);
      },
    }),
    {
      name: 'spendwise-store',
      storage: createJSONStorage(() =>
        typeof window !== 'undefined'
          ? window.localStorage
          : { getItem: () => null, setItem: () => {}, removeItem: () => {} }
      ),
      partialize: (s) => ({ categories: s.categories, transactions: s.transactions }) as never,
    }
  )
);

