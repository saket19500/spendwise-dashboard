import { useState } from 'react';
import { useNavigate, useSearch } from '@tanstack/react-router';
import { X } from 'lucide-react';
import { useStore } from '@/store/useStore';
import { PaySuccessOverlay } from '@/components/PaySuccessOverlay';

export function PayScreen() {
  const navigate = useNavigate();
  const search = useSearch({ from: '/pay' }) as { category?: string };
  const categories = useStore((s) => s.categories);
  const addTransaction = useStore((s) => s.addTransaction);

  const [selectedCat, setSelectedCat] = useState<string | undefined>(search.category);
  const [upi, setUpi] = useState('');
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  const [success, setSuccess] = useState<null | { merchant: string; amount: number; categoryName: string; upiRef: string }>(null);

  const handlePay = () => {
    const amt = Number(amount);
    if (!upi.trim() || !amt || amt <= 0) return;
    const catId = selectedCat ?? categories[0]?.id;
    const cat = categories.find((c) => c.id === catId);
    if (!cat) return;
    const today = new Date();
    const ymd = `${today.getFullYear()}${String(today.getMonth() + 1).padStart(2, '0')}${String(today.getDate()).padStart(2, '0')}`;
    const ref = `UPI${ymd}${Math.floor(1000 + Math.random() * 9000)}`;
    addTransaction({
      id: `t-${Date.now()}`,
      categoryId: cat.id,
      merchant: upi,
      amount: amt,
      date: today.toISOString().slice(0, 10),
      time: today.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }),
      upiRef: ref,
    });
    setSuccess({ merchant: upi, amount: amt, categoryName: cat.name, upiRef: ref });
  };

  const activeCat = categories.find((c) => c.id === selectedCat);
  const valid = upi.trim() && Number(amount) > 0;

  return (
    <div className="px-4 pt-6 pb-28">
      <h1 className="text-xl font-medium tracking-tight text-[#2c2c2a]">Pay</h1>

      {activeCat && (
        <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-[#EEEDFE] px-3 py-1.5 text-xs text-[#534AB7]">
          Paying in: {activeCat.name} {activeCat.emoji}
          <button onClick={() => setSelectedCat(undefined)}>
            <X size={14} />
          </button>
        </div>
      )}

      <div className="mt-5">
        <div className="text-xs text-[#888780] mb-2">Category</div>
        <div className="flex gap-2 overflow-x-auto pb-1 -mx-4 px-4">
          {categories.map((c) => {
            const active = selectedCat === c.id;
            return (
              <button
                key={c.id}
                onClick={() => setSelectedCat(active ? undefined : c.id)}
                className={`shrink-0 inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs transition-colors ${active ? 'border-transparent text-white' : 'border-[#e8e7e3] bg-white text-[#2c2c2a]'}`}
                style={active ? { backgroundColor: c.color } : undefined}
              >
                <span>{c.emoji}</span> {c.name}
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-5">
        <label className="text-xs text-[#888780]">UPI ID</label>
        <input
          value={upi}
          onChange={(e) => setUpi(e.target.value)}
          placeholder="Enter UPI ID (e.g. name@okaxis)"
          className="mt-1 w-full rounded-xl border border-[#e8e7e3] bg-white px-3 py-3 text-sm outline-none focus:border-[#7F77DD]"
        />
      </div>

      <div className="mt-4">
        <label className="text-xs text-[#888780]">Amount</label>
        <div className="mt-1 flex items-center rounded-xl border border-[#e8e7e3] bg-white px-3 py-3 focus-within:border-[#7F77DD]">
          <span className="text-2xl text-[#888780] mr-2">₹</span>
          <input
            value={amount}
            onChange={(e) => setAmount(e.target.value.replace(/\D/g, ''))}
            placeholder="0"
            inputMode="numeric"
            className="flex-1 text-[28px] font-medium tracking-tight outline-none placeholder:text-[#d6d4ce]"
          />
        </div>
      </div>

      <div className="mt-4">
        <label className="text-xs text-[#888780]">Note</label>
        <input
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Add a note (optional)"
          className="mt-1 w-full rounded-xl border border-[#e8e7e3] bg-white px-3 py-3 text-sm outline-none focus:border-[#7F77DD]"
        />
      </div>

      <button
        onClick={handlePay}
        disabled={!valid}
        className="fixed bottom-20 left-4 right-4 mx-auto max-w-md block rounded-xl bg-[#7F77DD] py-3.5 text-sm font-medium text-white disabled:opacity-50"
      >
        Pay now
      </button>

      <PaySuccessOverlay
        open={!!success}
        merchant={success?.merchant ?? ''}
        amount={success?.amount ?? 0}
        categoryName={success?.categoryName ?? ''}
        upiRef={success?.upiRef ?? ''}
        onDone={() => { setSuccess(null); navigate({ to: '/' }); }}
      />
    </div>
  );
}
