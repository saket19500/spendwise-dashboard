import { Link, useParams, useNavigate } from '@tanstack/react-router';
import { ArrowLeft } from 'lucide-react';
import { useStore } from '@/store/useStore';
import { StatCard } from '@/components/StatCard';
import { TransactionRow } from '@/components/TransactionRow';

export function CategoryDetailScreen() {
  const { id } = useParams({ from: '/category/$id' });
  const navigate = useNavigate();
  const category = useStore((s) => s.categories.find((c) => c.id === id));
  const transactions = useStore((s) =>
    s.transactions
      .filter((t) => t.categoryId === id)
      .sort((a, b) => (a.date < b.date ? 1 : -1))
  );
  const weekly = useStore((s) => s.getWeeklyTotalByCategory(id));
  const monthly = useStore((s) => s.getMonthlyTotalByCategory(id));
  const allTime = useStore((s) => s.getAllTimeByCategory(id));

  if (!category) {
    return <div className="p-6 text-sm text-[#888780]">Category not found.</div>;
  }

  return (
    <div className="px-4 pt-6 pb-28">
      <header className="flex items-center gap-3">
        <button onClick={() => navigate({ to: '/' })} className="p-1 -ml-1">
          <ArrowLeft size={22} className="text-[#2c2c2a]" />
        </button>
        <div
          className="flex h-9 w-9 items-center justify-center rounded-xl text-base"
          style={{ backgroundColor: category.bgColor }}
        >
          {category.emoji}
        </div>
        <div className="text-lg font-medium tracking-tight text-[#2c2c2a]">{category.name}</div>
      </header>

      <div className="mt-5 flex gap-3">
        <StatCard label="This week" amount={weekly} />
        <StatCard label="This month" amount={monthly} />
        <StatCard label="All time" amount={allTime} />
      </div>

      <section className="mt-6">
        <h2 className="text-sm font-medium text-[#2c2c2a] mb-2">Transactions</h2>
        <div className="rounded-2xl bg-white border border-[#e8e7e3] px-3 py-1 divide-y divide-[#f0efeb]">
          {transactions.length === 0 ? (
            <div className="py-6 text-center text-xs text-[#888780]">No transactions yet</div>
          ) : (
            transactions.map((t) => <TransactionRow key={t.id} txn={t} />)
          )}
        </div>
      </section>

      <Link
        to="/pay"
        search={{ category: id }}
        className="fixed bottom-20 left-4 right-4 mx-auto max-w-md block rounded-xl bg-[#7F77DD] py-3 text-center text-sm font-medium text-white"
      >
        Pay in this category
      </Link>
    </div>
  );
}
