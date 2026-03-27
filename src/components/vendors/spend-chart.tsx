"use client";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface SpendChartProps {
  data: { category: string; spend: number }[];
}

const COLORS = [
  "#6366f1", // indigo
  "#06b6d4", // cyan
  "#f59e0b", // amber
  "#10b981", // emerald
  "#ec4899", // pink
  "#8b5cf6", // violet
  "#f97316", // orange
  "#14b8a6", // teal
];

function formatCurrency(cents: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(cents / 100);
}

function CustomTooltip({
  active,
  payload,
}: {
  active?: boolean;
  payload?: { payload: { category: string; spend: number }; color: string }[];
}) {
  if (!active || !payload?.length) return null;
  const { category, spend } = payload[0].payload;
  return (
    <div className="rounded-lg border bg-popover px-3 py-1.5 text-[11px] shadow-md">
      <p className="font-medium capitalize">{category}</p>
      <p className="text-muted-foreground">{formatCurrency(spend)}</p>
    </div>
  );
}

export function SpendChart({ data }: SpendChartProps) {
  const totalSpend = data.reduce((sum, d) => sum + d.spend, 0);

  if (!data.length || totalSpend === 0) {
    return (
      <div className="rounded-xl border bg-card p-4">
        <h3 className="text-sm font-semibold mb-2">Spend by Category</h3>
        <p className="text-sm text-muted-foreground/50 text-center py-8">
          No vendor spend data available.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border bg-card p-4">
      <h3 className="text-sm font-semibold mb-2">Spend by Category</h3>
      <div style={{ width: "100%", height: 200 }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="spend"
              nameKey="category"
              cx="50%"
              cy="45%"
              innerRadius="60%"
              outerRadius="80%"
              paddingAngle={2}
              strokeWidth={0}
            >
              {data.map((_, i) => (
                <Cell key={i} fill={COLORS[i % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1 justify-center">
        {data.map((d, i) => (
          <div key={d.category} className="flex items-center gap-1.5 text-[11px]">
            <span
              className="inline-block h-2 w-2 rounded-full shrink-0"
              style={{ backgroundColor: COLORS[i % COLORS.length] }}
            />
            <span className="text-muted-foreground capitalize">{d.category}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
