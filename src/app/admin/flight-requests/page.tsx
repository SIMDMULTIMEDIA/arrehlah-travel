import { requireAdmin } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Eye, Search, Plane } from "lucide-react";
import { RoleName } from "@prisma/client";

export default async function FlightRequestsPage({
  searchParams,
}: {
  searchParams: { q?: string; status?: string; page?: string };
}) {
  await requireAdmin();
  
  const page = Number(searchParams.page) || 1;
  const limit = 20;
  const skip = (page - 1) * limit;

  const statusFilter = searchParams.status ? { status: searchParams.status } : {};
  // q could search pnr, airline, or flightNumber
  const searchFilter = searchParams.q ? {
    OR: [
      { pnr: { contains: searchParams.q, mode: "insensitive" as const } },
      { airline: { contains: searchParams.q, mode: "insensitive" as const } },
      { bookingItem: { booking: { reference: { contains: searchParams.q, mode: "insensitive" as const } } } },
      { bookingItem: { booking: { user: { email: { contains: searchParams.q, mode: "insensitive" as const } } } } }
    ]
  } : {};

  let flightRequests: any[] = [];
  let totalRequests = 0;

  try {
    const [fetchedRequests, count] = await Promise.all([
      prisma.flightBooking.findMany({
        where: {
          ...statusFilter,
          ...searchFilter,
        },
        include: {
          bookingItem: {
            include: {
              booking: {
                include: { user: true }
              }
            }
          }
        },
        orderBy: { bookingItem: { booking: { createdAt: "desc" } } },
        skip,
        take: limit,
      }),
      prisma.flightBooking.count({
        where: {
          ...statusFilter,
          ...searchFilter,
        },
      }),
    ]);
    flightRequests = fetchedRequests;
    totalRequests = count;
  } catch (error) {
    console.error("Database error fetching flight requests:", error);
  }

  const totalPages = Math.ceil(totalRequests / limit);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-[var(--color-brand-navy)] flex items-center gap-3">
            <Plane className="w-6 h-6" /> Flight Requests
          </h1>
          <p className="text-sm text-slate-500">Manage customer flight booking requests and quotes.</p>
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
                placeholder="Search reference, PNR, email..."
                className="w-full pl-9 pr-4 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-[var(--color-brand-green)] outline-none"
              />
            </div>
            <select
              name="status"
              defaultValue={searchParams.status || ""}
              className="px-3 py-2 border rounded-lg text-sm bg-white focus:ring-2 focus:ring-[var(--color-brand-green)] outline-none"
            >
              <option value="">All Statuses</option>
              <option value="NEW">New</option>
              <option value="CONTACTED">Contacted</option>
              <option value="QUOTE_SENT">Quote Sent</option>
              <option value="CUSTOMER_APPROVAL">Customer Approval</option>
              <option value="PAYMENT_PENDING">Payment Pending</option>
              <option value="BOOKED">Booked (Confirmed)</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
            <button type="submit" className="px-4 py-2 bg-[var(--color-brand-navy)] text-white rounded-lg text-sm font-medium hover:bg-opacity-90">
              Filter
            </button>
            {(searchParams.q || searchParams.status) && (
              <Link href="/admin/flight-requests" className="px-4 py-2 bg-slate-200 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-300 whitespace-nowrap text-center">
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
                <th className="px-6 py-4">Ref / PNR</th>
                <th className="px-6 py-4">Customer</th>
                <th className="px-6 py-4">Route</th>
                <th className="px-6 py-4">Dates</th>
                <th className="px-6 py-4 text-center">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {flightRequests.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-slate-500">
                    No flight requests found.
                  </td>
                </tr>
              ) : (
                flightRequests.map((req) => (
                  <tr key={req.id} className="hover:bg-slate-50">
                    <td className="px-6 py-4">
                      <div className="font-medium text-[var(--color-brand-navy)]">
                        {req.bookingItem.booking.reference}
                      </div>
                      {req.pnr && (
                        <div className="text-xs text-slate-500 mt-1 font-mono">{req.pnr}</div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-slate-900">
                        {req.bookingItem.booking.user.firstName} {req.bookingItem.booking.user.lastName}
                      </div>
                      <div className="text-xs text-slate-500">{req.bookingItem.booking.user.email}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium">{req.departureAirport} → {req.arrivalAirport}</div>
                      <div className="text-xs text-slate-500">{req.airline} ({req.cabinClass})</div>
                    </td>
                    <td className="px-6 py-4 text-xs">
                      <div>Dep: {new Date(req.departureDate).toLocaleDateString()}</div>
                      {req.returnDate && <div>Ret: {new Date(req.returnDate).toLocaleDateString()}</div>}
                    </td>
                    <td className="px-6 py-4 text-center font-medium text-xs">
                      <span className={`inline-block px-2 py-1 rounded bg-slate-100 uppercase ${
                        req.status === 'NEW' ? 'bg-blue-100 text-blue-800' :
                        req.status === 'BOOKED' ? 'bg-green-100 text-green-800' :
                        req.status === 'CANCELLED' ? 'bg-red-100 text-red-800' :
                        'text-slate-800'
                      }`}>
                        {req.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link
                        href={`/admin/flight-requests/${req.id}`}
                        className="inline-flex items-center justify-center p-2 text-slate-400 hover:text-[var(--color-brand-green)] hover:bg-slate-100 rounded-lg transition-colors"
                        title="View Request"
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
              Showing {skip + 1} to {Math.min(skip + limit, totalRequests)} of {totalRequests} requests
            </span>
            <div className="flex gap-2">
              {page > 1 && (
                <Link href={`/admin/flight-requests?page=${page - 1}${searchParams.q ? `&q=${searchParams.q}` : ''}${searchParams.status ? `&status=${searchParams.status}` : ''}`} className="px-3 py-1 border rounded bg-white text-sm hover:bg-slate-50">
                  Previous
                </Link>
              )}
              {page < totalPages && (
                <Link href={`/admin/flight-requests?page=${page + 1}${searchParams.q ? `&q=${searchParams.q}` : ''}${searchParams.status ? `&status=${searchParams.status}` : ''}`} className="px-3 py-1 border rounded bg-white text-sm hover:bg-slate-50">
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
