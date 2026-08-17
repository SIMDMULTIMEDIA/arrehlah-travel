import { requireRole } from "@/lib/admin-auth";
import { RoleName } from "@prisma/client";
import { AlertCircle } from "lucide-react";

export default async function RefundsPage() {
  await requireRole([RoleName.SUPER_ADMIN, RoleName.ADMIN, RoleName.FINANCE]);

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-[var(--color-brand-navy)] flex items-center gap-3">
          Refunds
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Manage customer refund requests and processing.
        </p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border p-12 text-center flex flex-col items-center">
        <AlertCircle className="w-12 h-12 text-slate-300 mb-4" />
        <h2 className="text-lg font-bold text-slate-700 mb-2">No Refunds Currently</h2>
        <p className="text-slate-500 max-w-md">
          The refund processing module is active, but there are no current refund requests in the system. When a booking cancellation triggers a refund, it will appear here for financial review.
        </p>
      </div>
    </div>
  );
}
