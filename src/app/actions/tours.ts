"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@supabase/supabase-js";

// Initialize Supabase admin client to bypass RLS for inserting from the server action
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function submitTourRegistration(formData: FormData) {
  try {
    const firstName = formData.get("firstName") as string;
    const lastName = formData.get("lastName") as string;
    const email = formData.get("email") as string;
    const phone = formData.get("phone") as string;
    const tourSlug = formData.get("tourSlug") as string;
    const travelersStr = formData.get("travelers") as string;
    const notes = formData.get("notes") as string;

    if (!firstName || !lastName || !email || !tourSlug || !travelersStr) {
      return { success: false, error: "Missing required fields" };
    }

    const travelers = parseInt(travelersStr, 10);
    if (isNaN(travelers) || travelers < 1) {
      return { success: false, error: "Invalid number of travelers" };
    }

    // 1. Get the Tour ID based on the slug
    const { data: tour, error: tourFetchError } = await supabase
      .from("Tour")
      .select("id, price")
      .eq("slug", tourSlug)
      .single();

    if (tourFetchError || !tour) {
      return { success: false, error: "Selected tour not found in database" };
    }

    // 2. Find or create user
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

    // 3. Generate a reference number for the booking
    const reference = `TOUR-${Date.now().toString().slice(-6)}`;
    const totalAmount = (tour.price || 0) * travelers;

    // 4. Create parent Booking
    const { data: booking, error: bookingError } = await supabase
      .from("Booking")
      .insert({
        id: crypto.randomUUID(),
        reference,
        userId: userId,
        status: "PENDING",
        totalAmount,
        currency: "NGN",
        notes: notes ? `Tour Notes: ${notes}` : "Tour Booking",
        updatedAt: new Date().toISOString()
      })
      .select()
      .single();

    if (bookingError) throw bookingError;

    // 5. Create BookingItem
    const { data: bookingItem, error: itemError } = await supabase
      .from("BookingItem")
      .insert({
        id: crypto.randomUUID(),
        bookingId: booking.id,
        serviceType: "TOUR",
        amount: totalAmount,
        updatedAt: new Date().toISOString()
      })
      .select()
      .single();

    if (itemError) throw itemError;

    // 6. Create TourBooking
    const { data: tourBooking, error: tourBookingError } = await supabase
      .from("TourBooking")
      .insert({
        id: crypto.randomUUID(),
        bookingItemId: bookingItem.id,
        tourId: tour.id,
        travelers: travelers,
        specialRequests: notes,
        status: "PENDING",
        updatedAt: new Date().toISOString()
      })
      .select()
      .single();

    if (tourBookingError) throw tourBookingError;

    revalidatePath("/tours");
    return { success: true, bookingReference: booking.reference };
  } catch (error: any) {
    console.error("Tour registration error:", error);
    return { success: false, error: error.message || "Failed to submit registration" };
  }
}

