import { Header } from "@/components/layout/header";
import { SecurityForm } from "@/components/security/security-form";
import { SecurityCard } from "@/components/security/security-card";
import { EmptyState } from "@/components/shared/empty-state";
import { getSecurityItems, getSecurityStats } from "@/actions/security";
import { Shield, AlertTriangle, AlertCircle, Clock } from "lucide-react";

export default async function SecurityPage() {
  const [items, stats] = await Promise.all([
    getSecurityItems(),
    getSecurityStats(),
  ]);

  return (
    <div>
      <Header
        title="Security & Compliance"
        description="Track incidents, vulnerabilities, audits, and compliance requirements."
      >
        <SecurityForm />
      </Header>

      {/* Stats Row */}
      <div className="mt-6 grid grid-cols-4 gap-3">
        <div className="rounded-xl border border-red-200/60 dark:border-red-500/20 bg-red-50/50 dark:bg-red-950/20 p-3">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-red-500" />
            <span className="text-[22px] font-bold text-red-600 dark:text-red-400">{stats.openCritical}</span>
          </div>
          <p className="mt-1 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">Critical Open</p>
        </div>
        <div className="rounded-xl border border-orange-200/60 dark:border-orange-500/20 bg-orange-50/50 dark:bg-orange-950/20 p-3">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-4 w-4 text-orange-500" />
            <span className="text-[22px] font-bold text-orange-600 dark:text-orange-400">{stats.openHigh}</span>
          </div>
          <p className="mt-1 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">High Open</p>
        </div>
        <div className="rounded-xl border p-3">
          <div className="flex items-center gap-2">
            <Shield className="h-4 w-4 text-muted-foreground" />
            <span className="text-[22px] font-bold">{stats.totalOpen}</span>
          </div>
          <p className="mt-1 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">Total Open</p>
        </div>
        <div className="rounded-xl border border-amber-200/60 dark:border-amber-500/20 bg-amber-50/50 dark:bg-amber-950/20 p-3">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-amber-500" />
            <span className="text-[22px] font-bold text-amber-600 dark:text-amber-400">{stats.overdue}</span>
          </div>
          <p className="mt-1 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">Overdue</p>
        </div>
      </div>

      <div className="mt-6">
        {items.length === 0 ? (
          <EmptyState
            icon={Shield}
            title="No security items"
            description="Start tracking security incidents, compliance requirements, and audit items."
          />
        ) : (
          <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
            {items.map((item) => (
              <SecurityCard key={item.id} item={item} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
