import Link from "next/link";
import { Building2, CalendarClock, ChevronRight } from "lucide-react";
import { formatDateShort } from "@/lib/dates";
import type { Vendor } from "@/types";

interface VendorSummaryProps {
  upcomingRenewals: Vendor[];
  activeCount: number;
  totalAnnualSpend: number;
}

function formatCurrency(cents: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(cents / 100);
}

export function VendorSummary({ upcomingRenewals, activeCount, totalAnnualSpend }: VendorSummaryProps) {
  return (
    <div className="widget-section">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold flex items-center gap-2">
          <Building2 className="h-4 w-4 text-primary" />
          Vendors
        </h3>
        <Link
          href="/vendors"
          className="text-[11px] text-muted-foreground hover:text-foreground transition-colors flex items-center gap-0.5"
        >
          View all <ChevronRight className="h-3 w-3" />
        </Link>
      </div>

      <div className="flex gap-4 mb-3 text-[11px]">
        <div>
          <span className="font-semibold">{activeCount}</span>
          <span className="text-muted-foreground ml-1">active</span>
        </div>
        {totalAnnualSpend > 0 && (
          <div>
            <span className="font-semibold text-emerald-600 dark:text-emerald-400">{formatCurrency(totalAnnualSpend)}</span>
            <span className="text-muted-foreground ml-1">/yr</span>
          </div>
        )}
      </div>

      {upcomingRenewals.length === 0 ? (
        <p className="text-sm text-muted-foreground/50 text-center py-4">
          No upcoming renewals in the next 90 days.
        </p>
      ) : (
        <>
          <p className="text-[10px] font-medium uppercase tracking-wider text-amber-600 dark:text-amber-400 mb-2 flex items-center gap-1">
            <CalendarClock className="h-3 w-3" />
            Upcoming Renewals
          </p>
          <div className="space-y-2">
            {upcomingRenewals.map((vendor) => (
              <div key={vendor.id} className="flex items-center justify-between rounded-lg px-2 py-1.5 hover:bg-accent/30 transition-colors">
                <span className="text-[12px] font-medium truncate">{vendor.name}</span>
                <div className="flex items-center gap-2 shrink-0 text-[11px]">
                  {vendor.annualCost && (
                    <span className="text-muted-foreground">{formatCurrency(vendor.annualCost)}</span>
                  )}
                  <span className="text-amber-600 dark:text-amber-400 font-medium">
                    {formatDateShort(vendor.contractEnd)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
