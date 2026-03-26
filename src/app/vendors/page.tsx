import { Header } from "@/components/layout/header";
import { VendorForm } from "@/components/vendors/vendor-form";
import { VendorCard } from "@/components/vendors/vendor-card";
import { EmptyState } from "@/components/shared/empty-state";
import { getVendors, getVendorStats } from "@/actions/vendors";
import { Building2, DollarSign, CalendarClock } from "lucide-react";

function formatCurrency(cents: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(cents / 100);
}

export default async function VendorsPage() {
  const [vendorList, stats] = await Promise.all([
    getVendors(),
    getVendorStats(),
  ]);

  return (
    <div>
      <Header
        title="Vendors & Contracts"
        description="Track IT vendors, contracts, costs, and renewal dates."
      >
        <VendorForm />
      </Header>

      <div className="mt-6 grid grid-cols-3 gap-3">
        <div className="rounded-xl border p-3">
          <div className="flex items-center gap-2">
            <Building2 className="h-4 w-4 text-muted-foreground" />
            <span className="text-[22px] font-bold">{stats.activeCount}</span>
          </div>
          <p className="mt-1 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">Active Vendors</p>
        </div>
        <div className="rounded-xl border border-emerald-200/60 dark:border-emerald-500/20 bg-emerald-50/50 dark:bg-emerald-950/20 p-3">
          <div className="flex items-center gap-2">
            <DollarSign className="h-4 w-4 text-emerald-500" />
            <span className="text-[22px] font-bold text-emerald-600 dark:text-emerald-400">
              {stats.totalAnnualSpend > 0 ? formatCurrency(stats.totalAnnualSpend) : "$0"}
            </span>
          </div>
          <p className="mt-1 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">Annual Spend</p>
        </div>
        <div className="rounded-xl border border-amber-200/60 dark:border-amber-500/20 bg-amber-50/50 dark:bg-amber-950/20 p-3">
          <div className="flex items-center gap-2">
            <CalendarClock className="h-4 w-4 text-amber-500" />
            <span className="text-[22px] font-bold text-amber-600 dark:text-amber-400">{stats.upcomingRenewals.length}</span>
          </div>
          <p className="mt-1 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">Renewals (90d)</p>
        </div>
      </div>

      <div className="mt-6">
        {vendorList.length === 0 ? (
          <EmptyState
            icon={Building2}
            title="No vendors yet"
            description="Start tracking your IT vendors, contracts, and software subscriptions."
          />
        ) : (
          <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
            {vendorList.map((vendor) => (
              <VendorCard key={vendor.id} vendor={vendor} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
