import { requireAdmin, requireRole } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Eye, Search, Filter } from "lucide-react";
import { RoleName } from "@prisma/client";

export default async function BookingsPage({
  searchParams,
}: {
  searchParams: { q?: string; status?: string; page?: string };
}) {
  const user = await requireAdmin();
  
  const page = Number(searchParams.page) || 1;
  const limit = 20;
  const skip = (page - 1) * limit;

  const statusFilter = searchParams.status ? { status: searchParams.status } : {};
  const searchFilter = searchParams.q ? {
    OR: [
      { reference: { contains: searchParams.q, mode: "insensitive" as const } },
      { user: { email: { contains: searchParams.q, mode: "insensitive" as const } } },
      { user: { firstName: { contains: searchParams.q, mode: "insensitive" as const } } },
      { user: { lastName: { contains: searchParams.q, mode: "insensitive" as const } } }
    ]
  } : {};

  // If DB is offline, we handle it gracefully
  let bookings: any[] = [];
  let totalBookings = 0;

  try {
    const [fetchedBookings, count] = await Promise.all([
      prisma.booking.findMany({
        where: {
          ...statusFilter,
          ...searchFilter,
        },
        include: {
          user: true,
          payments: true,
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.booking.count({
        where: {
          ...statusFilter,
          ...searchFilter,
        },
      }),
    ]);
    bookings = fetchedBookings;
    totalBookings = count;
  } catch (error) {
    console.error("Database error fetching bookings:", error);
  }

  const totalPages = Math.ceil(totalBookings / limit);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[var(--color-brand-navy)]">Bookings</h1>
          <p className="text-sm text-slate-500">Manage all customer bookings across services.</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        {/* Filters Bar */}
        <div className="p-4 border-b bg-slate-50 flex flex-col sm:flex-row gap-4 justify-between">
          <form className="flex-1 max-w-md flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                name="q"
                defaultValue={searchParams.q}
                placeholder="Search reference or customer..."
                className="w-full pl-9 pr-4 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-[var(--color-brand-green)] outline-none"
              />
            </div>
            <select
              name="status"
              defaultValue={searchParams.status || ""}
              className="px-3 py-2 border rounded-lg text-sm bg-white focus:ring-2 focus:ring-[var(--color-brand-green)] outline-none"
            >
              <option value="">All Statuses</option>
              <option value="PENDING">Pending</option>
              <option value="CONFIRMED">Confirmed</option>
              <option value="CANCELLED">Cancelled</option>
              <option value="COMPLETED">Completed</option>
            </select>
            <button type="submit" className="px-4 py-2 bg-[var(--color-brand-navy)] text-white rounded-lg text-sm font-medium hover:bg-opacity-90">
              Filter
            </button>
            {(searchParams.q || searchParams.status) && (
              <Link href="/admin/bookings" className="px-4 py-2 bg-slate-200 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-300">
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
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Total</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {bookings.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-slate-500">
                    No bookings found matching your criteria.
                  </td>
                </tr>
              ) : (
                bookings.map((booking) => (
                  <tr key={booking.id} className="hover:bg-slate-50">
                    <td className="px-6 py-4 font-medium text-[var(--color-brand-navy)]">
                      {booking.reference}
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <div className="font-medium text-slate-900">{booking.user?.firstName} {booking.user?.lastName}</div>
                        <div className="text-xs text-slate-500">{booking.user?.email}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {new Date(booking.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 font-medium">
                      {booking.currency} {Number(booking.totalAmount).toLocaleString()}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                        ${booking.status === 'CONFIRMED' ? 'bg-green-100 text-green-800' : 
                          booking.status === 'PENDING' ? 'bg-amber-100 text-amber-800' :
                          booking.status === 'CANCELLED' ? 'bg-red-100 text-red-800' :
                          'bg-slate-100 text-slate-800'}
                      `}>
                        {booking.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link
                        href={`/admin/bookings/${booking.id}`}
                        className="inline-flex items-center justify-center p-2 text-slate-400 hover:text-[var(--color-brand-green)] hover:bg-slate-100 rounded-lg transition-colors"
                        title="View Details"
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
              Showing {skip + 1} to {Math.min(skip + limit, totalBookings)} of {totalBookings} entries
            </span>
            <div className="flex gap-2">
              {page > 1 && (
                <Link href={`/admin/bookings?page=${page - 1}${searchParams.q ? `&q=${searchParams.q}` : ''}${searchParams.status ? `&status=${searchParams.status}` : ''}`} className="px-3 py-1 border rounded bg-white text-sm hover:bg-slate-50">
                  Previous
                </Link>
              )}
              {page < totalPages && (
                <Link href={`/admin/bookings?page=${page + 1}${searchParams.q ? `&q=${searchParams.q}` : ''}${searchParams.status ? `&status=${searchParams.status}` : ''}`} className="px-3 py-1 border rounded bg-white text-sm hover:bg-slate-50">
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
