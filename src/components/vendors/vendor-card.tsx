"use client";

import { useState } from "react";
import { deleteVendor } from "@/actions/vendors";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MoreHorizontal, Pencil, Trash2, Building2, DollarSign } from "lucide-react";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { VENDOR_STATUS_COLORS } from "@/lib/constants";
import { formatDateShort } from "@/lib/dates";
import type { Vendor } from "@/types";
import { VendorForm } from "./vendor-form";

function formatCurrency(cents: number | null): string {
  if (!cents) return "";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(cents / 100);
}

interface VendorCardProps {
  vendor: Vendor;
}

export function VendorCard({ vendor }: VendorCardProps) {
  const [editOpen, setEditOpen] = useState(false);

  return (
    <>
      <div className="group rounded-xl border bg-card p-4 transition-all duration-200 hover:shadow-md hover:-translate-y-0.5">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
              <Building2 className="h-4 w-4 text-primary" />
            </div>
            <div>
              <h3 className="text-sm font-semibold">{vendor.name}</h3>
              <div className="mt-1 flex items-center gap-1.5">
                <Badge variant="secondary" className={cn("border-0 text-[10px] font-semibold capitalize px-2 py-0", VENDOR_STATUS_COLORS[vendor.status])}>
                  {vendor.status}
                </Badge>
                <Badge variant="secondary" className="border-0 text-[10px] font-semibold capitalize px-2 py-0 bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400">
                  {vendor.category.replace(/-/g, " ")}
                </Badge>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1">
            {vendor.annualCost && (
              <span className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">
                {formatCurrency(vendor.annualCost)}/yr
              </span>
            )}
            <DropdownMenu>
              <DropdownMenuTrigger render={<Button variant="ghost" size="icon" className="h-7 w-7 opacity-0 group-hover:opacity-100" />}>
                <MoreHorizontal className="h-4 w-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setEditOpen(true)}>
                  <Pencil className="mr-2 h-4 w-4" />Edit
                </DropdownMenuItem>
                <DropdownMenuItem variant="destructive" onClick={() => { deleteVendor(vendor.id); toast.success("Deleted"); }}>
                  <Trash2 className="mr-2 h-4 w-4" />Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {vendor.description && (
          <p className="mt-2 text-xs text-muted-foreground">{vendor.description}</p>
        )}

        <div className="mt-3 flex flex-wrap items-center gap-3 text-[11px] text-muted-foreground">
          {vendor.contactName && <span>{vendor.contactName}</span>}
          {vendor.contractEnd && <span>Renews: {formatDateShort(vendor.contractEnd)}</span>}
          {vendor.monthlyCost && (
            <span className="flex items-center gap-0.5">
              <DollarSign className="h-2.5 w-2.5" />
              {formatCurrency(vendor.monthlyCost)}/mo
            </span>
          )}
        </div>
      </div>

      <VendorForm vendor={vendor} open={editOpen} onOpenChange={setEditOpen} />
    </>
  );
}
