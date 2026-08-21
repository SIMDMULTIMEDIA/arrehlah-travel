"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@supabase/supabase-js";

// Initialize Supabase admin client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function submitHotelBooking(formData: FormData) {
  try {
    const firstName = formData.get("firstName") as string;
    const lastName = formData.get("lastName") as string;
    const email = formData.get("email") as string;
    const phone = formData.get("phone") as string;
    const hotelId = formData.get("hotelId") as string;
    const checkIn = formData.get("checkIn") as string;
    const checkOut = formData.get("checkOut") as string;
    const roomsStr = formData.get("rooms") as string;
    const notes = formData.get("notes") as string;

    if (!firstName || !lastName || !email || !hotelId || !checkIn || !checkOut || !roomsStr) {
      return { success: false, error: "Missing required fields" };
    }

    const rooms = parseInt(roomsStr, 10);
    if (isNaN(rooms) || rooms < 1) {
      return { success: false, error: "Invalid number of rooms" };
    }

    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);
    if (checkInDate >= checkOutDate) {
      return { success: false, error: "Check-out date must be after check-in date" };
    }

    // 1. Get the Hotel and its default Room to calculate price
    const { data: hotel, error: hotelFetchError } = await supabase
      .from("Hotel")
      .select("id, Room(id, pricePerNight)")
      .eq("id", hotelId)
      .single();

    if (hotelFetchError || !hotel) {
      return { success: false, error: "Selected hotel not found" };
    }

    let pricePerNight = 90000;
    let roomId = null;
    if (hotel.Room && hotel.Room.length > 0) {
      pricePerNight = hotel.Room[0].pricePerNight || pricePerNight;
      roomId = hotel.Room[0].id;
    }

    const nights = Math.ceil((checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24));
    const totalAmount = pricePerNight * rooms * nights;

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

    // 3. Generate reference
    const reference = `HTL-${Date.now().toString().slice(-6)}`;

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
        notes: notes ? `Hotel Notes: ${notes}` : "Hotel Booking",
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
        serviceType: "HOTEL",
        amount: totalAmount,
        updatedAt: new Date().toISOString()
      })
      .select()
      .single();

    if (itemError) throw itemError;

    // 6. Create HotelBooking
    const { data: hotelBooking, error: hotelBookingError } = await supabase
      .from("HotelBooking")
      .insert({
        id: crypto.randomUUID(),
        bookingItemId: bookingItem.id,
        hotelId: hotelId,
        roomId: roomId,
        checkIn: checkInDate.toISOString(),
        checkOut: checkOutDate.toISOString(),
        numberOfRooms: rooms,
        status: "PENDING",
      })
      .select()
      .single();

    if (hotelBookingError) throw hotelBookingError;

    revalidatePath("/hotels");
    return { success: true, bookingReference: booking.reference };
  } catch (error: any) {
    console.error("Hotel registration error:", error);
    return { success: false, error: error.message || "Failed to submit booking" };
  }
}

