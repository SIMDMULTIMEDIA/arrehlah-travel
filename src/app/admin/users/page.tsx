import { requireRole } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";
import { Users, Search, Edit } from "lucide-react";
import { RoleName } from "@prisma/client";

export default async function UsersPage({
  searchParams,
}: {
  searchParams: { q?: string; page?: string };
}) {
  await requireRole([RoleName.SUPER_ADMIN, RoleName.ADMIN]);

  const page = Number(searchParams.page) || 1;
  const limit = 20;
  const skip = (page - 1) * limit;

  const searchFilter = searchParams.q ? {
    OR: [
      { firstName: { contains: searchParams.q, mode: "insensitive" as const } },
      { lastName: { contains: searchParams.q, mode: "insensitive" as const } },
      { email: { contains: searchParams.q, mode: "insensitive" as const } },
      { phone: { contains: searchParams.q, mode: "insensitive" as const } }
    ]
  } : {};

  let users: any[] = [];
  let totalUsers = 0;

  try {
    const [fetched, count] = await Promise.all([
      prisma.user.findMany({
        where: searchFilter,
        include: {
          roles: {
            include: { role: true }
          }
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.user.count({ where: searchFilter }),
    ]);
    users = fetched;
    totalUsers = count;
  } catch (error) {
    console.error("Database error fetching users:", error);
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-[var(--color-brand-navy)] flex items-center gap-3">
            <Users className="w-6 h-6" /> System Users
          </h1>
          <p className="text-sm text-slate-500">Manage all registered users, including customers and admin staff.</p>
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
                placeholder="Search name, email, phone..."
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
                <th className="px-6 py-4">User</th>
                <th className="px-6 py-4">Contact</th>
                <th className="px-6 py-4">Roles</th>
                <th className="px-6 py-4 text-center">Joined</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {users.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-slate-500">
                    No users found.
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr key={user.id} className="hover:bg-slate-50">
                    <td className="px-6 py-4">
                      <div className="font-bold text-slate-900">{user.firstName} {user.lastName}</div>
                      <div className="text-xs text-slate-500 font-mono">{user.id.substring(0, 8)}...</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-[var(--color-brand-green)] font-medium">{user.email}</div>
                      <div className="text-xs text-slate-500">{user.phone || "No phone"}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1">
                        {user.roles.length === 0 ? (
                          <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-600 text-xs font-medium">CUSTOMER</span>
                        ) : (
                          user.roles.map((r: any) => (
                            <span key={r.role.id} className="px-2 py-0.5 rounded bg-blue-100 text-blue-800 text-xs font-bold uppercase">
                              {r.role.name}
                            </span>
                          ))
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center text-slate-500 text-xs">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="inline-flex items-center justify-center p-2 text-slate-400 hover:text-[var(--color-brand-navy)] hover:bg-slate-100 rounded-lg transition-colors">
                        <Edit className="w-4 h-4" />
                      </button>
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
