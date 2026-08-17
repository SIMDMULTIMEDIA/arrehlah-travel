import { requireAdmin, requireRole } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Eye, Search, CreditCard, Filter } from "lucide-react";
import { RoleName } from "@prisma/client";

export default async function PaymentsPage({
  searchParams,
}: {
  searchParams: { q?: string; status?: string; page?: string };
}) {
  const user = await requireRole([
    RoleName.SUPER_ADMIN,
    RoleName.ADMIN,
    RoleName.FINANCE
  ]);
  
  const page = Number(searchParams.page) || 1;
  const limit = 20;
  const skip = (page - 1) * limit;

  const statusFilter = searchParams.status ? { status: searchParams.status as any } : {};
  const searchFilter = searchParams.q ? {
    OR: [
      { reference: { contains: searchParams.q, mode: "insensitive" as const } },
      { user: { email: { contains: searchParams.q, mode: "insensitive" as const } } },
      { booking: { reference: { contains: searchParams.q, mode: "insensitive" as const } } }
    ]
  } : {};

  let payments: any[] = [];
  let totalPayments = 0;

  try {
    const [fetched, count] = await Promise.all([
      prisma.payment.findMany({
        where: {
          ...statusFilter,
          ...searchFilter,
        },
        include: {
          user: true,
          booking: true
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.payment.count({
        where: {
          ...statusFilter,
          ...searchFilter,
        },
      }),
    ]);
    payments = fetched;
    totalPayments = count;
  } catch (error) {
    console.error("Database error fetching payments:", error);
  }

  const totalPages = Math.ceil(totalPayments / limit);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-[var(--color-brand-navy)] flex items-center gap-3">
            <CreditCard className="w-6 h-6" /> Payments
          </h1>
          <p className="text-sm text-slate-500">View and manage all customer payments.</p>
        </div>
        <Link href="/admin/payments/pending" className="px-4 py-2 bg-[var(--color-brand-green)] text-white font-medium rounded-lg hover:bg-opacity-90">
          Review Pending Transfers
        </Link>
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
                placeholder="Search payment ref, booking ref, email..."
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
              <option value="PAID">Paid</option>
              <option value="FAILED">Failed</option>
              <option value="REFUNDED">Refunded</option>
            </select>
            <button type="submit" className="px-4 py-2 bg-[var(--color-brand-navy)] text-white rounded-lg text-sm font-medium hover:bg-opacity-90">
              Filter
            </button>
            {(searchParams.q || searchParams.status) && (
              <Link href="/admin/payments" className="px-4 py-2 bg-slate-200 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-300 whitespace-nowrap text-center">
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
                <th className="px-6 py-4">Booking</th>
                <th className="px-6 py-4">Amount</th>
                <th className="px-6 py-4">Method</th>
                <th className="px-6 py-4 text-center">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {payments.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-slate-500">
                    No payments found.
                  </td>
                </tr>
              ) : (
                payments.map((payment) => (
                  <tr key={payment.id} className="hover:bg-slate-50">
                    <td className="px-6 py-4">
                      <div className="font-medium text-slate-900">{payment.reference}</div>
                      <div className="text-xs text-slate-500">{new Date(payment.createdAt).toLocaleDateString()}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium">{payment.user?.firstName} {payment.user?.lastName}</div>
                      <div className="text-xs text-slate-500">{payment.user?.email}</div>
                    </td>
                    <td className="px-6 py-4">
                      {payment.booking ? (
                        <Link href={`/admin/bookings/${payment.booking.id}`} className="font-medium text-[var(--color-brand-navy)] hover:underline">
                          {payment.booking.reference}
                        </Link>
                      ) : (
                        <span className="text-slate-400">N/A</span>
                      )}
                    </td>
                    <td className="px-6 py-4 font-bold text-slate-900">
                      {payment.currency} {Number(payment.amount).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 font-medium">
                      {payment.provider}
                    </td>
                    <td className="px-6 py-4 text-center text-xs font-medium">
                      <span className={`inline-block px-2 py-1 rounded bg-slate-100 uppercase ${
                        payment.status === 'PAID' ? 'bg-green-100 text-green-800' :
                        payment.status === 'PENDING' ? 'bg-amber-100 text-amber-800' :
                        payment.status === 'FAILED' ? 'bg-red-100 text-red-800' :
                        'text-slate-800'
                      }`}>
                        {payment.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      {/* Action could be View Receipt or View Booking Details */}
                      {payment.booking && (
                        <Link
                          href={`/admin/bookings/${payment.booking.id}`}
                          className="inline-flex items-center justify-center p-2 text-slate-400 hover:text-[var(--color-brand-green)] hover:bg-slate-100 rounded-lg transition-colors"
                          title="View Booking"
                        >
                          <Eye className="w-5 h-5" />
                        </Link>
                      )}
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
              Showing {skip + 1} to {Math.min(skip + limit, totalPayments)} of {totalPayments} payments
            </span>
            <div className="flex gap-2">
              {page > 1 && (
                <Link href={`/admin/payments?page=${page - 1}${searchParams.q ? `&q=${searchParams.q}` : ''}${searchParams.status ? `&status=${searchParams.status}` : ''}`} className="px-3 py-1 border rounded bg-white text-sm hover:bg-slate-50">
                  Previous
                </Link>
              )}
              {page < totalPages && (
                <Link href={`/admin/payments?page=${page + 1}${searchParams.q ? `&q=${searchParams.q}` : ''}${searchParams.status ? `&status=${searchParams.status}` : ''}`} className="px-3 py-1 border rounded bg-white text-sm hover:bg-slate-50">
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
