import { requireAdmin } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Eye, Search, User } from "lucide-react";
import { RoleName } from "@prisma/client";

export default async function CustomersPage({
  searchParams,
}: {
  searchParams: { q?: string; page?: string };
}) {
  await requireAdmin();
  
  const page = Number(searchParams.page) || 1;
  const limit = 20;
  const skip = (page - 1) * limit;

  const searchFilter = searchParams.q ? {
    OR: [
      { email: { contains: searchParams.q, mode: "insensitive" as const } },
      { firstName: { contains: searchParams.q, mode: "insensitive" as const } },
      { lastName: { contains: searchParams.q, mode: "insensitive" as const } }
    ]
  } : {};

  let customers: any[] = [];
  let totalCustomers = 0;

  try {
    const [fetchedCustomers, count] = await Promise.all([
      prisma.user.findMany({
        where: {
          role: RoleName.CUSTOMER,
          ...searchFilter,
        },
        include: {
          _count: {
            select: { bookings: true }
          }
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.user.count({
        where: {
          role: RoleName.CUSTOMER,
          ...searchFilter,
        },
      }),
    ]);
    customers = fetchedCustomers;
    totalCustomers = count;
  } catch (error) {
    console.error("Database error fetching customers:", error);
  }

  const totalPages = Math.ceil(totalCustomers / limit);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-[var(--color-brand-navy)]">Customers</h1>
          <p className="text-sm text-slate-500">View and manage customer profiles.</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        {/* Filters Bar */}
        <div className="p-4 border-b bg-slate-50 flex gap-4">
          <form className="flex-1 max-w-md flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                name="q"
                defaultValue={searchParams.q}
                placeholder="Search customers by name or email..."
                className="w-full pl-9 pr-4 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-[var(--color-brand-green)] outline-none"
              />
            </div>
            <button type="submit" className="px-4 py-2 bg-[var(--color-brand-navy)] text-white rounded-lg text-sm font-medium hover:bg-opacity-90">
              Search
            </button>
            {searchParams.q && (
              <Link href="/admin/customers" className="px-4 py-2 bg-slate-200 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-300">
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
                <th className="px-6 py-4">Customer</th>
                <th className="px-6 py-4">Contact</th>
                <th className="px-6 py-4">Joined</th>
                <th className="px-6 py-4 text-center">Bookings</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {customers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-slate-500">
                    No customers found.
                  </td>
                </tr>
              ) : (
                customers.map((customer) => (
                  <tr key={customer.id} className="hover:bg-slate-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 font-bold">
                          {customer.firstName?.charAt(0) || 'C'}
                        </div>
                        <div>
                          <div className="font-medium text-slate-900">{customer.firstName} {customer.lastName}</div>
                          <div className="text-xs text-slate-500">{customer.id.substring(0, 8)}...</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm">{customer.email}</div>
                      <div className="text-xs text-slate-500">{customer.phone || 'No phone'}</div>
                    </td>
                    <td className="px-6 py-4 text-slate-500">
                      {new Date(customer.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-center font-medium">
                      <span className="px-2.5 py-1 bg-slate-100 rounded-full text-xs">
                        {customer._count?.bookings || 0}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link
                        href={`/admin/customers/${customer.id}`}
                        className="inline-flex items-center justify-center p-2 text-slate-400 hover:text-[var(--color-brand-green)] hover:bg-slate-100 rounded-lg transition-colors"
                        title="View Profile"
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
              Showing {skip + 1} to {Math.min(skip + limit, totalCustomers)} of {totalCustomers} customers
            </span>
            <div className="flex gap-2">
              {page > 1 && (
                <Link href={`/admin/customers?page=${page - 1}${searchParams.q ? `&q=${searchParams.q}` : ''}`} className="px-3 py-1 border rounded bg-white text-sm hover:bg-slate-50">
                  Previous
                </Link>
              )}
              {page < totalPages && (
                <Link href={`/admin/customers?page=${page + 1}${searchParams.q ? `&q=${searchParams.q}` : ''}`} className="px-3 py-1 border rounded bg-white text-sm hover:bg-slate-50">
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
