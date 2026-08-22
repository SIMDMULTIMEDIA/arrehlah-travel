import FlightBookingForm from "@/components/flights/FlightBookingForm";
import { ChevronLeft, PlaneTakeoff, Info } from "lucide-react";
import Link from "next/link";
import { Metadata } from "next";
import { flightProvider } from "@/lib/flights/provider";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Book Flight - Arrehlah Travel",
  description: "Secure your flight with Arrehlah Travel.",
};

export default async function FlightBookingPage({
  searchParams,
}: {
  searchParams: { offer?: string };
}) {
  const offerId = searchParams.offer;
  
  if (!offerId) {
    return (
      <div className="bg-slate-50 min-h-screen py-24 text-center">
        <h1 className="text-3xl font-bold text-slate-800 mb-4">Flight offer unavailable</h1>
        <p className="text-slate-600 mb-8">No flight offer ID was provided in the request.</p>
        <Link href="/flights" className="inline-block bg-[var(--color-brand-navy)] text-white px-6 py-3 rounded-lg font-medium">
          Return to Flight Search
        </Link>
      </div>
    );
  }

  // Retrieve the authoritative offer securely on the server
  const flight = await flightProvider.getFlightOffer(offerId);

  if (!flight || flight.status !== "AVAILABLE") {
    return (
      <div className="bg-slate-50 min-h-screen py-24 text-center">
        <h1 className="text-3xl font-bold text-slate-800 mb-4">Flight offer unavailable or expired</h1>
        <p className="text-slate-600 mb-8">We could not find this flight offer, or it is no longer available.</p>
        <Link href="/flights" className="inline-block bg-[var(--color-brand-navy)] text-white px-6 py-3 rounded-lg font-medium">
          Return to Flight Search
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 min-h-screen py-12">
      <div className="container mx-auto px-4 max-w-5xl">
        <Link 
          href="/flights" 
          className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-[var(--color-brand-navy)] mb-8 transition"
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Back to Search Results
        </Link>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-[var(--color-brand-navy)]">
              Secure Flight Booking
            </h1>
            <p className="text-slate-600 text-lg mt-2">
              Complete your traveler details below to finalize your booking request.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          <div className="lg:col-span-8 order-2 lg:order-1">
            <FlightBookingForm offerId={flight.id} />
          </div>

          <div className="lg:col-span-4 order-1 lg:order-2 space-y-6 sticky top-24">
            
            {/* Flight Summary Card */}
            <div className="bg-white p-6 rounded-xl border shadow-sm">
              <h3 className="font-bold text-lg mb-4 text-[var(--color-brand-navy)] border-b pb-2">Selected Flight</h3>
              
              <div className="mb-4">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-semibold">{flight.airline}</span>
                  <span className="text-sm font-medium bg-slate-100 px-2 py-0.5 rounded text-slate-600">{flight.cabinClass}</span>
                </div>
                <div className="text-sm text-slate-500 flex justify-between">
                  <span>Flight {flight.flightNumber}</span>
                  <span>{flight.baggageAllowance} Baggage</span>
                </div>
              </div>

              <div className="flex justify-between items-center py-4 border-t border-b border-slate-100 my-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-[var(--color-brand-navy)]">{flight.origin}</div>
                  <div className="text-sm text-slate-500">{flight.departureTime}</div>
                </div>
                
                <div className="flex-1 px-4 relative flex flex-col items-center">
                  <PlaneTakeoff className="h-4 w-4 text-slate-400 mb-1" />
                  <div className="w-full border-t border-dashed border-slate-300 relative"></div>
                  <div className="text-xs text-slate-500 mt-1">{flight.duration}</div>
                </div>

                <div className="text-center">
                  <div className="text-2xl font-bold text-[var(--color-brand-navy)]">{flight.destination}</div>
                  <div className="text-sm text-slate-500">{flight.arrivalTime}</div>
                </div>
              </div>
              
              <div className="text-sm text-slate-600 mb-1">
                <strong>Date:</strong> {new Date(flight.departureDate).toLocaleDateString(undefined, { weekday: 'short', year: 'numeric', month: 'long', day: 'numeric' })}
              </div>
              <div className="text-sm text-slate-600">
                <strong>Stops:</strong> {flight.stops === 0 ? "Direct Flight" : `${flight.stops} Stop(s)`}
              </div>
            </div>

            {/* Price Summary Card */}
            <div className="bg-white p-6 rounded-xl border shadow-sm">
              <h3 className="font-bold text-lg mb-4 text-[var(--color-brand-navy)] border-b pb-2">Price Summary</h3>
              
              <div className="flex justify-between items-center mb-2 text-slate-600">
                <span>1x Adult Passenger</span>
                <span>{flight.currency} {flight.price.toLocaleString()}</span>
              </div>
              
              <div className="flex justify-between items-center mb-4 text-slate-600">
                <span>Taxes & Fees</span>
                <span>Included</span>
              </div>

              <div className="flex justify-between items-center pt-4 border-t border-slate-200">
                <span className="font-bold text-lg">Total Amount</span>
                <span className="font-bold text-2xl text-[var(--color-brand-green)]">{flight.currency} {flight.price.toLocaleString()}</span>
              </div>
            </div>

            {/* Demo Notice */}
            <div className="bg-blue-50 border border-blue-200 text-blue-800 p-4 rounded-xl flex items-start gap-3">
              <Info className="h-5 w-5 text-blue-500 flex-shrink-0 mt-0.5" />
              <p className="text-xs">
                This is a mock flight offer for demonstration. Authoritative price is validated server-side.
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

