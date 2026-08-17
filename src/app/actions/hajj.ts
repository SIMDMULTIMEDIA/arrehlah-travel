"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@supabase/supabase-js";

// Initialize Supabase admin client to bypass RLS for inserting from the server action
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function submitHajjRegistration(formData: FormData) {
  try {
    const firstName = formData.get("firstName") as string;
    const lastName = formData.get("lastName") as string;
    const email = formData.get("email") as string;
    const phone = formData.get("phone") as string;
    const packageType = formData.get("packageType") as string;
    const yearStr = formData.get("year") as string;
    const notes = formData.get("notes") as string;

    const year = parseInt(yearStr, 10);

    if (!firstName || !lastName || !email || !packageType || isNaN(year)) {
      return { success: false, error: "Missing required fields" };
    }

    // 1. Find or create user
    let { data: users, error: userError } = await supabase
      .from("User")
      .select("id")
      .eq("email", email);

    if (userError) throw userError;

    let userId = users && users.length > 0 ? users[0].id : null;

    if (!userId) {
      const { data: newUser, error: createError } = await supabase
        .from("User")
        .insert({
          id: crypto.randomUUID(),
          email,
          firstName,
          lastName,
          phone,
          role: "CUSTOMER",
          updatedAt: new Date().toISOString()
        })
        .select()
        .single();

      if (createError) throw createError;
      userId = newUser.id;
    }

    // 2. Generate a reference number for the booking
    const reference = `HAJJ-${Date.now().toString().slice(-6)}`;

    // 3. Create parent Booking
    const { data: booking, error: bookingError } = await supabase
      .from("Booking")
      .insert({
        id: crypto.randomUUID(),
        reference,
        userId: userId,
        status: "PENDING",
        totalAmount: 0.00, // Amount TBD later
        currency: "NGN",
        notes: notes ? `Hajj Pre-registration Notes: ${notes}` : "Hajj Pre-registration",
        updatedAt: new Date().toISOString()
      })
      .select()
      .single();

    if (bookingError) throw bookingError;

    // 4. Create BookingItem
    const { data: bookingItem, error: itemError } = await supabase
      .from("BookingItem")
      .insert({
        id: crypto.randomUUID(),
        bookingId: booking.id,
        serviceType: "HAJJ",
        amount: 0.00,
        updatedAt: new Date().toISOString()
      })
      .select()
      .single();

    if (itemError) throw itemError;

    // 5. Create HajjBooking
    const { data: hajjBooking, error: hajjError } = await supabase
      .from("HajjBooking")
      .insert({
        id: crypto.randomUUID(),
        bookingItemId: bookingItem.id,
        packageType: packageType,
        year: year,
        status: "PRE_REGISTERED" // This is a String field in schema, not enum
      })
      .select()
      .single();

    if (hajjError) throw hajjError;

    revalidatePath("/hajj");
    return { success: true, bookingReference: booking.reference };
  } catch (error: any) {
    console.error("Hajj registration error:", error);
    return { success: false, error: error.message || "Failed to submit registration" };
  }
}
