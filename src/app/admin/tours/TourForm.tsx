"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

type Destination = {
  id: string;
  name: string;
};

type TourData = {
  id?: string;
  title?: string;
  destinationId?: string;
  durationDays?: number;
  price?: number;
  description?: string;
  coverImage?: string;
  includes?: string[];
  excludes?: string[];
  isActive?: boolean;
};

export default function TourForm({
  tour,
  destinations,
  action,
}: {
  tour?: TourData;
  destinations: Destination[];
  action: (formData: FormData) => Promise<void>;
}) {
  const [loading, setLoading] = useState(false);
  const isEditing = !!tour?.id;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    try {
      await action(formData);
    } catch {
      // redirect throws, which is expected
    }
    setLoading(false);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/admin/tours" className="text-slate-400 hover:text-slate-600">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <h1 className="text-2xl font-bold text-[var(--color-brand-navy)]">
          {isEditing ? "Edit Tour" : "Create New Tour"}
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {tour?.id && <input type="hidden" name="id" value={tour.id} />}

        <div className="bg-white p-6 rounded-xl border shadow-sm space-y-5">
          <h3 className="text-lg font-bold border-b pb-2 text-[var(--color-brand-navy)]">
            Basic Information
          </h3>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Tour Title *</label>
            <Input name="title" defaultValue={tour?.title || ""} required placeholder="e.g. Dubai Explorer Package" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Destination *</label>
              <select
                name="destinationId"
                defaultValue={tour?.destinationId || ""}
                required
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-green)]"
              >
                <option value="">Select destination...</option>
                {destinations.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Duration (Days) *</label>
              <Input name="durationDays" type="number" min="1" defaultValue={tour?.durationDays || 1} required />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Base Price (₦) *</label>
              <Input name="price" type="number" step="0.01" min="0" defaultValue={tour?.price || ""} required placeholder="e.g. 350000" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Cover Image URL</label>
              <Input name="coverImage" defaultValue={tour?.coverImage || ""} placeholder="https://..." />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
            <textarea
              name="description"
              defaultValue={tour?.description || ""}
              rows={4}
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-green)]"
              placeholder="Describe the tour package..."
            />
          </div>

          <div className="flex items-center gap-3">
            <label className="text-sm font-medium text-slate-700">Status</label>
            <select
              name="isActive"
              defaultValue={tour?.isActive !== false ? "true" : "false"}
              className="rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-green)]"
            >
              <option value="true">Active</option>
              <option value="false">Draft</option>
            </select>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border shadow-sm space-y-5">
          <h3 className="text-lg font-bold border-b pb-2 text-[var(--color-brand-navy)]">
            What&apos;s Included / Excluded
          </h3>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Includes <span className="text-slate-400 text-xs">(one per line)</span>
            </label>
            <textarea
              name="includes"
              defaultValue={Array.isArray(tour?.includes) ? tour.includes.join("\n") : ""}
              rows={4}
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-green)]"
              placeholder={"Return flights\nHotel accommodation\nBreakfast daily\nAirport transfers"}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Excludes <span className="text-slate-400 text-xs">(one per line)</span>
            </label>
            <textarea
              name="excludes"
              defaultValue={Array.isArray(tour?.excludes) ? tour.excludes.join("\n") : ""}
              rows={4}
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-green)]"
              placeholder={"Travel insurance\nPersonal expenses\nVisa fees"}
            />
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <Link href="/admin/tours">
            <Button type="button" variant="outline">Cancel</Button>
          </Link>
          <Button type="submit" disabled={loading} className="bg-[var(--color-brand-green)] hover:bg-green-700">
            {loading ? "Saving..." : isEditing ? "Update Tour" : "Create Tour"}
          </Button>
        </div>
      </form>
    </div>
  );
}
