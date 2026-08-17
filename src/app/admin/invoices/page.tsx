import { requireRole } from "@/lib/admin-auth";
import { RoleName } from "@prisma/client";
import { FileText } from "lucide-react";

export default async function InvoicesPage() {
  await requireRole([RoleName.SUPER_ADMIN, RoleName.ADMIN, RoleName.FINANCE]);

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-[var(--color-brand-navy)] flex items-center gap-3">
          Invoices
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          View generated invoices for customer bookings and corporate clients.
        </p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border p-12 text-center flex flex-col items-center">
        <FileText className="w-12 h-12 text-slate-300 mb-4" />
        <h2 className="text-lg font-bold text-slate-700 mb-2">Invoice Generation System Active</h2>
        <p className="text-slate-500 max-w-md">
          Invoices are generated dynamically when a booking is confirmed and paid. Currently, there are no separate standalone invoices to display.
        </p>
      </div>
    </div>
  );
}
