import { Link } from '@tanstack/react-router';
import type { Category } from '@/data/mockData';
import { useStore } from '@/store/useStore';
import { formatCurrency } from '@/utils/formatCurrency';

export function CategoryCard({ category }: { category: Category }) {
  const monthly = useStore((s) => s.getMonthlyTotalByCategory(category.id));
  const weekly = useStore((s) => s.getWeeklyTotalByCategory(category.id));
  const pct = Math.min(100, (monthly / category.budget) * 100);

  return (
    <Link
      to="/category/$id"
      params={{ id: category.id }}
      className="block rounded-2xl bg-white border border-[#e8e7e3] p-4 active:scale-[0.97] transition-transform"
    >
      <div
        className="flex h-9 w-9 items-center justify-center rounded-xl text-base mb-3"
        style={{ backgroundColor: category.bgColor }}
      >
        {category.emoji}
      </div>
      <div className="text-[12px] font-medium text-[#888780]">{category.name}</div>
      <div className="text-base font-medium tracking-tight text-[#2c2c2a] mt-0.5">
        {formatCurrency(monthly)}
      </div>
      <div className="text-[11px] text-[#888780] mt-0.5 truncate">
        This month · {formatCurrency(weekly)} this week
      </div>
      <div className="mt-3 h-1 w-full rounded-full bg-[#f0efeb] overflow-hidden">
        <div
          className="h-full rounded-full transition-all"
          style={{ width: `${pct}%`, backgroundColor: category.color }}
        />
      </div>
    </Link>
  );
}
