import { Header } from "@/components/layout/header";
import { GoalForm } from "@/components/goals/goal-form";
import { GoalCard } from "@/components/goals/goal-card";
import { getGoals } from "@/actions/goals";
import { getProjects } from "@/actions/projects";
import { EmptyState } from "@/components/shared/empty-state";
import { Target } from "lucide-react";

export default async function GoalsPage() {
  const [goals, allProjects] = await Promise.all([
    getGoals(),
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

      <div className="mt-6">
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
