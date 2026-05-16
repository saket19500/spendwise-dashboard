import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { ScanLine, Trash2, Plus, Check, ChevronDown, ArrowLeft, Receipt } from 'lucide-react';
import { useStore } from '@/store/useStore';
import { AddCategoryModal } from '@/components/AddCategoryModal';
import { formatCurrency } from '@/utils/formatCurrency';

interface BillItem {
  id: string;
  name: string;
  amount: number;
  categoryId?: string;
}

// Mock OCR result — pretends the camera scanned a supermarket bill
const MOCK_SCAN_POOL: { merchant: string; items: { name: string; amount: number; hintCat?: string }[] }[] = [
  {
    merchant: 'DMart - Koramangala',
    items: [
      { name: 'Amul Milk 1L x2', amount: 138, hintCat: 'food' },
      { name: 'Brown Bread', amount: 55, hintCat: 'food' },
      { name: 'Maggi Noodles 8pk', amount: 120, hintCat: 'food' },
      { name: 'Surf Excel 1kg', amount: 220 },
      { name: 'Colgate Toothpaste', amount: 95 },
      { name: 'Lays Chips x3', amount: 90, hintCat: 'food' },
    ],
  },
  {
    merchant: 'Reliance Fresh',
    items: [
      { name: 'Onion 2kg', amount: 80, hintCat: 'food' },
      { name: 'Tomato 1kg', amount: 60, hintCat: 'food' },
      { name: 'Basmati Rice 5kg', amount: 540, hintCat: 'food' },
      { name: 'Refined Oil 1L', amount: 165, hintCat: 'food' },
      { name: 'Dish Soap', amount: 70 },
    ],
  },
  {
    merchant: 'BigBasket',
    items: [
      { name: 'Eggs (12)', amount: 95, hintCat: 'food' },
      { name: 'Atta 5kg', amount: 280, hintCat: 'food' },
      { name: 'Toor Dal 1kg', amount: 175, hintCat: 'food' },
      { name: 'Hand Wash 250ml', amount: 99 },
      { name: 'Chocolate Bar x2', amount: 140, hintCat: 'food' },
    ],
  },
];

export function ScanBillScreen() {
  const navigate = useNavigate();
  const categories = useStore((s) => s.categories);
  const addTransaction = useStore((s) => s.addTransaction);

  const [stage, setStage] = useState<'idle' | 'scanning' | 'review' | 'done'>('idle');
  const [merchant, setMerchant] = useState('');
  const [items, setItems] = useState<BillItem[]>([]);
  const [openPickerFor, setOpenPickerFor] = useState<string | null>(null);
  const [catModalOpen, setCatModalOpen] = useState(false);
  const [pendingItemForNewCat, setPendingItemForNewCat] = useState<string | null>(null);

  const handleScan = () => {
    setStage('scanning');
    setTimeout(() => {
      const pick = MOCK_SCAN_POOL[Math.floor(Math.random() * MOCK_SCAN_POOL.length)];
      setMerchant(pick.merchant);
      setItems(
        pick.items.map((it, i) => ({
          id: `bi-${Date.now()}-${i}`,
          name: it.name,
          amount: it.amount,
          categoryId: it.hintCat && categories.find((c) => c.id === it.hintCat) ? it.hintCat : undefined,
        })),
      );
      setStage('review');
    }, 1400);
  };

  const updateItem = (id: string, patch: Partial<BillItem>) =>
    setItems((arr) => arr.map((it) => (it.id === id ? { ...it, ...patch } : it)));

  const removeItem = (id: string) => setItems((arr) => arr.filter((it) => it.id !== id));

  const addBlankItem = () =>
    setItems((arr) => [...arr, { id: `bi-${Date.now()}`, name: '', amount: 0 }]);

  // After a new category is added via modal, auto-assign it to the pending item
  const handleCategoryModalClose = () => {
    setCatModalOpen(false);
    if (pendingItemForNewCat) {
      // newest category will be last in store
      const latest = useStore.getState().categories.at(-1);
      if (latest) updateItem(pendingItemForNewCat, { categoryId: latest.id });
      setPendingItemForNewCat(null);
    }
    setOpenPickerFor(null);
  };

  const total = items.reduce((s, it) => s + (Number(it.amount) || 0), 0);
  const assignedCount = items.filter((it) => it.categoryId && it.name.trim() && it.amount > 0).length;
  const canSave = assignedCount > 0 && assignedCount === items.filter((it) => it.name.trim() && it.amount > 0).length;

  const handleSave = () => {
    const today = new Date();
    const dateStr = today.toISOString().slice(0, 10);
    const ymd = `${today.getFullYear()}${String(today.getMonth() + 1).padStart(2, '0')}${String(today.getDate()).padStart(2, '0')}`;
    const time = today.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
    items
      .filter((it) => it.categoryId && it.name.trim() && it.amount > 0)
      .forEach((it, idx) => {
        addTransaction({
          id: `t-bill-${Date.now()}-${idx}`,
          categoryId: it.categoryId!,
          merchant: `${merchant} — ${it.name}`,
          amount: Number(it.amount),
          date: dateStr,
          time,
          upiRef: `BILL${ymd}${Math.floor(1000 + Math.random() * 9000)}`,
          paymentMethod: 'Cash',
          remarks: `From scanned bill: ${merchant}`,
          external: true,
        });
      });
    setStage('done');
    setTimeout(() => navigate({ to: '/' }), 1100);
  };

  return (
    <div className="px-4 pt-6 pb-28">
      <header className="flex items-center gap-3">
        <button onClick={() => navigate({ to: '/' })} className="-ml-1 p-1 text-[#2c2c2a]">
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-xl font-medium tracking-tight text-[#2c2c2a]">Scan bill</h1>
      </header>

      {stage === 'idle' && (
        <div className="mt-6">
          <button
            onClick={handleScan}
            className="relative flex h-64 w-full flex-col items-center justify-center gap-3 overflow-hidden rounded-2xl border border-dashed border-[#d6d4ce] bg-[#f5f4f1] text-[#534AB7] active:scale-[0.99] transition-transform"
          >
            <ScanLine size={42} />
            <div className="text-sm font-medium">Tap to scan a bill</div>
            <div className="text-[11px] text-[#888780] px-8 text-center">
              Point at any supermarket bill. We'll auto-detect items & amounts.
            </div>
          </button>

          <div className="mt-5 rounded-2xl bg-white border border-[#e8e7e3] p-4">
            <div className="flex items-center gap-2 text-sm font-medium text-[#2c2c2a]">
              <Receipt size={16} className="text-[#534AB7]" />
              How it works
            </div>
            <ol className="mt-2 space-y-1.5 text-xs text-[#888780] list-decimal pl-4">
              <li>Scan the bill — we extract products & prices.</li>
              <li>Assign each item to a category (or create a new one).</li>
              <li>We log each as an expense in the right bucket.</li>
            </ol>
          </div>
        </div>
      )}

      {stage === 'scanning' && (
        <div className="mt-6 flex h-64 w-full flex-col items-center justify-center gap-3 rounded-2xl bg-[#2c2c2a] text-white">
          <ScanLine size={42} className="animate-pulse" />
          <div className="text-sm">Reading bill…</div>
          <div className="text-[11px] text-white/60">Detecting items, amounts & merchant</div>
        </div>
      )}

      {stage === 'review' && (
        <>
          <div className="mt-5 flex items-end justify-between">
            <div>
              <div className="text-[11px] text-[#888780]">Merchant</div>
              <input
                value={merchant}
                onChange={(e) => setMerchant(e.target.value)}
                className="mt-0.5 w-full bg-transparent text-base font-medium text-[#2c2c2a] outline-none"
              />
            </div>
            <div className="text-right">
              <div className="text-[11px] text-[#888780]">Total</div>
              <div className="text-lg font-medium text-[#2c2c2a]">{formatCurrency(total)}</div>
            </div>
          </div>

          <div className="mt-4 space-y-2.5">
            {items.map((it) => {
              const cat = categories.find((c) => c.id === it.categoryId);
              return (
                <div key={it.id} className="rounded-2xl border border-[#e8e7e3] bg-white p-3">
                  <div className="flex items-center gap-2">
                    <input
                      value={it.name}
                      onChange={(e) => updateItem(it.id, { name: e.target.value })}
                      placeholder="Item name"
                      className="flex-1 bg-transparent text-sm text-[#2c2c2a] outline-none"
                    />
                    <div className="flex items-center gap-1 text-sm">
                      <span className="text-[#888780]">₹</span>
                      <input
                        value={it.amount || ''}
                        onChange={(e) =>
                          updateItem(it.id, { amount: Number(e.target.value.replace(/\D/g, '')) })
                        }
                        inputMode="numeric"
                        placeholder="0"
                        className="w-16 bg-transparent text-right text-sm font-medium text-[#2c2c2a] outline-none"
                      />
                    </div>
                    <button onClick={() => removeItem(it.id)} className="p-1 text-[#c8c6c0] hover:text-[#E24B4A]">
                      <Trash2 size={15} />
                    </button>
                  </div>

                  <div className="mt-2 flex items-center justify-between">
                    <button
                      onClick={() => setOpenPickerFor(openPickerFor === it.id ? null : it.id)}
                      className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px]"
                      style={
                        cat
                          ? { backgroundColor: cat.bgColor, color: cat.color }
                          : { backgroundColor: '#f5f4f1', color: '#888780' }
                      }
                    >
                      {cat ? (
                        <>
                          <span>{cat.emoji}</span> {cat.name}
                        </>
                      ) : (
                        'Assign category'
                      )}
                      <ChevronDown size={12} />
                    </button>
                  </div>

                  {openPickerFor === it.id && (
                    <div className="mt-2 rounded-xl border border-[#e8e7e3] bg-[#fafaf8] p-2">
                      <div className="grid grid-cols-2 gap-1.5">
                        {categories.map((c) => (
                          <button
                            key={c.id}
                            onClick={() => {
                              updateItem(it.id, { categoryId: c.id });
                              setOpenPickerFor(null);
                            }}
                            className="flex items-center gap-1.5 rounded-lg bg-white px-2 py-1.5 text-[11px] text-[#2c2c2a] active:scale-[0.98]"
                          >
                            <span>{c.emoji}</span> {c.name}
                          </button>
                        ))}
                        <button
                          onClick={() => {
                            setPendingItemForNewCat(it.id);
                            setCatModalOpen(true);
                          }}
                          className="col-span-2 inline-flex items-center justify-center gap-1 rounded-lg border border-dashed border-[#d6d4ce] py-1.5 text-[11px] text-[#534AB7]"
                        >
                          <Plus size={12} /> New category
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}

            <button
              onClick={addBlankItem}
              className="flex w-full items-center justify-center gap-1 rounded-2xl border border-dashed border-[#d6d4ce] py-2.5 text-xs text-[#888780]"
            >
              <Plus size={14} /> Add item
            </button>
          </div>

          <button
            onClick={handleSave}
            disabled={!canSave}
            className="fixed bottom-20 left-4 right-4 mx-auto block max-w-md rounded-xl bg-[#7F77DD] py-3.5 text-sm font-medium text-white disabled:opacity-50"
          >
            {canSave
              ? `Add ${assignedCount} item${assignedCount > 1 ? 's' : ''} · ${formatCurrency(total)}`
              : 'Assign a category to every item'}
          </button>
        </>
      )}

      {stage === 'done' && (
        <div className="mt-10 flex flex-col items-center justify-center text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#1D9E75] text-white">
            <Check size={32} />
          </div>
          <div className="mt-3 text-base font-medium text-[#2c2c2a]">Bill added</div>
          <div className="mt-1 text-xs text-[#888780]">{assignedCount} items logged to your categories</div>
        </div>
      )}

      <AddCategoryModal open={catModalOpen} onClose={handleCategoryModalClose} />
    </div>
  );
}
