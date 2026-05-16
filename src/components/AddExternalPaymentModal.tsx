import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { useStore } from '@/store/useStore';
import { PAYMENT_METHODS, type PaymentMethod } from '@/data/mockData';

interface Props {
  open: boolean;
  onClose: () => void;
  categoryId: string;
}

export function AddExternalPaymentModal({ open, onClose, categoryId }: Props) {
  const addTransaction = useStore((s) => s.addTransaction);
  const category = useStore((s) => s.categories.find((c) => c.id === categoryId));

  const [amount, setAmount] = useState('');
  const [method, setMethod] = useState<PaymentMethod>('Credit Card');
  const [merchant, setMerchant] = useState('');
  const [remarks, setRemarks] = useState('');

  useEffect(() => {
    if (!open) {
      setAmount('');
      setMethod('Credit Card');
      setMerchant('');
      setRemarks('');
    }
  }, [open]);

  if (!category) return null;
  const valid = Number(amount) > 0 && merchant.trim().length > 0;

  const handleSave = () => {
    if (!valid) return;
    const today = new Date();
    const ymd = `${today.getFullYear()}${String(today.getMonth() + 1).padStart(2, '0')}${String(today.getDate()).padStart(2, '0')}`;
    const ref = `EXT${ymd}${Math.floor(1000 + Math.random() * 9000)}`;
    addTransaction({
      id: `t-${Date.now()}`,
      categoryId,
      merchant: merchant.trim(),
      amount: Number(amount),
      date: today.toISOString().slice(0, 10),
      time: today.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }),
      upiRef: ref,
      paymentMethod: method,
      remarks: remarks.trim() || undefined,
      external: true,
    });
    onClose();
  };

  return (
    <div
      className={`fixed inset-0 z-50 transition-opacity ${open ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
    >
      <div
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
      />
      <div
        className={`absolute bottom-0 left-0 right-0 mx-auto max-w-md rounded-t-3xl bg-white p-5 pb-8 transition-transform duration-300 ${open ? 'translate-y-0' : 'translate-y-full'}`}
      >
        <div className="flex items-center justify-between mb-1">
          <div>
            <div className="text-xs text-[#888780]">Log external payment</div>
            <div className="text-base font-medium tracking-tight text-[#2c2c2a]">
              {category.emoji} {category.name}
            </div>
          </div>
          <button onClick={onClose} className="p-1 -mr-1">
            <X size={20} className="text-[#888780]" />
          </button>
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
              className="flex-1 text-[24px] font-medium tracking-tight outline-none placeholder:text-[#d6d4ce]"
            />
          </div>
        </div>

        <div className="mt-4">
          <label className="text-xs text-[#888780]">Payment method</label>
          <select
            value={method}
            onChange={(e) => setMethod(e.target.value as PaymentMethod)}
            className="mt-1 w-full appearance-none rounded-xl border border-[#e8e7e3] bg-white px-3 py-3 text-sm outline-none focus:border-[#7F77DD]"
          >
            {PAYMENT_METHODS.map((m) => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
        </div>

        <div className="mt-4">
          <label className="text-xs text-[#888780]">Merchant name</label>
          <input
            value={merchant}
            onChange={(e) => setMerchant(e.target.value)}
            placeholder="e.g. Zara, Big Bazaar"
            className="mt-1 w-full rounded-xl border border-[#e8e7e3] bg-white px-3 py-3 text-sm outline-none focus:border-[#7F77DD]"
          />
        </div>

        <div className="mt-4">
          <label className="text-xs text-[#888780]">Remarks (optional)</label>
          <input
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
            placeholder="Add a note"
            className="mt-1 w-full rounded-xl border border-[#e8e7e3] bg-white px-3 py-3 text-sm outline-none focus:border-[#7F77DD]"
          />
        </div>

        <button
          onClick={handleSave}
          disabled={!valid}
          className="mt-5 w-full rounded-xl bg-[#7F77DD] py-3.5 text-sm font-medium text-white disabled:opacity-50"
        >
          Add payment
        </button>
      </div>
    </div>
  );
}
