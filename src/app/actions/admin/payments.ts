"use server";

import { requireRole } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";
import { logAudit } from "@/lib/audit";
import { RoleName } from "@prisma/client";
import { revalidatePath } from "next/cache";

export async function approvePayment(paymentId: string, bookingId: string | null) {
  try {
    const user = await requireRole([
      RoleName.SUPER_ADMIN, 
      RoleName.ADMIN, 
      RoleName.FINANCE
    ]);

    if (!paymentId) return { success: false, error: "Invalid payment ID" };

    // Need to do this transactionally
    await prisma.$transaction(async (tx) => {
      // 1. Update Payment Status
      await tx.payment.update({
        where: { id: paymentId },
        data: { 
          status: "PAID",
          verifiedAt: new Date()
        }
      });

      // 2. If it's attached to a booking, check if we should update booking status
      // In a real system, you'd check if sum(PAID payments) >= booking.totalAmount
      // For this simplified version, if a payment is approved, we mark the booking as CONFIRMED.
      if (bookingId) {
        const booking = await tx.booking.findUnique({ where: { id: bookingId }});
        if (booking && booking.status === "PENDING") {
          await tx.booking.update({
            where: { id: bookingId },
            data: { status: "CONFIRMED" }
          });
          
          await logAudit(
            user.id,
            "AUTO_UPDATE_BOOKING_STATUS",
            "Booking",
            { bookingId, newStatus: "CONFIRMED", reason: "Payment Approved" }
          );
        }
      }
    });

    await logAudit(
      user.id,
      "APPROVE_PAYMENT",
      "Payment",
      { paymentId }
    );

    revalidatePath(`/admin/payments`);
    revalidatePath(`/admin/payments/pending`);
    if (bookingId) revalidatePath(`/admin/bookings/${bookingId}`);

    return { success: true };
  } catch (error: any) {
    console.error("Failed to approve payment:", error);
    return { success: false, error: error.message || "Failed to approve payment" };
  }
}

export async function rejectPayment(paymentId: string, bookingId: string | null, reason: string) {
  try {
    const user = await requireRole([
      RoleName.SUPER_ADMIN, 
      RoleName.ADMIN, 
      RoleName.FINANCE
    ]);

    if (!paymentId) return { success: false, error: "Invalid payment ID" };

    await prisma.payment.update({
      where: { id: paymentId },
      data: { status: "FAILED" }
    });

    await logAudit(
      user.id,
      "REJECT_PAYMENT",
      "Payment",
      { paymentId, reason }
    );

    revalidatePath(`/admin/payments`);
    revalidatePath(`/admin/payments/pending`);
    if (bookingId) revalidatePath(`/admin/bookings/${bookingId}`);

    return { success: true };
  } catch (error: any) {
    console.error("Failed to reject payment:", error);
    return { success: false, error: error.message || "Failed to reject payment" };
  }
}
