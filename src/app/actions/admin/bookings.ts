"use server";

import { requireRole } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";
import { logAudit } from "@/lib/audit";
import { BookingStatus, RoleName } from "@prisma/client";
import { revalidatePath } from "next/cache";

export async function updateBookingStatus(bookingId: string, newStatus: BookingStatus) {
  try {
    // 1. Authorize (SUPER_ADMIN, ADMIN, BOOKING_AGENT)
    const user = await requireRole([
      RoleName.SUPER_ADMIN, 
      RoleName.ADMIN, 
      RoleName.BOOKING_AGENT
    ]);

    // 2. Validate input
    if (!bookingId || !newStatus) {
      return { success: false, error: "Invalid parameters" };
    }

    // 3. Perform atomic update
    const updatedBooking = await prisma.booking.update({
      where: { id: bookingId },
      data: { status: newStatus }
    });

    // 4. Create Audit Log
    await logAudit(
      user.id,
      "UPDATE_BOOKING_STATUS",
      "Booking",
      { bookingId, newStatus }
    );

    // 5. Revalidate affected pages
    revalidatePath(`/admin/bookings`);
    revalidatePath(`/admin/bookings/${bookingId}`);

    return { success: true, booking: updatedBooking };
  } catch (error: any) {
    console.error("Failed to update booking status:", error);
    return { success: false, error: error.message || "Failed to update booking status" };
  }
}
