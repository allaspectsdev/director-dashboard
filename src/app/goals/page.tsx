import { Suspense } from "react";
import { Header } from "@/components/layout/header";
import { GoalForm } from "@/components/goals/goal-form";
import { GoalCard } from "@/components/goals/goal-card";
import { GoalFilters } from "@/components/goals/goal-filters";
import { getGoals } from "@/actions/goals";
import { getProjects } from "@/actions/projects";
import { EmptyState } from "@/components/shared/empty-state";
import { Target } from "lucide-react";
import type { GoalStatus } from "@/types";

interface Props {
  searchParams: Promise<{ status?: string; search?: string }>;
}

export default async function GoalsPage({ searchParams }: Props) {
  const params = await searchParams;
  const [goals, allProjects] = await Promise.all([
    getGoals({
      status: params.status as GoalStatus | undefined,
      search: params.search || undefined,
    }),
    getProjects(),
  ]);

  return (
    <div>
      <Header
        title="Goals"
        description="Strategic goals and progress tracking."
      >
        <GoalForm projects={allProjects} />
      </Header>

      <div className="mt-6 space-y-5">
        <Suspense>
          <GoalFilters />
        </Suspense>
        {goals.length === 0 ? (
          <EmptyState
            icon={Target}
            title="No goals yet"
            description="Set strategic goals to track your progress as Director of Technology."
          />
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {goals.map((goal) => (
              <GoalCard
                key={goal.id}
                goal={goal}
                allProjects={allProjects}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
