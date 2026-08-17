import { requireAdmin } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Eye, Search, FileText } from "lucide-react";
import { RoleName } from "@prisma/client";

export default async function VisaApplicationsPage({
  searchParams,
}: {
  searchParams: { q?: string; status?: string; page?: string };
}) {
  await requireAdmin();
  
  const page = Number(searchParams.page) || 1;
  const limit = 20;
  const skip = (page - 1) * limit;

  const statusFilter = searchParams.status ? { status: searchParams.status as any } : {};
  const searchFilter = searchParams.q ? {
    OR: [
      { reference: { contains: searchParams.q, mode: "insensitive" as const } },
      { destination: { contains: searchParams.q, mode: "insensitive" as const } },
      { user: { email: { contains: searchParams.q, mode: "insensitive" as const } } },
      { user: { firstName: { contains: searchParams.q, mode: "insensitive" as const } } }
    ]
  } : {};

  let applications: any[] = [];
  let totalApplications = 0;

  try {
    const [fetchedApps, count] = await Promise.all([
      prisma.visaApplication.findMany({
        where: {
          ...statusFilter,
          ...searchFilter,
        },
        include: {
          user: true,
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.visaApplication.count({
        where: {
          ...statusFilter,
          ...searchFilter,
        },
      }),
    ]);
    applications = fetchedApps;
    totalApplications = count;
  } catch (error) {
    console.error("Database error fetching visa applications:", error);
  }

  const totalPages = Math.ceil(totalApplications / limit);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-[var(--color-brand-navy)] flex items-center gap-3">
            <FileText className="w-6 h-6" /> Visa Applications
          </h1>
          <p className="text-sm text-slate-500">Manage customer visa processing and documentation.</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        {/* Filters Bar */}
        <div className="p-4 border-b bg-slate-50 flex gap-4">
          <form className="flex-1 max-w-xl flex flex-col sm:flex-row gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                name="q"
                defaultValue={searchParams.q}
                placeholder="Search reference, destination, email..."
                className="w-full pl-9 pr-4 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-[var(--color-brand-green)] outline-none"
              />
            </div>
            <select
              name="status"
              defaultValue={searchParams.status || ""}
              className="px-3 py-2 border rounded-lg text-sm bg-white focus:ring-2 focus:ring-[var(--color-brand-green)] outline-none"
            >
              <option value="">All Statuses</option>
              <option value="DRAFT">Draft</option>
              <option value="DOCUMENTS_REQUIRED">Docs Required</option>
              <option value="SUBMITTED">Submitted</option>
              <option value="UNDER_REVIEW">Under Review</option>
              <option value="APPROVED">Approved</option>
              <option value="REJECTED">Rejected</option>
              <option value="COMPLETED">Completed</option>
            </select>
            <button type="submit" className="px-4 py-2 bg-[var(--color-brand-navy)] text-white rounded-lg text-sm font-medium hover:bg-opacity-90">
              Filter
            </button>
            {(searchParams.q || searchParams.status) && (
              <Link href="/admin/visa" className="px-4 py-2 bg-slate-200 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-300 whitespace-nowrap text-center">
                Clear
              </Link>
            )}
          </form>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 text-xs uppercase font-semibold text-slate-500 border-b">
              <tr>
                <th className="px-6 py-4">Reference</th>
                <th className="px-6 py-4">Customer</th>
                <th className="px-6 py-4">Destination</th>
                <th className="px-6 py-4">Type</th>
                <th className="px-6 py-4 text-center">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {applications.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-slate-500">
                    No visa applications found.
                  </td>
                </tr>
              ) : (
                applications.map((app) => (
                  <tr key={app.id} className="hover:bg-slate-50">
                    <td className="px-6 py-4 font-medium text-[var(--color-brand-navy)]">
                      {app.reference}
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-slate-900">
                        {app.user.firstName} {app.user.lastName}
                      </div>
                      <div className="text-xs text-slate-500">{app.user.email}</div>
                    </td>
                    <td className="px-6 py-4 font-medium text-slate-900">
                      {app.destination}
                    </td>
                    <td className="px-6 py-4">
                      {app.visaType}
                    </td>
                    <td className="px-6 py-4 text-center text-xs font-medium">
                      <span className={`inline-block px-2 py-1 rounded bg-slate-100 uppercase ${
                        app.status === 'APPROVED' || app.status === 'COMPLETED' ? 'bg-green-100 text-green-800' :
                        app.status === 'DOCUMENTS_REQUIRED' ? 'bg-amber-100 text-amber-800' :
                        app.status === 'REJECTED' ? 'bg-red-100 text-red-800' :
                        'text-blue-800 bg-blue-100'
                      }`}>
                        {app.status.replace(/_/g, ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link
                        href={`/admin/visa/${app.id}`}
                        className="inline-flex items-center justify-center p-2 text-slate-400 hover:text-[var(--color-brand-green)] hover:bg-slate-100 rounded-lg transition-colors"
                        title="View Application"
                      >
                        <Eye className="w-5 h-5" />
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-6 py-4 border-t flex justify-between items-center bg-slate-50">
            <span className="text-sm text-slate-500">
              Showing {skip + 1} to {Math.min(skip + limit, totalApplications)} of {totalApplications} applications
            </span>
            <div className="flex gap-2">
              {page > 1 && (
                <Link href={`/admin/visa?page=${page - 1}${searchParams.q ? `&q=${searchParams.q}` : ''}${searchParams.status ? `&status=${searchParams.status}` : ''}`} className="px-3 py-1 border rounded bg-white text-sm hover:bg-slate-50">
                  Previous
                </Link>
              )}
              {page < totalPages && (
                <Link href={`/admin/visa?page=${page + 1}${searchParams.q ? `&q=${searchParams.q}` : ''}${searchParams.status ? `&status=${searchParams.status}` : ''}`} className="px-3 py-1 border rounded bg-white text-sm hover:bg-slate-50">
                  Next
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
