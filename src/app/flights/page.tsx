import type { Metadata } from "next";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PlaneTakeoff, Search, Map, Calendar, Users, Info } from "lucide-react";
import Link from "next/link";
import { flightProvider } from "@/lib/flights/provider";

export const revalidate = 60; // Cache this for 60 seconds (useful when searching)

export default async function FlightsPage({
  searchParams,
}: {
  searchParams: { origin?: string; destination?: string };
}) {
  const origin = searchParams.origin || "";
  const destination = searchParams.destination || "";

  // Abstracted call to the flight provider
  const flights = await flightProvider.searchFlights({ origin, destination });

  return (
    <div className="bg-slate-50 min-h-screen">
      {/* Search Header */}
      <div className="bg-[var(--color-brand-navy)] py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-white mb-6">Search Flights</h1>
          
          <form className="bg-white rounded-xl shadow-lg p-6">
             <div className="flex flex-col md:flex-row gap-4 mb-4">
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" name="tripType" value="ROUND_TRIP" defaultChecked className="text-[var(--color-brand-green)] focus:ring-[var(--color-brand-green)]" />
                    <span className="text-sm font-medium">Round trip</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" name="tripType" value="ONE_WAY" className="text-[var(--color-brand-green)] focus:ring-[var(--color-brand-green)]" />
                    <span className="text-sm font-medium">One way</span>
                  </label>
                </div>
             </div>
             
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 items-end">
                <div className="lg:col-span-1">
                  <label className="block text-sm font-medium text-slate-700 mb-1">From</label>
                  <div className="relative">
                    <Input name="origin" defaultValue={origin} placeholder="KAN" className="pl-10 uppercase" />
                    <PlaneTakeoff className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  </div>
                </div>
                <div className="lg:col-span-1">
                  <label className="block text-sm font-medium text-slate-700 mb-1">To</label>
                  <div className="relative">
                    <Input name="destination" defaultValue={destination} placeholder="DXB" className="pl-10 uppercase" />
                    <Map className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  </div>
                </div>
                <div className="lg:col-span-1">
                  <label className="block text-sm font-medium text-slate-700 mb-1">Dates</label>
                  <div className="relative">
                    <Input type="date" name="departureDate" className="pl-10" />
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  </div>
                </div>
                <div className="lg:col-span-1">
                  <label className="block text-sm font-medium text-slate-700 mb-1">Travelers</label>
                  <div className="relative">
                    <Input name="adults" defaultValue="1 Adult" className="pl-10" />
                    <Users className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  </div>
                </div>
                <div className="lg:col-span-1">
                  <Button type="submit" className="w-full h-10 gap-2 bg-[var(--color-brand-green)] hover:bg-green-700 text-white">
                    <Search className="h-4 w-4" />
                    Search
                  </Button>
                </div>
             </div>
          </form>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-blue-50 border border-blue-200 text-blue-800 p-4 rounded-xl flex items-start gap-3 mb-8">
          <Info className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
          <p className="text-sm">
            <strong>Demo flight inventory</strong> — live availability will be connected through our travel provider in a future update.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1 space-y-6">
             <div className="bg-white p-6 rounded-xl shadow-sm border">
               <h3 className="font-semibold text-lg mb-4">Filters</h3>
               <div className="mb-6">
                 <h4 className="text-sm font-medium text-slate-700 mb-2">Stops</h4>
                 <div className="space-y-2">
                   <label className="flex items-center gap-2 cursor-pointer text-sm">
                     <input type="checkbox" defaultChecked className="rounded text-[var(--color-brand-green)] focus:ring-[var(--color-brand-green)]" />
                     Direct
                   </label>
                   <label className="flex items-center gap-2 cursor-pointer text-sm">
                     <input type="checkbox" defaultChecked className="rounded text-[var(--color-brand-green)] focus:ring-[var(--color-brand-green)]" />
                     1 Stop
                   </label>
                 </div>
               </div>
               
               <div className="mb-6">
                 <h4 className="text-sm font-medium text-slate-700 mb-2">Cabin Class</h4>
                 <div className="space-y-2">
                   <label className="flex items-center gap-2 cursor-pointer text-sm">
                     <input type="checkbox" defaultChecked className="rounded text-[var(--color-brand-green)] focus:ring-[var(--color-brand-green)]" />
                     Economy
                   </label>
                   <label className="flex items-center gap-2 cursor-pointer text-sm">
                     <input type="checkbox" defaultChecked className="rounded text-[var(--color-brand-green)] focus:ring-[var(--color-brand-green)]" />
                     Business
                   </label>
                 </div>
               </div>
             </div>
          </div>

          {/* Results List */}
          <div className="lg:col-span-3 space-y-4">
             {flights.map((flight) => (
               <div key={flight.id} className="bg-white p-6 rounded-xl shadow-sm border flex flex-col md:flex-row justify-between items-center gap-6 hover:shadow-md transition-shadow">
                  <div className="flex-1 w-full">
                    <div className="flex justify-between items-center mb-4">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 bg-slate-100 rounded-full flex items-center justify-center font-bold text-slate-600 text-xs">
                          {flight.airlineCode}
                        </div>
                        <span className="font-semibold text-[var(--color-brand-navy)]">{flight.airline}</span>
                        <span className="text-xs text-slate-400 ml-2">{flight.flightNumber}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-sm font-medium text-slate-500">{flight.cabinClass}</span>
                        <div className="text-xs text-slate-400 mt-1">{flight.baggageAllowance} baggage</div>
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <div className="text-center min-w-16">
                        <div className="text-xl font-bold text-[var(--color-brand-navy)]">{flight.departureTime}</div>
                        <div className="text-sm font-medium text-slate-500">{flight.origin}</div>
                      </div>
                      <div className="flex-1 px-8 relative flex flex-col items-center">
                        <div className="text-xs font-medium text-slate-400 mb-1">{flight.duration}</div>
                        <div className="w-full border-t-2 border-slate-200 relative">
                          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-3 py-0.5 rounded-full border border-slate-200 text-xs font-medium text-slate-500">
                            {flight.stops === 0 ? "Direct" : `${flight.stops} Stop${flight.stops > 1 ? "s" : ""}`}
                          </div>
                        </div>
                      </div>
                      <div className="text-center min-w-16">
                        <div className="text-xl font-bold text-[var(--color-brand-navy)]">{flight.arrivalTime}</div>
                        <div className="text-sm font-medium text-slate-500">{flight.destination}</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="w-full md:w-auto md:border-l md:pl-6 flex flex-col items-end justify-center min-w-48">
                    <div className="text-2xl font-bold text-[var(--color-brand-green)] mb-1">
                      ₦{flight.price.toLocaleString()}
                    </div>
                    <div className="text-xs text-slate-500 mb-4">Total for all travelers</div>
                    <Link href={`/flights/book?offer=${flight.id}`} className="w-full">
                      <Button className="w-full bg-[var(--color-brand-navy)] hover:bg-slate-800">
                        Select Flight
                      </Button>
                    </Link>
                  </div>
               </div>
             ))}

             {flights.length === 0 && (
               <div className="text-center py-16 bg-white rounded-xl border border-dashed border-slate-300">
                 <PlaneTakeoff className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                 <h3 className="text-lg font-bold text-slate-700 mb-2">No flights found</h3>
                 <p className="text-slate-500">Try adjusting your search filters or dates.</p>
                 <Link href="/flights">
                   <Button variant="outline" className="mt-4">Reset Search</Button>
                 </Link>
               </div>
             )}
          </div>
        </div>
      </div>
    </div>
  );
}


