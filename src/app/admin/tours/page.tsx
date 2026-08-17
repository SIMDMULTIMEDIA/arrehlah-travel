import { requireRole } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Plus, Edit, Settings2, Briefcase } from "lucide-react";
import { RoleName } from "@prisma/client";

export default async function ToursPage() {
  await requireRole([RoleName.SUPER_ADMIN, RoleName.ADMIN, RoleName.CONTENT_MANAGER]);

  let tours: any[] = [];

  try {
    tours = await prisma.tour.findMany({
      include: {
        destination: true,
        _count: {
          select: { tourDates: true }
        }
      },
      orderBy: { createdAt: "desc" },
    });
  } catch (error) {
    console.error("Database error fetching tours:", error);
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-[var(--color-brand-navy)] flex items-center gap-3">
            <Briefcase className="w-6 h-6" /> Tours & Packages
          </h1>
          <p className="text-sm text-slate-500">Manage holiday packages, itineraries, and pricing.</p>
        </div>
        <button className="px-4 py-2 bg-[var(--color-brand-green)] text-white font-medium rounded-lg flex items-center gap-2 hover:bg-opacity-90">
          <Plus className="w-4 h-4" /> Add Tour
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 text-xs uppercase font-semibold text-slate-500 border-b">
              <tr>
                <th className="px-6 py-4">Tour Name</th>
                <th className="px-6 py-4">Destination</th>
                <th className="px-6 py-4">Duration</th>
                <th className="px-6 py-4">Base Price</th>
                <th className="px-6 py-4 text-center">Dates/Schedules</th>
                <th className="px-6 py-4 text-center">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {tours.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-slate-500">
                    No tours found. Click "Add Tour" to create one.
                  </td>
                </tr>
              ) : (
                tours.map((tour) => (
                  <tr key={tour.id} className="hover:bg-slate-50">
                    <td className="px-6 py-4">
                      <div className="font-bold text-[var(--color-brand-navy)]">{tour.name}</div>
                      <div className="text-xs text-slate-500 truncate max-w-xs">{tour.description?.substring(0, 50)}...</div>
                    </td>
                    <td className="px-6 py-4 font-medium">
                      {tour.destination?.name || "Global"}
                    </td>
                    <td className="px-6 py-4">
                      {tour.durationDays} Days / {tour.durationDays - 1} Nights
                    </td>
                    <td className="px-6 py-4 font-bold text-slate-900">
                      ₦{Number(tour.basePrice).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="px-2.5 py-1 bg-slate-100 rounded-full text-xs font-medium">
                        {tour._count.tourDates} scheduled
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`inline-block px-2 py-1 rounded text-xs font-bold uppercase ${
                        tour.isActive ? 'bg-green-100 text-green-800' : 'bg-slate-100 text-slate-600'
                      }`}>
                        {tour.isActive ? 'Active' : 'Draft'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="inline-flex items-center justify-center p-2 text-slate-400 hover:text-[var(--color-brand-green)] hover:bg-slate-100 rounded-lg transition-colors mr-1">
                        <Settings2 className="w-4 h-4" />
                      </button>
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
