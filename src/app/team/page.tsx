import { Suspense } from "react";
import { Header } from "@/components/layout/header";
import { TeamMemberForm } from "@/components/team/team-member-form";
import { TeamMemberCard } from "@/components/team/team-member-card";
import { TeamFilters } from "@/components/team/team-filters";
import { EmptyState } from "@/components/shared/empty-state";
import { getTeamMembers, getTeamStats } from "@/actions/team";
import { Users } from "lucide-react";
import { db } from "@/db";
import { oneOnOnes } from "@/db/schema";
import { eq, desc, count } from "drizzle-orm";
import { formatDateShort } from "@/lib/dates";

interface Props {
  searchParams: Promise<{ department?: string; status?: string; search?: string }>;
}

export default async function TeamPage({ searchParams }: Props) {
  const params = await searchParams;
  const [members, stats] = await Promise.all([
    getTeamMembers({
      department: params.department || undefined,
      status: params.status || undefined,
      search: params.search || undefined,
    }),
    getTeamStats(),
  ]);

  // Get meeting stats for each member
  const membersWithStats = await Promise.all(
    members.map(async (member) => {
      const [meetingStats] = await db
        .select({ count: count() })
        .from(oneOnOnes)
        .where(eq(oneOnOnes.teamMemberId, member.id));

      const [lastMeeting] = await db
        .select({ meetingDate: oneOnOnes.meetingDate })
        .from(oneOnOnes)
        .where(eq(oneOnOnes.teamMemberId, member.id))
        .orderBy(desc(oneOnOnes.meetingDate))
        .limit(1);

      return {
        member,
        meetingCount: meetingStats?.count ?? 0,
        lastMeeting: lastMeeting ? formatDateShort(lastMeeting.meetingDate) : null,
      };
    })
  );

  return (
    <div>
      <Header
        title="Team"
        description="Manage your direct reports, track 1:1s, and team health."
      >
        <TeamMemberForm />
      </Header>

      <div className="mt-6 grid grid-cols-3 gap-3">
        <div className="rounded-xl border p-3">
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-muted-foreground" />
            <span className="text-[22px] font-bold">{stats.activeCount}</span>
          </div>
          <p className="mt-1 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">Active Members</p>
        </div>
        {stats.byDepartment.map((dept) => (
          <div key={dept.department} className="rounded-xl border p-3">
            <span className="text-[22px] font-bold">{dept.count}</span>
            <p className="mt-1 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
              {dept.department === "ai" ? "AI" : dept.department === "it" ? "IT" : dept.department}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-6 space-y-5">
        <Suspense>
          <TeamFilters />
        </Suspense>
        {members.length === 0 ? (
          <EmptyState
            icon={Users}
            title="No team members yet"
            description="Add your direct reports to start tracking 1:1s and team management."
          />
        ) : (
          <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
            {membersWithStats.map(({ member, meetingCount, lastMeeting }) => (
              <TeamMemberCard
                key={member.id}
                member={member}
                meetingCount={meetingCount}
                lastMeeting={lastMeeting}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
