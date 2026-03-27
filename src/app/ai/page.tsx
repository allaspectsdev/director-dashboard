import { Suspense } from "react";
import { Header } from "@/components/layout/header";
import { AiForm } from "@/components/ai/ai-form";
import { AiCard } from "@/components/ai/ai-card";
import { AiFilters } from "@/components/ai/ai-filters";
import { EmptyState } from "@/components/shared/empty-state";
import { getAiInitiatives, getAiStats } from "@/actions/ai-initiatives";
import { getVendors } from "@/actions/vendors";
import { StatusChart as AiStatusChart } from "@/components/ai/status-chart";
import { Brain, Rocket, FlaskConical } from "lucide-react";
import { db } from "@/db";
import { aiInitiatives as aiTable } from "@/db/schema";
import { count as countFn } from "drizzle-orm";

interface Props {
  searchParams: Promise<{ category?: string; status?: string; search?: string }>;
}

export default async function AiPage({ searchParams }: Props) {
  const params = await searchParams;
  const [initiatives, stats, vendorList, aiStatusDist] = await Promise.all([
    getAiInitiatives({
      category: params.category || undefined,
      status: params.status || undefined,
      search: params.search || undefined,
    }),
    getAiStats(),
    getVendors(),
    db.select({ status: aiTable.status, count: countFn() }).from(aiTable).groupBy(aiTable.status),
  ]);

  return (
    <div>
      <Header
        title="AI Initiatives"
        description="Track AI projects, experiments, and deployed solutions across the organization."
      >
        <AiForm vendors={vendorList} />
      </Header>

      <div className="mt-6 grid grid-cols-3 gap-3">
        <div className="rounded-xl border border-emerald-200/60 dark:border-emerald-500/20 bg-emerald-50/50 dark:bg-emerald-950/20 p-3">
          <div className="flex items-center gap-2">
            <Rocket className="h-4 w-4 text-emerald-500" />
            <span className="text-[22px] font-bold text-emerald-600 dark:text-emerald-400">{stats.deployed}</span>
          </div>
          <p className="mt-1 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">Deployed</p>
        </div>
        <div className="rounded-xl border border-blue-200/60 dark:border-blue-500/20 bg-blue-50/50 dark:bg-blue-950/20 p-3">
          <div className="flex items-center gap-2">
            <FlaskConical className="h-4 w-4 text-blue-500" />
            <span className="text-[22px] font-bold text-blue-600 dark:text-blue-400">{stats.inDevelopment}</span>
          </div>
          <p className="mt-1 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">In Development</p>
        </div>
        <div className="rounded-xl border p-3">
          <div className="flex items-center gap-2">
            <Brain className="h-4 w-4 text-muted-foreground" />
            <span className="text-[22px] font-bold">{stats.total}</span>
          </div>
          <p className="mt-1 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">Total Initiatives</p>
        </div>
      </div>

      {aiStatusDist.length > 0 && (
        <div className="mt-6">
          <AiStatusChart data={aiStatusDist.map(d => ({ status: d.status, count: d.count }))} />
        </div>
      )}

      <div className="mt-6 space-y-5">
        <Suspense>
          <AiFilters />
        </Suspense>
        {initiatives.length === 0 ? (
          <EmptyState
            icon={Brain}
            title="No AI initiatives yet"
            description="Start tracking your AI projects, experiments, and deployed solutions."
          />
        ) : (
          <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
            {initiatives.map((initiative) => (
              <AiCard key={initiative.id} initiative={initiative} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
