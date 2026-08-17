import { createClient } from "@supabase/supabase-js";
import Link from "next/link";
import { CheckCircle2, ChevronRight, Download, Calendar, MapPin, CreditCard, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";

export const revalidate = 0; // Dynamic page

async function getBooking(reference: string) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { data, error } = await supabase
    .from("Booking")
    .select(`
      id,
      reference,
      status,
      totalAmount,
      currency,
      createdAt,
      User ( firstName, lastName, email ),
      BookingItem (
        id,
        amount,
        FlightBooking (
          airline,
          flightNumber,
          departureAirport,
          arrivalAirport,
          departureDate,
          cabinClass,
          status
        )
      )
    `)
    .eq("reference", reference)
    .single();

  if (error) {
    console.error("Error fetching booking confirmation:", error);
    return null;
  }
  return data;
}

export default async function FlightConfirmationPage({
  params,
}: {
  params: { bookingReference: string };
}) {
  const booking = await getBooking(params.bookingReference);

  if (!booking) {
    return (
      <div className="bg-slate-50 min-h-screen py-24 text-center">
        <h1 className="text-3xl font-bold text-slate-800 mb-4">Booking Not Found</h1>
        <p className="text-slate-600 mb-8">We could not locate a booking with this reference.</p>
        <Link href="/flights" className="inline-block bg-[var(--color-brand-navy)] text-white px-6 py-3 rounded-lg font-medium">
          Return to Flight Search
        </Link>
      </div>
    );
  }

  const flightItem = booking.BookingItem?.find((item: any) => {
    const fb = Array.isArray(item.FlightBooking) ? item.FlightBooking[0] : item.FlightBooking;
    return fb != null;
  });
  const rawFlight = flightItem?.FlightBooking;
  const flight = Array.isArray(rawFlight) ? rawFlight[0] : rawFlight;
  
  const rawUser = booking.User;
  const user = Array.isArray(rawUser) ? rawUser[0] : rawUser;

  return (
    <div className="bg-slate-50 min-h-screen py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        
        {/* Success Header */}
        <div className="bg-white rounded-t-2xl p-8 border-b-4 border-[var(--color-brand-green)] shadow-sm text-center">
          <CheckCircle2 className="h-16 w-16 text-[var(--color-brand-green)] mx-auto mb-4" />
          <h1 className="text-3xl md:text-4xl font-bold text-[var(--color-brand-navy)] mb-2">
            Booking Request Received
          </h1>
          <p className="text-slate-600 max-w-xl mx-auto mb-6">
            Thank you, {user?.firstName}. Your flight booking request has been successfully submitted. This is a demo booking and acts as a placeholder until our live provider is connected.
          </p>
          
          <div className="inline-flex flex-col items-center p-4 bg-slate-50 rounded-xl border border-slate-100">
            <span className="text-sm text-slate-500 mb-1 font-medium uppercase tracking-wider">Booking Reference</span>
            <span className="text-3xl font-mono font-bold tracking-widest text-[var(--color-brand-navy)]">{booking.reference}</span>
          </div>
        </div>

        <div className="bg-white rounded-b-2xl p-8 shadow-sm border border-t-0 space-y-8">
          
          {/* Status Tracker */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-6 border-b border-slate-100">
            <div className="flex flex-col items-center text-center">
              <div className="w-10 h-10 rounded-full bg-green-100 text-green-600 flex items-center justify-center mb-2">
                <CheckCircle2 className="h-5 w-5" />
              </div>
              <span className="text-xs font-bold text-slate-700">Requested</span>
              <span className="text-xs text-slate-500">{new Date(booking.createdAt).toLocaleDateString()}</span>
            </div>
            
            <div className="flex flex-col items-center text-center relative opacity-50">
              <div className="absolute top-5 -left-1/2 w-full border-t-2 border-dashed border-slate-200 -z-10"></div>
              <div className="w-10 h-10 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mb-2">
                <Clock className="h-5 w-5" />
              </div>
              <span className="text-xs font-bold text-slate-700">Awaiting Agent</span>
            </div>
            
            <div className="flex flex-col items-center text-center relative opacity-50 hidden md:flex">
              <div className="absolute top-5 -left-1/2 w-full border-t-2 border-dashed border-slate-200 -z-10"></div>
              <div className="w-10 h-10 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mb-2">
                <CreditCard className="h-5 w-5" />
              </div>
              <span className="text-xs font-bold text-slate-700">Payment</span>
            </div>
            
            <div className="flex flex-col items-center text-center relative opacity-50 hidden md:flex">
              <div className="absolute top-5 -left-1/2 w-full border-t-2 border-dashed border-slate-200 -z-10"></div>
              <div className="w-10 h-10 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mb-2">
                <CheckCircle2 className="h-5 w-5" />
              </div>
              <span className="text-xs font-bold text-slate-700">Confirmed</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Flight Details */}
            {flight && (
              <div className="space-y-4">
                <h3 className="font-bold text-lg text-slate-800 flex items-center">
                  <MapPin className="h-5 w-5 mr-2 text-[var(--color-brand-green)]" />
                  Flight Details
                </h3>
                <div className="bg-slate-50 p-4 rounded-lg border border-slate-100 space-y-3">
                  <div className="flex justify-between">
                    <span className="text-slate-500 text-sm">Airline</span>
                    <span className="font-semibold text-slate-800 text-sm">{flight.airline}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 text-sm">Flight No.</span>
                    <span className="font-semibold text-slate-800 text-sm">{flight.flightNumber}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 text-sm">Route</span>
                    <span className="font-semibold text-slate-800 text-sm">{flight.departureAirport} → {flight.arrivalAirport}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 text-sm">Cabin Class</span>
                    <span className="font-semibold text-slate-800 text-sm">{flight.cabinClass}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 text-sm">Departure</span>
                    <span className="font-semibold text-slate-800 text-sm">{new Date(flight.departureDate).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Payment Details */}
            <div className="space-y-4">
              <h3 className="font-bold text-lg text-slate-800 flex items-center">
                <CreditCard className="h-5 w-5 mr-2 text-[var(--color-brand-green)]" />
                Payment Summary
              </h3>
              <div className="bg-slate-50 p-4 rounded-lg border border-slate-100 space-y-3">
                <div className="flex justify-between">
                  <span className="text-slate-500 text-sm">Payment Status</span>
                  <span className="font-semibold text-amber-600 text-sm bg-amber-50 px-2 py-0.5 rounded">PENDING</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 text-sm">Booking Status</span>
                  <span className="font-semibold text-blue-600 text-sm bg-blue-50 px-2 py-0.5 rounded">{booking.status}</span>
                </div>
                <div className="border-t border-slate-200 pt-3 flex justify-between mt-2">
                  <span className="font-bold text-slate-800">Total Amount</span>
                  <span className="font-bold text-xl text-[var(--color-brand-green)]">
                    {booking.currency} {booking.totalAmount.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6 border-t border-slate-100">
            <Button variant="outline" className="gap-2">
              <Download className="h-4 w-4" /> Download Receipt
            </Button>
            <Link href="/account/bookings">
              <Button className="w-full sm:w-auto bg-[var(--color-brand-navy)] hover:bg-slate-800 gap-2">
                Go to My Dashboard <ChevronRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
          
        </div>
      </div>
    </div>
  );
}
