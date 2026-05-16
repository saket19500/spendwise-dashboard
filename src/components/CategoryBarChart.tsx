import { BarChart, Bar, XAxis, YAxis, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { formatCurrency } from '@/utils/formatCurrency';

interface Datum { name: string; value: number; color: string; }

export function CategoryBarChart({ data, total }: { data: Datum[]; total: number }) {
  if (data.length === 0) {
    return (
      <div className="flex h-48 items-center justify-center text-sm text-[#888780]">
        No data
      </div>
    );
  }
  return (
    <div className="h-56">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 10, right: 8, left: -16, bottom: 0 }}>
          <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#888780' }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fontSize: 10, fill: '#888780' }} axisLine={false} tickLine={false} />
          <Tooltip
            cursor={{ fill: 'rgba(0,0,0,0.03)' }}
            content={({ active, payload }) => {
              if (!active || !payload?.length) return null;
              const d = payload[0].payload as Datum;
              const pct = total > 0 ? ((d.value / total) * 100).toFixed(0) : '0';
              return (
                <div className="rounded-lg border border-[#e8e7e3] bg-white px-3 py-2 shadow-sm">
                  <div className="text-xs font-medium text-[#2c2c2a]">{d.name}</div>
                  <div className="text-[11px] text-[#888780]">
                    {formatCurrency(d.value)} · {pct}%
                  </div>
                </div>
              );
            }}
          />
          <Bar dataKey="value" radius={[6, 6, 0, 0]}>
            {data.map((d) => <Cell key={d.name} fill={d.color} />)}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
