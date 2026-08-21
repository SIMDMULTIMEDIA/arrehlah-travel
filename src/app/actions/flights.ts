"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@supabase/supabase-js";
import { flightProvider } from "@/lib/flights/provider";

// Initialize Supabase admin client for server-side trusted operations
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function submitFlightBooking(data: any) {
  const {
    offerId,
    title,
    firstName,
    middleName,
    lastName,
    dateOfBirth,
    gender,
    nationality,
    passportNumber,
    passportNationality,
    passportIssueDate,
    passportExpiryDate,
    placeOfIssue,
    email,
    phone,
    emergencyContact,
  } = data;

  try {
    // 1. Validate Provider Offer
    const flight = await flightProvider.getFlightOffer(offerId);
    if (!flight || flight.status !== "AVAILABLE") {
      return { success: false, error: "Flight offer is no longer available. Please select another flight." };
    }

    // Authoritative pricing from the server
    const amount = flight.price;
    const currency = flight.currency;
    const bookingReference = `ARR-${new Date().getFullYear()}-${Date.now().toString().slice(-6)}`;
    
    // We will keep track of created record IDs to implement a JS-level "rollback" (Saga pattern)
    // since we can't deploy Postgres functions securely through Netlify easily in this setup.
    let createdUserId: string | null = null;
    let createdTravelerId: string | null = null;
    let createdBookingId: string | null = null;
    let createdBookingItemId: string | null = null;

    try {
      // 2. Find or Create User/Customer
      let { data: users, error: userError } = await supabase
        .from("User")
        .select("id")
        .eq("email", email);

      if (userError) throw new Error("Database error while checking user.");

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

        if (createError) throw new Error("Failed to create user record.");
        userId = newUser.id;
        createdUserId = userId; // Track for rollback
      }

      // 3. Create Traveler Record (Using the Passport info)
      const { data: traveler, error: travelerError } = await supabase
        .from("Traveler")
        .insert({
          id: crypto.randomUUID(),
          userId: userId,
          firstName,
          lastName,
          dateOfBirth: new Date(dateOfBirth).toISOString(),
          gender,
          nationality,
          passportNumber,
          passportExpiry: new Date(passportExpiryDate).toISOString(),
          relationToUser: "Self",
          updatedAt: new Date().toISOString()
        })
        .select()
        .single();

      if (travelerError) throw new Error("Failed to create traveler record.");
      createdTravelerId = traveler.id;

      // 4. Create Parent Booking
      const { data: booking, error: bookingError } = await supabase
        .from("Booking")
        .insert({
          id: crypto.randomUUID(),
          reference: bookingReference,
          userId: userId,
          status: "PENDING", // PENDING_REQUEST equivalent in schema enum
          totalAmount: amount,
          currency: currency,
          notes: `Flight Booking Request. Emergency Contact: ${emergencyContact}`,
          updatedAt: new Date().toISOString()
        })
        .select()
        .single();

      if (bookingError) throw new Error("Failed to create booking record.");
      createdBookingId = booking.id;

      // 5. Create BookingItem
      const { data: bookingItem, error: itemError } = await supabase
        .from("BookingItem")
        .insert({
          id: crypto.randomUUID(),
          bookingId: booking.id,
          serviceType: "FLIGHT",
          amount: amount,
          updatedAt: new Date().toISOString()
        })
        .select()
        .single();

      if (itemError) throw new Error("Failed to create booking item.");
      createdBookingItemId = bookingItem.id;

      // 6. Create FlightBooking
      const { data: flightBooking, error: flightBookingError } = await supabase
        .from("FlightBooking")
        .insert({
          id: crypto.randomUUID(),
          bookingItemId: bookingItem.id,
          airline: flight.airline,
          flightNumber: flight.flightNumber,
          departureAirport: flight.origin,
          arrivalAirport: flight.destination,
          departureDate: new Date(flight.departureDate).toISOString(),
          cabinClass: flight.cabinClass,
          status: "PENDING_REQUEST",
        })
        .select()
        .single();

      if (flightBookingError) throw new Error("Failed to create flight details.");

      // Success! Revalidate paths
      revalidatePath("/flights");
      revalidatePath("/account/bookings");
      
      return { success: true, bookingReference: booking.reference };

    } catch (dbError: any) {
      // ROLLBACK: Delete any created records in reverse order to maintain relational integrity
      console.error("Database operation failed, rolling back...", dbError);
      
      if (createdBookingItemId) {
        await supabase.from("BookingItem").delete().eq("id", createdBookingItemId);
      }
      if (createdBookingId) {
        await supabase.from("Booking").delete().eq("id", createdBookingId);
      }
      if (createdTravelerId) {
        await supabase.from("Traveler").delete().eq("id", createdTravelerId);
      }
      if (createdUserId) {
        await supabase.from("User").delete().eq("id", createdUserId);
      }

      throw dbError;
    }

  } catch (error: any) {
    console.error("Flight booking transaction error:", error);
    return { success: false, error: error.message || "Failed to process booking request." };
  }
}

