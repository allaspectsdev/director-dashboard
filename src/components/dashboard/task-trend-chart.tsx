"use client";

import {
  AreaChart,
  Area,
  XAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface TaskTrendChartProps {
  data: { week: string; completed: number }[];
}

function CustomTooltip({
  active,
  payload,
}: {
  active?: boolean;
  payload?: { payload: { week: string; completed: number } }[];
}) {
  if (!active || !payload?.length) return null;
  const { week, completed } = payload[0].payload;
  return (
    <div className="rounded-lg border bg-popover px-3 py-1.5 text-[11px] shadow-md">
      <p className="font-medium">{week}</p>
      <p className="text-muted-foreground">
        {completed} completed
      </p>
    </div>
  );
}

export function TaskTrendChart({ data }: TaskTrendChartProps) {
  return (
    <div className="rounded-xl border bg-card p-4">
      <h3 className="text-sm font-semibold mb-2">Task Completions</h3>
      <div style={{ width: "100%", height: 80 }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{ top: 4, right: 4, left: 4, bottom: 0 }}
          >
            <defs>
              <linearGradient id="taskTrendGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#6366f1" stopOpacity={0.3} />
                <stop offset="100%" stopColor="#6366f1" stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <XAxis dataKey="week" hide />
            <Tooltip
              content={<CustomTooltip />}
              cursor={false}
            />
            <Area
              type="monotone"
              dataKey="completed"
              stroke="#6366f1"
              strokeWidth={2}
              fill="url(#taskTrendGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
