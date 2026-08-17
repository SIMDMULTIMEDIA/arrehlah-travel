"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@supabase/supabase-js";

// Initialize Supabase admin client to bypass RLS for inserting from the server action
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function submitUmrahRegistration(formData: FormData) {
  try {
    const firstName = formData.get("firstName") as string;
    const lastName = formData.get("lastName") as string;
    const email = formData.get("email") as string;
    const phone = formData.get("phone") as string;
    const packageType = formData.get("packageType") as string;
    const departureDateStr = formData.get("departureDate") as string;
    const notes = formData.get("notes") as string;

    if (!firstName || !lastName || !email || !packageType || !departureDateStr) {
      return { success: false, error: "Missing required fields" };
    }

    const departureDate = new Date(departureDateStr);

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
    const reference = `UMRAH-${Date.now().toString().slice(-6)}`;

    // 3. Create parent Booking
    const { data: booking, error: bookingError } = await supabase
      .from("Booking")
      .insert({
        id: crypto.randomUUID(),
        reference,
        userId: userId,
        status: "PENDING",
        totalAmount: 0.00, // Amount TBD later, depends on exact package details
        currency: "NGN",
        notes: notes ? `Umrah Registration Notes: ${notes}` : "Umrah Registration",
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
        serviceType: "UMRAH",
        amount: 0.00,
        updatedAt: new Date().toISOString()
      })
      .select()
      .single();

    if (itemError) throw itemError;

    // 5. Create UmrahBooking
    const { data: umrahBooking, error: umrahError } = await supabase
      .from("UmrahBooking")
      .insert({
        id: crypto.randomUUID(),
        bookingItemId: bookingItem.id,
        packageType: packageType,
        departureDate: departureDate.toISOString(),
        status: "PRE_REGISTERED" // This is a String field in schema
      })
      .select()
      .single();

    if (umrahError) throw umrahError;

    revalidatePath("/umrah");
    return { success: true, bookingReference: booking.reference };
  } catch (error: any) {
    console.error("Umrah registration error:", error);
    return { success: false, error: error.message || "Failed to submit registration" };
  }
}
