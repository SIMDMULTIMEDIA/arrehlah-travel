"use client";

import { useState } from "react";
import { updateBookingStatus } from "@/app/actions/admin/bookings";
import { BookingStatus } from "@prisma/client";
import { RefreshCw } from "lucide-react";

export default function BookingStatusForm({ 
  bookingId, 
  currentStatus 
}: { 
  bookingId: string;
  currentStatus: BookingStatus;
}) {
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleStatusChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const newStatus = e.target.value as BookingStatus;
    if (newStatus === currentStatus) return;

    if (!confirm(`Are you sure you want to change the status to ${newStatus}?`)) {
      e.target.value = currentStatus;
      return;
    }

    setIsUpdating(true);
    setError(null);

    try {
      const result = await updateBookingStatus(bookingId, newStatus);
      if (!result.success) {
        setError(result.error || "Failed to update status");
        e.target.value = currentStatus;
      }
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred");
      e.target.value = currentStatus;
    } finally {
      setIsUpdating(false);
    }
  }

  return (
    <div className="flex items-center gap-3">
      {error && <span className="text-xs text-red-500">{error}</span>}
      <div className="relative">
        <select
          defaultValue={currentStatus}
          onChange={handleStatusChange}
          disabled={isUpdating}
          className="appearance-none bg-white border border-slate-300 text-slate-700 text-sm rounded-lg focus:ring-[var(--color-brand-navy)] focus:border-[var(--color-brand-navy)] block w-full p-2.5 pr-8 disabled:opacity-50"
        >
          <option value="PENDING">Set Pending</option>
          <option value="CONFIRMED">Set Confirmed</option>
          <option value="CANCELLED">Set Cancelled</option>
          <option value="COMPLETED">Set Completed</option>
        </select>
        {isUpdating && (
          <div className="absolute right-2 top-1/2 -translate-y-1/2">
            <RefreshCw className="w-4 h-4 text-slate-400 animate-spin" />
          </div>
        )}
      </div>
    </div>
  );
}
