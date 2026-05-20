import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { QrCode, Check, ArrowLeft } from 'lucide-react';
import { useStore } from '@/store/useStore';
import { formatCurrency } from '@/utils/formatCurrency';

type Stage = 'scan' | 'amount' | 'paying' | 'categorize' | 'done';

const MOCK_MERCHANTS = ['Reliance Fresh', 'Starbucks Coffee', 'Zomato', 'Uber India', 'BigBasket'];

export function ScanPayScreen() {
  const navigate = useNavigate();
  const categories = useStore((s) => s.categories);
  const addTransaction = useStore((s) => s.addTransaction);

  const [stage, setStage] = useState<Stage>('scan');
  const [merchant, setMerchant] = useState('');
  const [amount, setAmount] = useState('');
  const [upiRef, setUpiRef] = useState('');

  const handleScan = () => {
    setStage('scan');
    setTimeout(() => {
      setMerchant(MOCK_MERCHANTS[Math.floor(Math.random() * MOCK_MERCHANTS.length)]);
      setStage('amount');
    }, 1200);
  };

  const handlePay = () => {
    if (Number(amount) <= 0) return;
    setStage('paying');
    setTimeout(() => {
      const today = new Date();
      const ymd = `${today.getFullYear()}${String(today.getMonth() + 1).padStart(2, '0')}${String(today.getDate()).padStart(2, '0')}`;
      setUpiRef(`UPI${ymd}${Math.floor(1000 + Math.random() * 9000)}`);
      setStage('categorize');
    }, 1400);
  };

  const handleAssignCategory = (catId: string) => {
    const cat = categories.find((c) => c.id === catId);
    if (!cat) return;
    const today = new Date();
    addTransaction({
      id: `t-${Date.now()}`,
      categoryId: cat.id,
      merchant,
      amount: Number(amount),
      date: today.toISOString().slice(0, 10),
      time: today.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }),
      upiRef,
      paymentMethod: 'QR Scan',
    });
    setStage('done');
  };

  return (
    <div className="px-4 pt-6 pb-28 min-h-screen">
      <header className="flex items-center gap-3">
        <button onClick={() => navigate({ to: '/' })} className="text-[#2c2c2a]">
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-xl font-medium tracking-tight">Scan & Pay</h1>
      </header>

      {stage === 'scan' && (
        <div className="mt-8">
          <div
            onClick={handleScan}
            className="relative mx-auto flex h-72 w-72 cursor-pointer items-center justify-center overflow-hidden rounded-3xl border-2 border-dashed border-[#d6d4ce] bg-[#f5f4f1]"
          >
            <div className="absolute inset-6 rounded-2xl border-2 border-[#7F77DD]/40" />
            {merchant ? (
              <div className="text-center">
                <QrCode size={48} className="mx-auto text-[#534AB7] animate-pulse" />
                <div className="mt-2 text-xs text-[#534AB7]">Scanning…</div>
              </div>
            ) : (
              <div className="text-center text-[#888780]">
                <QrCode size={48} className="mx-auto" />
                <div className="mt-3 text-sm">Tap to scan QR</div>
              </div>
            )}
          </div>
          <p className="mt-5 text-center text-xs text-[#888780]">
            Point at any UPI QR code to pay instantly
          </p>
        </div>
      )}

      {stage === 'amount' && (
        <div className="mt-8">
          <div className="rounded-2xl bg-white border border-[#e8e7e3] p-4">
            <div className="text-xs text-[#888780]">Paying to</div>
            <div className="mt-1 text-base font-medium">{merchant}</div>
          </div>
          <div className="mt-4">
            <label className="text-xs text-[#888780]">Amount</label>
            <div className="mt-1 flex items-center rounded-xl border border-[#e8e7e3] bg-white px-3 py-3 focus-within:border-[#7F77DD]">
              <span className="text-2xl text-[#888780] mr-2">₹</span>
              <input
                autoFocus
                value={amount}
                onChange={(e) => setAmount(e.target.value.replace(/\D/g, ''))}
                placeholder="0"
                inputMode="numeric"
                className="flex-1 text-[28px] font-medium tracking-tight outline-none placeholder:text-[#d6d4ce]"
              />
            </div>
          </div>
          <button
            onClick={handlePay}
            disabled={Number(amount) <= 0}
            className="mt-6 w-full rounded-xl bg-[#7F77DD] py-3.5 text-sm font-medium text-white disabled:opacity-50"
          >
            Pay {amount ? formatCurrency(Number(amount)) : ''}
          </button>
        </div>
      )}

      {stage === 'paying' && (
        <div className="mt-24 flex flex-col items-center gap-4">
          <div className="h-14 w-14 rounded-full border-4 border-[#EEEDFE] border-t-[#7F77DD] animate-spin" />
          <div className="text-sm text-[#888780]">Processing payment…</div>
        </div>
      )}

      {stage === 'categorize' && (
        <div className="mt-6">
          <div className="rounded-2xl bg-[#1D9E75]/10 border border-[#1D9E75]/20 p-4 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#1D9E75] text-white">
              <Check size={20} />
            </div>
            <div className="flex-1">
              <div className="text-sm font-medium text-[#2c2c2a]">Paid {formatCurrency(Number(amount))}</div>
              <div className="text-[11px] text-[#888780]">{merchant} · {upiRef}</div>
            </div>
          </div>

          <div className="mt-6">
            <h2 className="text-sm font-medium">Add to category</h2>
            <p className="text-xs text-[#888780] mt-0.5">Pick a category to track this spend</p>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-3">
            {categories.map((c) => (
              <button
                key={c.id}
                onClick={() => handleAssignCategory(c.id)}
                className="flex items-center gap-3 rounded-2xl border border-[#e8e7e3] bg-white p-3 text-left active:scale-[0.98] transition-transform"
              >
                <div
                  className="flex h-10 w-10 items-center justify-center rounded-xl text-lg"
                  style={{ backgroundColor: `${c.color}22` }}
                >
                  {c.emoji}
                </div>
                <div className="text-sm font-medium text-[#2c2c2a]">{c.name}</div>
              </button>
            ))}
          </div>
        </div>
      )}

      {stage === 'done' && (
        <div className="mt-24 flex flex-col items-center gap-4 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#1D9E75] text-white">
            <Check size={32} />
          </div>
          <div>
            <div className="text-lg font-medium">All set!</div>
            <div className="text-xs text-[#888780] mt-1">Payment tracked in your spends</div>
          </div>
          <button
            onClick={() => navigate({ to: '/' })}
            className="mt-2 rounded-xl bg-[#2c2c2a] px-6 py-3 text-sm font-medium text-white"
          >
            Back to home
          </button>
        </div>
      )}
    </div>
  );
}
