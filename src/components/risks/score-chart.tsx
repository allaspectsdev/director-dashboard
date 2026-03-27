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

interface ScoreChartProps {
  data: { level: string; count: number; color: string }[];
}

function CustomTooltip({
  active,
  payload,
}: {
  active?: boolean;
  payload?: { payload: { level: string; count: number } }[];
}) {
  if (!active || !payload?.length) return null;
  const { level, count } = payload[0].payload;
  return (
    <div className="rounded-lg border bg-popover px-3 py-1.5 text-[11px] shadow-md">
      <p className="font-medium capitalize">{level}</p>
      <p className="text-muted-foreground">{count} {count === 1 ? "risk" : "risks"}</p>
    </div>
  );
}

export function ScoreChart({ data }: ScoreChartProps) {
  return (
    <div className="rounded-xl border bg-card p-4">
      <h3 className="text-sm font-semibold mb-2">Risks by Level</h3>
      <div style={{ width: "100%", height: 160 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 16, right: 8, left: 8, bottom: 0 }}
          >
            <XAxis
              dataKey="level"
              tick={{ fontSize: 11, fill: "currentColor" }}
              tickFormatter={(v: string) =>
                v.charAt(0).toUpperCase() + v.slice(1)
              }
              axisLine={false}
              tickLine={false}
            />
            <YAxis hide />
            <Tooltip content={<CustomTooltip />} cursor={false} />
            <Bar
              dataKey="count"
              radius={[4, 4, 0, 0]}
              barSize={32}
              label={{
                position: "top",
                fontSize: 11,
                fill: "currentColor",
              }}
            >
              {data.map((d) => (
                <Cell key={d.level} fill={d.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
