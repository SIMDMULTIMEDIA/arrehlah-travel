import { requireRole } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Plus, Edit, Settings2, MapPin } from "lucide-react";
import { RoleName } from "@prisma/client";

export default async function DestinationsPage() {
  await requireRole([RoleName.SUPER_ADMIN, RoleName.ADMIN, RoleName.CONTENT_MANAGER]);

  let destinations: any[] = [];

  try {
    destinations = await prisma.destination.findMany({
      include: {
        _count: {
          select: { tours: true, hotels: true }
        }
      },
      orderBy: { name: "asc" },
    });
  } catch (error) {
    console.error("Database error fetching destinations:", error);
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-[var(--color-brand-navy)] flex items-center gap-3">
            <MapPin className="w-6 h-6" /> Destinations
          </h1>
          <p className="text-sm text-slate-500">Manage locations, cities, and countries.</p>
        </div>
        <button className="px-4 py-2 bg-[var(--color-brand-green)] text-white font-medium rounded-lg flex items-center gap-2 hover:bg-opacity-90">
          <Plus className="w-4 h-4" /> Add Destination
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 text-xs uppercase font-semibold text-slate-500 border-b">
              <tr>
                <th className="px-6 py-4">Name</th>
                <th className="px-6 py-4">Country</th>
                <th className="px-6 py-4 text-center">Tours</th>
                <th className="px-6 py-4 text-center">Hotels</th>
                <th className="px-6 py-4 text-center">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {destinations.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-slate-500">
                    No destinations found.
                  </td>
                </tr>
              ) : (
                destinations.map((dest) => (
                  <tr key={dest.id} className="hover:bg-slate-50">
                    <td className="px-6 py-4 font-bold text-[var(--color-brand-navy)]">
                      {dest.name}
                    </td>
                    <td className="px-6 py-4 font-medium">
                      {dest.country}
                    </td>
                    <td className="px-6 py-4 text-center">
                      {dest._count.tours}
                    </td>
                    <td className="px-6 py-4 text-center">
                      {dest._count.hotels}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`inline-block px-2 py-1 rounded text-xs font-bold uppercase ${
                        dest.isActive ? 'bg-green-100 text-green-800' : 'bg-slate-100 text-slate-600'
                      }`}>
                        {dest.isActive ? 'Active' : 'Inactive'}
                      </span>
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
