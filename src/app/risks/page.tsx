import { Suspense } from "react";
import { Header } from "@/components/layout/header";
import { RiskForm } from "@/components/risks/risk-form";
import { RiskCard } from "@/components/risks/risk-card";
import { RiskFilters } from "@/components/risks/risk-filters";
import { EmptyState } from "@/components/shared/empty-state";
import { getRisks, getRiskStats } from "@/actions/risks";
import { ShieldAlert, AlertTriangle, AlertCircle, Info } from "lucide-react";

interface Props {
  searchParams: Promise<{ category?: string; status?: string; search?: string }>;
}

export default async function RisksPage({ searchParams }: Props) {
  const params = await searchParams;
  const [riskList, stats] = await Promise.all([
    getRisks({
      category: params.category || undefined,
      status: params.status || undefined,
      search: params.search || undefined,
    }),
    getRiskStats(),
  ]);

  return (
    <div>
      <Header
        title="Risk Register"
        description="Identify, assess, and track organizational risks with likelihood and impact scoring."
      >
        <RiskForm />
      </Header>

      {/* Risk Matrix Summary */}
      <div className="mt-6 grid grid-cols-5 gap-3">
        <div className="rounded-xl border border-red-200/60 dark:border-red-500/20 bg-red-50/50 dark:bg-red-950/20 p-3">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-red-500" />
            <span className="text-[22px] font-bold text-red-600 dark:text-red-400">{stats.critical}</span>
          </div>
          <p className="mt-1 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">Critical</p>
        </div>
        <div className="rounded-xl border border-orange-200/60 dark:border-orange-500/20 bg-orange-50/50 dark:bg-orange-950/20 p-3">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-4 w-4 text-orange-500" />
            <span className="text-[22px] font-bold text-orange-600 dark:text-orange-400">{stats.high}</span>
          </div>
          <p className="mt-1 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">High</p>
        </div>
        <div className="rounded-xl border border-amber-200/60 dark:border-amber-500/20 bg-amber-50/50 dark:bg-amber-950/20 p-3">
          <span className="text-[22px] font-bold text-amber-600 dark:text-amber-400">{stats.medium}</span>
          <p className="mt-1 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">Medium</p>
        </div>
        <div className="rounded-xl border border-blue-200/60 dark:border-blue-500/20 bg-blue-50/50 dark:bg-blue-950/20 p-3">
          <span className="text-[22px] font-bold text-blue-600 dark:text-blue-400">{stats.low}</span>
          <p className="mt-1 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">Low</p>
        </div>
        <div className="rounded-xl border p-3">
          <div className="flex items-center gap-2">
            <ShieldAlert className="h-4 w-4 text-muted-foreground" />
            <span className="text-[22px] font-bold">{stats.total}</span>
          </div>
          <p className="mt-1 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">Total Open</p>
        </div>
      </div>

      {/* 5x5 Risk Heat Map */}
      <div className="mt-6 rounded-xl border bg-card p-5">
        <h3 className="text-sm font-semibold mb-3">Risk Heat Map</h3>
        <div className="grid grid-cols-6 gap-1 text-[10px]">
          {/* Header row */}
          <div />
          {["1", "2", "3", "4", "5"].map((i) => (
            <div key={`ih-${i}`} className="text-center text-muted-foreground font-medium py-1">Impact {i}</div>
          ))}

          {/* Grid rows (likelihood 5 to 1) */}
          {[5, 4, 3, 2, 1].map((likelihood) => (
            <>
              <div key={`lh-${likelihood}`} className="flex items-center text-muted-foreground font-medium">L {likelihood}</div>
              {[1, 2, 3, 4, 5].map((impact) => {
                const score = likelihood * impact;
                const risksInCell = riskList.filter(
                  (r) => r.likelihood === likelihood && r.impact === impact && r.status !== "closed"
                );
                let bg = "bg-blue-100 dark:bg-blue-950/30";
                if (score >= 20) bg = "bg-red-200 dark:bg-red-950/50";
                else if (score >= 12) bg = "bg-orange-200 dark:bg-orange-950/50";
                else if (score >= 6) bg = "bg-amber-100 dark:bg-amber-950/30";

                return (
                  <div
                    key={`${likelihood}-${impact}`}
                    className={`flex items-center justify-center rounded-md ${bg} h-10 font-semibold tabular-nums ${
                      risksInCell.length > 0 ? "text-foreground" : "text-muted-foreground/30"
                    }`}
                    title={risksInCell.map((r) => r.title).join(", ") || `Score: ${score}`}
                  >
                    {risksInCell.length > 0 ? risksInCell.length : ""}
                  </div>
                );
              })}
            </>
          ))}
        </div>
      </div>

      <div className="mt-6 space-y-5">
        <Suspense>
          <RiskFilters />
        </Suspense>
        {riskList.length === 0 ? (
          <EmptyState
            icon={ShieldAlert}
            title="No risks registered"
            description="Start documenting organizational risks with likelihood and impact scoring."
          />
        ) : (
          <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
            {riskList.map((risk) => (
              <RiskCard key={risk.id} risk={risk} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
