import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { formatCurrency } from '@/utils/formatCurrency';

interface Datum { name: string; value: number; color: string; }

export function SpendDonutChart({ data, total }: { data: Datum[]; total: number }) {
  if (total === 0) {
    return (
      <div className="flex h-56 items-center justify-center text-sm text-[#888780]">
        No spend this month
      </div>
    );
  }
  return (
    <div className="relative h-56">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            innerRadius={70}
            outerRadius={95}
            paddingAngle={2}
            stroke="none"
          >
            {data.map((d) => <Cell key={d.name} fill={d.color} />)}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
      <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
        <div className="text-[11px] text-[#888780]">Total spent</div>
        <div className="text-lg font-medium tracking-tight text-[#2c2c2a]">
          {formatCurrency(total)}
        </div>
      </div>
    </div>
  );
}
