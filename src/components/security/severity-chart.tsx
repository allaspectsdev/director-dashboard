"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
  ResponsiveContainer,
} from "recharts";

interface SeverityChartProps {
  data: { severity: string; count: number }[];
}

const SEVERITY_COLORS: Record<string, string> = {
  critical: "#ef4444",
  high: "#f97316",
  medium: "#f59e0b",
  low: "#3b82f6",
  info: "#9ca3af",
};

function CustomTooltip({
  active,
  payload,
}: {
  active?: boolean;
  payload?: { payload: { severity: string; count: number } }[];
}) {
  if (!active || !payload?.length) return null;
  const { severity, count } = payload[0].payload;
  return (
    <div className="rounded-lg border bg-popover px-3 py-1.5 text-[11px] shadow-md">
      <p className="font-medium capitalize">{severity}</p>
      <p className="text-muted-foreground">{count} open</p>
    </div>
  );
}

export function SeverityChart({ data }: SeverityChartProps) {
  return (
    <div className="rounded-xl border bg-card p-4">
      <h3 className="text-sm font-semibold mb-2">Open Items by Severity</h3>
      <div style={{ width: "100%", height: 160 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            layout="vertical"
            margin={{ top: 0, right: 32, left: 0, bottom: 0 }}
          >
            <XAxis type="number" hide />
            <YAxis
              type="category"
              dataKey="severity"
              width={70}
              tick={{ fontSize: 11, fill: "currentColor" }}
              tickFormatter={(v: string) =>
                v.charAt(0).toUpperCase() + v.slice(1)
              }
              axisLine={false}
              tickLine={false}
            />
            <Tooltip content={<CustomTooltip />} cursor={false} />
            <Bar
              dataKey="count"
              radius={[0, 4, 4, 0]}
              barSize={14}
              label={{
                position: "right",
                fontSize: 11,
                fill: "currentColor",
              }}
            >
              {data.map((d) => (
                <Cell
                  key={d.severity}
                  fill={SEVERITY_COLORS[d.severity] ?? "#9ca3af"}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
