import { requireRole } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";
import { ShieldAlert, Search } from "lucide-react";
import { RoleName } from "@prisma/client";

export default async function AuditLogsPage({
  searchParams,
}: {
  searchParams: { q?: string; page?: string };
}) {
  // Only SUPER_ADMIN can view audit logs for security
  await requireRole([RoleName.SUPER_ADMIN]);

  const page = Number(searchParams.page) || 1;
  const limit = 50; // High limit for logs
  const skip = (page - 1) * limit;

  const searchFilter = searchParams.q ? {
    OR: [
      { action: { contains: searchParams.q, mode: "insensitive" as const } },
      { entityType: { contains: searchParams.q, mode: "insensitive" as const } },
      { user: { email: { contains: searchParams.q, mode: "insensitive" as const } } }
    ]
  } : {};

  let logs: any[] = [];
  let totalLogs = 0;

  try {
    const [fetched, count] = await Promise.all([
      prisma.auditLog.findMany({
        where: searchFilter,
        include: { user: true },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.auditLog.count({ where: searchFilter }),
    ]);
    logs = fetched;
    totalLogs = count;
  } catch (error) {
    console.error("Database error fetching audit logs:", error);
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-[var(--color-brand-navy)] flex items-center gap-3">
            <ShieldAlert className="w-6 h-6" /> System Audit Logs
          </h1>
          <p className="text-sm text-slate-500">Immutable record of all administrative actions and mutations.</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        {/* Filters */}
        <div className="p-4 border-b bg-slate-50">
          <form className="max-w-xl flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                name="q"
                defaultValue={searchParams.q}
                placeholder="Search action, entity, user email..."
                className="w-full pl-9 pr-4 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-[var(--color-brand-green)] outline-none"
              />
            </div>
            <button type="submit" className="px-4 py-2 bg-[var(--color-brand-navy)] text-white rounded-lg text-sm font-medium hover:bg-opacity-90">
              Search
            </button>
          </form>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 text-xs uppercase font-semibold text-slate-500 border-b">
              <tr>
                <th className="px-6 py-4">Timestamp</th>
                <th className="px-6 py-4">Actor</th>
                <th className="px-6 py-4">Action</th>
                <th className="px-6 py-4">Entity</th>
                <th className="px-6 py-4">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y font-mono text-xs">
              {logs.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-slate-500 font-sans">
                    No audit logs found.
                  </td>
                </tr>
              ) : (
                logs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50">
                    <td className="px-6 py-4 text-slate-500">
                      {new Date(log.createdAt).toLocaleString()}
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-semibold text-slate-800">{log.user?.email || "SYSTEM"}</div>
                      <div className="text-[10px] text-slate-400">{log.userId}</div>
                    </td>
                    <td className="px-6 py-4 font-bold text-slate-700">
                      {log.action}
                    </td>
                    <td className="px-6 py-4 text-blue-600">
                      {log.entityType}
                    </td>
                    <td className="px-6 py-4">
                      <div className="max-w-xs truncate" title={JSON.stringify(log.metadata)}>
                        {JSON.stringify(log.metadata)}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
