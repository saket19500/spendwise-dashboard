import { useState } from 'react';
import { Link } from '@tanstack/react-router';
import { Plus, ScanLine, ChevronRight } from 'lucide-react';
import { useStore } from '@/store/useStore';
import { CategoryCard } from '@/components/CategoryCard';
import { TransactionRow } from '@/components/TransactionRow';
import { AddCategoryModal } from '@/components/AddCategoryModal';
import { formatCurrency } from '@/utils/formatCurrency';

export function HomeScreen() {
  const categories = useStore((s) => s.categories);
  const transactions = useStore((s) => s.transactions);
  const monthlyTotal = useStore((s) => s.getMonthlyTotal());
  const [modalOpen, setModalOpen] = useState(false);

  const recent = [...transactions]
    .sort((a, b) => (a.date < b.date ? 1 : -1))
    .slice(0, 5);

  return (
    <div className="px-4 pt-6 pb-28">
      {/* Top bar */}
      <header className="flex items-center justify-between">
        <div>
          <div className="text-xs text-[#888780]">Good morning,</div>
          <div className="text-xl font-medium tracking-tight text-[#2c2c2a]">Arjun</div>
        </div>
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#EEEDFE] text-sm font-medium text-[#534AB7]">
          AK
        </div>
      </header>

      {/* Summary card */}
      <section className="mt-5 rounded-2xl bg-[#2c2c2a] p-5 text-white">
        <div className="text-xs text-white/60">Total spent this month</div>
        <div className="mt-1 text-3xl font-medium tracking-tight">
          {formatCurrency(monthlyTotal)}
        </div>
        <div className="mt-2 flex items-center gap-2 text-[11px]">
          <span className="rounded-full bg-[#1D9E75]/20 px-2 py-0.5 text-[#7DE0B7]">−12%</span>
          <span className="text-white/60">vs last month · May 2026</span>
        </div>
      </section>

      {/* Scan bill CTA */}
      <Link
        to="/bill"
        className="mt-4 flex items-center gap-3 rounded-2xl border border-[#e8e7e3] bg-white p-3.5 active:scale-[0.99] transition-transform"
      >
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#EEEDFE] text-[#534AB7]">
          <ScanLine size={20} />
        </div>
        <div className="flex-1">
          <div className="text-sm font-medium text-[#2c2c2a]">Scan a bill</div>
          <div className="text-[11px] text-[#888780]">Auto-detect items & split by category</div>
        </div>
        <ChevronRight size={18} className="text-[#c8c6c0]" />
      </Link>

      {/* Category grid */}
      <section className="mt-5">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-medium text-[#2c2c2a]">Categories</h2>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {categories.map((c) => <CategoryCard key={c.id} category={c} />)}
          <button
            onClick={() => setModalOpen(true)}
            className="flex min-h-[140px] flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-[#d6d4ce] text-[#888780] active:scale-[0.97] transition-transform"
          >
            <Plus size={20} />
            <span className="text-xs">Add category</span>
          </button>
        </div>
      </section>

      {/* Recent transactions */}
      <section className="mt-6">
        <div className="flex items-center justify-between mb-1">
          <h2 className="text-sm font-medium text-[#2c2c2a]">Recent transactions</h2>
          <Link to="/transactions" className="text-xs text-[#534AB7]">See all</Link>
        </div>
        <div className="rounded-2xl bg-white border border-[#e8e7e3] px-3 py-1 mt-2 divide-y divide-[#f0efeb]">
          {recent.map((t) => <TransactionRow key={t.id} txn={t} />)}
        </div>
      </section>

      <AddCategoryModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  );
}
