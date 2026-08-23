import { requireRole } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Plus, Edit, Briefcase, Eye, EyeOff } from "lucide-react";
import { RoleName } from "@prisma/client";
import { toggleTourStatus } from "@/app/actions/admin/tours";
import { DeleteTourButton } from "./DeleteTourButton";

export default async function ToursPage() {
  await requireRole([RoleName.SUPER_ADMIN, RoleName.ADMIN, RoleName.CONTENT_MANAGER]);

  let tours: any[] = [];

  try {
    tours = await prisma.tour.findMany({
      include: {
        destination: true,
        _count: {
          select: { tourDates: true, tourBookings: true }
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
        <Link
          href="/admin/tours/new"
          className="px-4 py-2 bg-[var(--color-brand-green)] text-white font-medium rounded-lg flex items-center gap-2 hover:bg-opacity-90"
        >
          <Plus className="w-4 h-4" /> Add Tour
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 text-xs uppercase font-semibold text-slate-500 border-b">
              <tr>
                <th className="px-6 py-4">Tour Name</th>
                <th className="px-6 py-4">Destination</th>
                <th className="px-6 py-4">Duration</th>
                <th className="px-6 py-4">Base Price</th>
                <th className="px-6 py-4 text-center">Dates</th>
                <th className="px-6 py-4 text-center">Bookings</th>
                <th className="px-6 py-4 text-center">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {tours.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-12 text-center text-slate-400">
                    <Briefcase className="w-10 h-10 mx-auto mb-3 text-slate-300" />
                    <p className="font-medium text-slate-500">No tours found</p>
                    <p className="text-xs mt-1">Click &quot;Add Tour&quot; to create your first tour package.</p>
                  </td>
                </tr>
              ) : (
                tours.map((tour) => (
                  <tr key={tour.id} className="hover:bg-slate-50">
                    <td className="px-6 py-4">
                      <div className="font-bold text-[var(--color-brand-navy)]">{tour.title}</div>
                      <div className="text-xs text-slate-400 truncate max-w-xs">
                        {tour.description ? `${tour.description.substring(0, 60)}...` : "No description"}
                      </div>
                    </td>
                    <td className="px-6 py-4 font-medium">
                      {tour.destination?.name || "—"}
                    </td>
                    <td className="px-6 py-4">
                      {tour.durationDays} Days / {Math.max(tour.durationDays - 1, 0)} Nights
                    </td>
                    <td className="px-6 py-4 font-bold text-slate-900">
                      ₦{Number(tour.price).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="px-2.5 py-1 bg-slate-100 rounded-full text-xs font-medium">
                        {tour._count.tourDates} scheduled
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="px-2.5 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-medium">
                        {tour._count.tourBookings} booked
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <form action={toggleTourStatus} className="inline">
                        <input type="hidden" name="id" value={tour.id} />
                        <button
                          type="submit"
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded text-xs font-bold uppercase cursor-pointer ${
                            tour.isActive
                              ? "bg-green-100 text-green-800 hover:bg-green-200"
                              : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                          }`}
                        >
                          {tour.isActive ? (
                            <><Eye className="w-3 h-3" /> Active</>
                          ) : (
                            <><EyeOff className="w-3 h-3" /> Draft</>
                          )}
                        </button>
                      </form>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Link
                          href={`/admin/tours/${tour.id}/edit`}
                          className="inline-flex items-center justify-center p-2 text-slate-400 hover:text-[var(--color-brand-navy)] hover:bg-slate-100 rounded-lg transition-colors"
                          title="Edit tour"
                        >
                          <Edit className="w-4 h-4" />
                        </Link>
                        <DeleteTourButton id={tour.id} title={tour.title} />
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
