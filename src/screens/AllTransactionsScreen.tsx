import { useMemo } from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from '@tanstack/react-router';
import { useStore } from '@/store/useStore';
import { TransactionRow } from '@/components/TransactionRow';
import { formatDateLabel } from '@/utils/dateHelpers';

export function AllTransactionsScreen() {
  const navigate = useNavigate();
  const transactions = useStore((s) => s.transactions);

  const grouped = useMemo(() => {
    const sorted = [...transactions].sort((a, b) => (a.date < b.date ? 1 : -1));
    const map = new Map<string, typeof sorted>();
    sorted.forEach((t) => {
      if (!map.has(t.date)) map.set(t.date, []);
      map.get(t.date)!.push(t);
    });
    return [...map.entries()];
  }, [transactions]);

  return (
    <div className="px-4 pt-6 pb-28">
      <header className="flex items-center gap-3">
        <button onClick={() => navigate({ to: '/' })} className="p-1 -ml-1">
          <ArrowLeft size={22} className="text-[#2c2c2a]" />
        </button>
        <h1 className="text-lg font-medium tracking-tight text-[#2c2c2a]">All transactions</h1>
      </header>

      <div className="mt-5 space-y-5">
        {grouped.map(([date, txns]) => (
          <div key={date}>
            <div className="mb-1 text-xs font-medium text-[#888780]">{formatDateLabel(date)}</div>
            <div className="rounded-2xl bg-white border border-[#e8e7e3] px-3 py-1 divide-y divide-[#f0efeb]">
              {txns.map((t) => <TransactionRow key={t.id} txn={t} />)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
