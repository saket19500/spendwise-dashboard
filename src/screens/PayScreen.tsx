import { useState } from 'react';
import { useNavigate, useSearch } from '@tanstack/react-router';
import { X, QrCode, Smartphone, CreditCard, Wallet } from 'lucide-react';
import { useStore } from '@/store/useStore';
import { PaySuccessOverlay } from '@/components/PaySuccessOverlay';
import type { PaymentMethod } from '@/data/mockData';

type Method = 'UPI' | 'QR Scan' | 'Debit Card' | 'Credit Card';

const METHODS: { id: Method; label: string; icon: typeof QrCode }[] = [
  { id: 'UPI', label: 'UPI ID', icon: Smartphone },
  { id: 'QR Scan', label: 'Scan QR', icon: QrCode },
  { id: 'Debit Card', label: 'Debit', icon: Wallet },
  { id: 'Credit Card', label: 'Credit', icon: CreditCard },
];

export function PayScreen() {
  const navigate = useNavigate();
  const search = useSearch({ from: '/pay' }) as { category?: string };
  const categories = useStore((s) => s.categories);
  const addTransaction = useStore((s) => s.addTransaction);

  const [method, setMethod] = useState<Method>('UPI');
  const [selectedCat, setSelectedCat] = useState<string | undefined>(search.category);
  const [upi, setUpi] = useState('');
  const [merchant, setMerchant] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [scanning, setScanning] = useState(false);
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  const [success, setSuccess] = useState<null | { merchant: string; amount: number; categoryName: string; upiRef: string }>(null);

  const formatCard = (v: string) =>
    v.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim();
  const formatExpiry = (v: string) => {
    const d = v.replace(/\D/g, '').slice(0, 4);
    return d.length > 2 ? `${d.slice(0, 2)}/${d.slice(2)}` : d;
  };

  const recipientLabel = (): string => {
    if (method === 'UPI') return upi.trim();
    if (method === 'QR Scan') return merchant.trim() || 'Scanned merchant';
    return merchant.trim();
  };

  const valid = (() => {
    if (Number(amount) <= 0) return false;
    if (method === 'UPI') return upi.trim().length > 0;
    if (method === 'QR Scan') return merchant.trim().length > 0;
    return (
      merchant.trim().length > 0 &&
      cardNumber.replace(/\s/g, '').length >= 12 &&
      cardExpiry.length === 5 &&
      cardCvv.length >= 3
    );
  })();

  const handleSimulateScan = () => {
    setScanning(true);
    setTimeout(() => {
      setMerchant('Reliance Fresh');
      setScanning(false);
    }, 1200);
  };

  const handlePay = () => {
    if (!valid) return;
    const catId = selectedCat ?? categories[0]?.id;
    const cat = categories.find((c) => c.id === catId);
    if (!cat) return;
    const today = new Date();
    const ymd = `${today.getFullYear()}${String(today.getMonth() + 1).padStart(2, '0')}${String(today.getDate()).padStart(2, '0')}`;
    const prefix = method === 'UPI' || method === 'QR Scan' ? 'UPI' : 'CRD';
    const ref = `${prefix}${ymd}${Math.floor(1000 + Math.random() * 9000)}`;
    const recipient = recipientLabel();
    addTransaction({
      id: `t-${Date.now()}`,
      categoryId: cat.id,
      merchant: recipient,
      amount: Number(amount),
      date: today.toISOString().slice(0, 10),
      time: today.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }),
      upiRef: ref,
      paymentMethod: method as PaymentMethod,
      remarks: note.trim() || undefined,
    });
    setSuccess({ merchant: recipient, amount: Number(amount), categoryName: cat.name, upiRef: ref });
  };

  const activeCat = categories.find((c) => c.id === selectedCat);

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

      {/* Method tabs */}
      <div className="mt-5 grid grid-cols-4 gap-2">
        {METHODS.map((m) => {
          const Icon = m.icon;
          const active = method === m.id;
          return (
            <button
              key={m.id}
              onClick={() => setMethod(m.id)}
              className={`flex flex-col items-center gap-1 rounded-xl border px-2 py-3 text-[11px] transition-colors ${active ? 'border-[#7F77DD] bg-[#EEEDFE] text-[#534AB7]' : 'border-[#e8e7e3] bg-white text-[#888780]'}`}
            >
              <Icon size={18} />
              {m.label}
            </button>
          );
        })}
      </div>

      {/* Category chips */}
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

      {/* Method-specific inputs */}
      {method === 'UPI' && (
        <div className="mt-5">
          <label className="text-xs text-[#888780]">UPI ID</label>
          <input
            value={upi}
            onChange={(e) => setUpi(e.target.value)}
            placeholder="name@okaxis"
            className="mt-1 w-full rounded-xl border border-[#e8e7e3] bg-white px-3 py-3 text-sm outline-none focus:border-[#7F77DD]"
          />
        </div>
      )}

      {method === 'QR Scan' && (
        <div className="mt-5">
          <div
            onClick={handleSimulateScan}
            className="relative flex h-44 cursor-pointer items-center justify-center overflow-hidden rounded-2xl border border-dashed border-[#d6d4ce] bg-[#f5f4f1]"
          >
            {scanning ? (
              <div className="flex flex-col items-center gap-2 text-[#534AB7]">
                <QrCode size={36} className="animate-pulse" />
                <div className="text-xs">Scanning…</div>
              </div>
            ) : merchant ? (
              <div className="flex flex-col items-center gap-1 text-[#2c2c2a]">
                <div className="text-xs text-[#888780]">Scanned</div>
                <div className="text-sm font-medium">{merchant}</div>
                <div className="text-[11px] text-[#534AB7] mt-1">Tap to rescan</div>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-2 text-[#888780]">
                <QrCode size={36} />
                <div className="text-xs">Tap to scan QR code</div>
              </div>
            )}
          </div>
          {merchant && (
            <input
              value={merchant}
              onChange={(e) => setMerchant(e.target.value)}
              className="mt-3 w-full rounded-xl border border-[#e8e7e3] bg-white px-3 py-3 text-sm outline-none focus:border-[#7F77DD]"
            />
          )}
        </div>
      )}

      {(method === 'Debit Card' || method === 'Credit Card') && (
        <div className="mt-5 space-y-3">
          <div>
            <label className="text-xs text-[#888780]">Merchant name</label>
            <input
              value={merchant}
              onChange={(e) => setMerchant(e.target.value)}
              placeholder="e.g. Amazon"
              className="mt-1 w-full rounded-xl border border-[#e8e7e3] bg-white px-3 py-3 text-sm outline-none focus:border-[#7F77DD]"
            />
          </div>
          <div>
            <label className="text-xs text-[#888780]">Card number</label>
            <input
              value={cardNumber}
              onChange={(e) => setCardNumber(formatCard(e.target.value))}
              placeholder="1234 5678 9012 3456"
              inputMode="numeric"
              className="mt-1 w-full rounded-xl border border-[#e8e7e3] bg-white px-3 py-3 text-sm tracking-wider outline-none focus:border-[#7F77DD]"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-[#888780]">Expiry</label>
              <input
                value={cardExpiry}
                onChange={(e) => setCardExpiry(formatExpiry(e.target.value))}
                placeholder="MM/YY"
                inputMode="numeric"
                className="mt-1 w-full rounded-xl border border-[#e8e7e3] bg-white px-3 py-3 text-sm outline-none focus:border-[#7F77DD]"
              />
            </div>
            <div>
              <label className="text-xs text-[#888780]">CVV</label>
              <input
                value={cardCvv}
                onChange={(e) => setCardCvv(e.target.value.replace(/\D/g, '').slice(0, 4))}
                placeholder="123"
                inputMode="numeric"
                type="password"
                className="mt-1 w-full rounded-xl border border-[#e8e7e3] bg-white px-3 py-3 text-sm outline-none focus:border-[#7F77DD]"
              />
            </div>
          </div>
        </div>
      )}

      {/* Amount */}
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

      <div className="fixed bottom-0 left-0 right-0 z-30 border-t border-[#e8e7e3] bg-white/95 backdrop-blur-md pb-[calc(env(safe-area-inset-bottom)+64px)] pt-3">
        <div className="mx-auto max-w-md px-4">
          <button
            onClick={handlePay}
            disabled={!valid}
            className="block w-full rounded-xl bg-[#7F77DD] py-3.5 text-sm font-medium text-white disabled:opacity-50"
          >
            Pay now
          </button>
        </div>
      </div>

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
