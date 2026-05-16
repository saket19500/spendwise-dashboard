import { useMemo, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useStore } from '@/store/useStore';
import { SpendDonutChart } from '@/components/SpendDonutChart';
import { CategoryBarChart } from '@/components/CategoryBarChart';
import { formatCurrency } from '@/utils/formatCurrency';
import { getMonthDates } from '@/utils/dateHelpers';

const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];

export function InsightsScreen() {
  const transactions = useStore((s) => s.transactions);
  const categories = useStore((s) => s.categories);
  const [cursor, setCursor] = useState({ year: 2026, month: 4 }); // May 2026

  const { start, end } = getMonthDates(cursor.year, cursor.month);
  const monthTxns = useMemo(
    () => transactions.filter((t) => t.date >= start && t.date <= end),
    [transactions, start, end]
  );
  const total = monthTxns.reduce((s, t) => s + t.amount, 0);

  const byCategory = useMemo(() => {
    return categories
      .map((c) => ({
        name: c.name,
        value: monthTxns.filter((t) => t.categoryId === c.id).reduce((s, t) => s + t.amount, 0),
        color: c.color,
      }))
      .filter((d) => d.value > 0);
  }, [categories, monthTxns]);

  const topMerchants = useMemo(() => {
    const map = new Map<string, { merchant: string; amount: number; categoryId: string }>();
    monthTxns.forEach((t) => {
      const cur = map.get(t.merchant);
      if (cur) cur.amount += t.amount;
      else map.set(t.merchant, { merchant: t.merchant, amount: t.amount, categoryId: t.categoryId });
    });
    return [...map.values()].sort((a, b) => b.amount - a.amount).slice(0, 5);
  }, [monthTxns]);
  const topMax = topMerchants[0]?.amount ?? 1;

  const prev = () => setCursor((c) => c.month === 0 ? { year: c.year - 1, month: 11 } : { ...c, month: c.month - 1 });
  const next = () => setCursor((c) => c.month === 11 ? { year: c.year + 1, month: 0 } : { ...c, month: c.month + 1 });

  return (
    <div className="px-4 pt-6 pb-28">
      <h1 className="text-xl font-medium tracking-tight text-[#2c2c2a]">Insights</h1>

      <div className="mt-4 flex items-center justify-between rounded-2xl bg-white border border-[#e8e7e3] px-2 py-2">
        <button onClick={prev} className="p-2"><ChevronLeft size={18} className="text-[#2c2c2a]" /></button>
        <div className="text-sm font-medium text-[#2c2c2a]">{MONTHS[cursor.month]} {cursor.year}</div>
        <button onClick={next} className="p-2"><ChevronRight size={18} className="text-[#2c2c2a]" /></button>
      </div>

      {total === 0 ? (
        <div className="mt-10 text-center text-sm text-[#888780]">
          No spend data for this month.
        </div>
      ) : (
        <>
          <section className="mt-5 rounded-2xl bg-white border border-[#e8e7e3] p-4">
            <SpendDonutChart data={byCategory} total={total} />
            <div className="mt-4 space-y-2">
              {byCategory.map((d) => {
                const pct = ((d.value / total) * 100).toFixed(0);
                return (
                  <div key={d.name} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: d.color }} />
                      <span className="text-[#2c2c2a]">{d.name}</span>
                    </div>
                    <div className="text-[#888780]">
                      {formatCurrency(d.value)} · {pct}%
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          <section className="mt-4 rounded-2xl bg-white border border-[#e8e7e3] p-4">
            <h2 className="text-sm font-medium text-[#2c2c2a] mb-3">By category</h2>
            <CategoryBarChart data={byCategory} total={total} />
          </section>

          <section className="mt-4 rounded-2xl bg-white border border-[#e8e7e3] p-4">
            <h2 className="text-sm font-medium text-[#2c2c2a] mb-3">Top merchants</h2>
            <div className="space-y-3">
              {topMerchants.map((m) => {
                const cat = categories.find((c) => c.id === m.categoryId)!;
                return (
                  <div key={m.merchant}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="truncate text-[13px] font-medium text-[#2c2c2a]">{m.merchant}</span>
                        <span
                          className="shrink-0 rounded-full px-2 py-0.5 text-[10px]"
                          style={{ backgroundColor: cat.bgColor, color: cat.color }}
                        >
                          {cat.name}
                        </span>
                      </div>
                      <div className="text-[13px] font-medium text-[#2c2c2a]">{formatCurrency(m.amount)}</div>
                    </div>
                    <div className="mt-1.5 h-1 w-full rounded-full bg-[#f0efeb] overflow-hidden">
                      <div
                        className="h-full rounded-full"
                        style={{ width: `${(m.amount / topMax) * 100}%`, backgroundColor: cat.color }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        </>
      )}
    </div>
  );
}
