import type { Transaction } from '@/data/mockData';
import { useStore } from '@/store/useStore';
import { formatCurrency } from '@/utils/formatCurrency';
import { formatDateLabel } from '@/utils/dateHelpers';
import { toast } from 'sonner';

export function TransactionRow({ txn }: { txn: Transaction }) {
  const category = useStore((s) => s.categories.find((c) => c.id === txn.categoryId));
  if (!category) return null;

  return (
    <button
      onClick={() => toast('Transaction detail coming soon')}
      className="flex w-full items-center gap-3 py-3 text-left active:bg-[#f5f4f1] transition-colors rounded-xl px-2 -mx-2"
    >
      <div
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-lg"
        style={{ backgroundColor: category.bgColor }}
      >
        {category.emoji}
      </div>
      <div className="min-w-0 flex-1">
        <div className="truncate text-[13px] font-medium text-[#2c2c2a]">{txn.merchant}</div>
        <div className="text-[11px] text-[#888780]">
          {category.name} · {formatDateLabel(txn.date)}
        </div>
      </div>
      <div className="text-[13px] font-medium tracking-tight text-[#E24B4A]">
        −{formatCurrency(txn.amount)}
      </div>
    </button>
  );
}
