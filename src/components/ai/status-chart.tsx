"use client";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface StatusChartProps {
  data: { status: string; count: number }[];
}

const STATUS_COLORS: Record<string, string> = {
  ideation: "#8b5cf6",
  development: "#3b82f6",
  testing: "#f59e0b",
  deployed: "#10b981",
  retired: "#9ca3af",
};

function CustomTooltip({
  active,
  payload,
}: {
  active?: boolean;
  payload?: { payload: { status: string; count: number } }[];
}) {
  if (!active || !payload?.length) return null;
  const { status, count } = payload[0].payload;
  return (
    <div className="rounded-lg border bg-popover px-3 py-1.5 text-[11px] shadow-md">
      <p className="font-medium capitalize">{status}</p>
      <p className="text-muted-foreground">{count} {count === 1 ? "initiative" : "initiatives"}</p>
    </div>
  );
}

export function StatusChart({ data }: StatusChartProps) {
  const total = data.reduce((sum, d) => sum + d.count, 0);

  if (!data.length || total === 0) {
    return (
      <div className="rounded-xl border bg-card p-4">
        <h3 className="text-sm font-semibold mb-2">Initiatives by Status</h3>
        <p className="text-sm text-muted-foreground/50 text-center py-8">
          No AI initiatives to display.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border bg-card p-4">
      <h3 className="text-sm font-semibold mb-2">Initiatives by Status</h3>
      <div style={{ width: "100%", height: 200 }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="count"
              nameKey="status"
              cx="50%"
              cy="45%"
              outerRadius="80%"
              paddingAngle={2}
              strokeWidth={0}
            >
              {data.map((d) => (
                <Cell
                  key={d.status}
                  fill={STATUS_COLORS[d.status] ?? "#9ca3af"}
                />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1 justify-center">
        {data.map((d) => (
          <div key={d.status} className="flex items-center gap-1.5 text-[11px]">
            <span
              className="inline-block h-2 w-2 rounded-full shrink-0"
              style={{ backgroundColor: STATUS_COLORS[d.status] ?? "#9ca3af" }}
            />
            <span className="text-muted-foreground capitalize">{d.status}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
