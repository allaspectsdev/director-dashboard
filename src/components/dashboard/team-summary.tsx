import Link from "next/link";
import { Users, ChevronRight } from "lucide-react";

interface TeamSummaryProps {
  activeCount: number;
  byDepartment: { department: string; count: number }[];
}

const DEPT_LABELS: Record<string, string> = {
  it: "IT",
  security: "Security",
  ai: "AI",
  engineering: "Engineering",
  other: "Other",
};

const DEPT_DOT_COLORS: Record<string, string> = {
  it: "bg-blue-500",
  security: "bg-red-500",
  ai: "bg-violet-500",
  engineering: "bg-cyan-500",
  other: "bg-gray-400",
};

export function TeamSummary({ activeCount, byDepartment }: TeamSummaryProps) {
  return (
    <div className="widget-section">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold flex items-center gap-2">
          <Users className="h-4 w-4 text-primary" />
          Team
        </h3>
        <Link
          href="/team"
          className="text-[11px] text-muted-foreground hover:text-foreground transition-colors flex items-center gap-0.5"
        >
          View all <ChevronRight className="h-3 w-3" />
        </Link>
      </div>

      <div className="text-center py-2 mb-2">
        <span className="text-[28px] font-bold">{activeCount}</span>
        <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground mt-0.5">
          Direct Reports
        </p>
      </div>

      {byDepartment.length > 0 && (
        <div className="space-y-1.5">
          {byDepartment.map((dept) => (
            <div key={dept.department} className="flex items-center gap-2 px-2">
              <span className={`h-2 w-2 rounded-full ${DEPT_DOT_COLORS[dept.department] || "bg-gray-400"}`} />
              <span className="text-[12px] flex-1">{DEPT_LABELS[dept.department] || dept.department}</span>
              <span className="text-[12px] font-semibold">{dept.count}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
