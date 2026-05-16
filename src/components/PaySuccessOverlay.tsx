import { Check } from 'lucide-react';
import { formatCurrency } from '@/utils/formatCurrency';

interface Props {
  open: boolean;
  merchant: string;
  amount: number;
  categoryName: string;
  upiRef: string;
  onDone: () => void;
}

export function PaySuccessOverlay({ open, merchant, amount, categoryName, upiRef, onDone }: Props) {
  return (
    <div
      className={`fixed inset-0 z-50 bg-white transition-all duration-300 ${open ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0 pointer-events-none'}`}
    >
      <div className="flex h-full flex-col items-center justify-between px-6 py-10">
        <div className="flex flex-1 flex-col items-center justify-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#E1F5EE]">
            <Check size={42} className="text-[#1D9E75]" strokeWidth={2.5} />
          </div>
          <div className="mt-5 text-sm text-[#888780]">Paid successfully</div>
          <div className="mt-2 text-3xl font-medium tracking-tight text-[#2c2c2a]">
            {formatCurrency(amount)}
          </div>
          <div className="mt-1 text-sm text-[#2c2c2a]">to {merchant}</div>
          <div className="mt-4 rounded-xl bg-[#f5f4f1] px-4 py-2 text-xs text-[#888780]">
            {categoryName} · {upiRef}
          </div>
        </div>
        <button
          onClick={onDone}
          className="w-full rounded-xl bg-[#2c2c2a] py-3 text-sm font-medium text-white"
        >
          Done
        </button>
      </div>
    </div>
  );
}
