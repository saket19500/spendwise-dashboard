import { formatCurrency } from '@/utils/formatCurrency';

export function StatCard({ label, amount }: { label: string; amount: number }) {
  return (
    <div className="flex-1 rounded-2xl bg-white border border-[#e8e7e3] p-3">
      <div className="text-[11px] text-[#888780]">{label}</div>
      <div className="mt-1 text-sm font-medium tracking-tight text-[#2c2c2a]">
        {formatCurrency(amount)}
      </div>
    </div>
  );
}
