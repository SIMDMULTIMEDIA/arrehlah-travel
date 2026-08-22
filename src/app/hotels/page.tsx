import type { Metadata } from "next";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Map, Calendar, Users, Search, Star } from "lucide-react";
import Link from "next/link";
import { createClient } from "@supabase/supabase-js";

export const revalidate = 60; // Revalidate every minute

async function getHotels() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !supabaseKey) {
    console.warn('Supabase credentials missing – returning empty hotel list');
    return [];
  }
  const supabase = createClient(supabaseUrl, supabaseKey);

  const { data, error } = await supabase
    .from("Hotel")
    .select(`
      id,
      name,
      address,
      rating,
      description,
      Destination ( name )
    `)
    .eq("isActive", true);

  if (error) {
    console.error("Error fetching hotels:", error);
    return [];
  }
  return data;
}

export default async function HotelsPage() {
  const hotels = await getHotels();

  return (
    <div className="bg-slate-50 min-h-screen">
      {/* Search Header */}
      <div className="bg-[var(--color-brand-navy)] py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-white mb-6">Find Hotels</h1>
          
          <div className="bg-white rounded-xl shadow-lg p-6">
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
                <div className="lg:col-span-1">
                  <label className="block text-sm font-medium text-slate-700 mb-1">Destination</label>
                  <div className="relative">
                    <Input placeholder="City or Hotel Name" className="pl-10" />
                    <Map className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  </div>
                </div>
                <div className="lg:col-span-1">
                  <label className="block text-sm font-medium text-slate-700 mb-1">Check In - Check Out</label>
                  <div className="relative">
                    <Input type="text" placeholder="Dates" className="pl-10" />
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  </div>
                </div>
                <div className="lg:col-span-1">
                  <label className="block text-sm font-medium text-slate-700 mb-1">Guests & Rooms</label>
                  <div className="relative">
                    <Input placeholder="2 Guests, 1 Room" className="pl-10" />
                    <Users className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  </div>
                </div>
                <div className="lg:col-span-1">
                  <Button className="w-full h-10 gap-2">
                    <Search className="h-4 w-4" />
                    Search
                  </Button>
                </div>
             </div>
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1 space-y-6">
             <div className="bg-white p-6 rounded-xl shadow-sm border">
               <h3 className="font-semibold text-lg mb-4">Filters</h3>
               <div className="mb-6">
                 <h4 className="text-sm font-medium text-slate-700 mb-2">Star Rating</h4>
                 <div className="space-y-2">
                   {[5, 4, 3].map(stars => (
                     <label key={stars} className="flex items-center gap-2 cursor-pointer text-sm">
                       <input type="checkbox" className="rounded text-[var(--color-brand-green)] focus:ring-[var(--color-brand-green)]" />
                       <span className="flex text-amber-400">
                         {Array(stars).fill(0).map((_, i) => <Star key={i} className="h-4 w-4 fill-current" />)}
                       </span>
                     </label>
                   ))}
                 </div>
               </div>
             </div>
          </div>

          {/* Results List */}
          <div className="lg:col-span-3 space-y-6">
             {hotels.map((hotel) => (
               <div key={hotel.id} className="bg-white rounded-xl shadow-sm border overflow-hidden hover:shadow-md transition-shadow flex flex-col md:flex-row">
                  <div className="md:w-1/3 h-48 md:h-auto bg-slate-200 relative">
                    <img src="https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=800&auto=format&fit=crop" className="w-full h-full object-cover" alt={hotel.name} />
                  </div>
                  <div className="p-6 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="text-xl font-bold text-[var(--color-brand-navy)]">{hotel.name}</h3>
                          <div className="flex items-center gap-1 text-amber-400 mb-2">
                            {Array(hotel.rating || 4).fill(0).map((_, i) => <Star key={i} className="h-4 w-4 fill-current" />)}
                          </div>
                        </div>
                        <div className="bg-[var(--color-brand-navy)] text-white text-sm font-bold px-2 py-1 rounded">
                          {hotel.rating ? (hotel.rating * 1.8).toFixed(1) : "8.5"}
                        </div>
                      </div>
                      <p className="text-sm text-slate-500 mb-4 flex items-center gap-1">
                        <Map className="h-4 w-4" /> {hotel.address || "City Center"}
                      </p>
                      <div className="flex gap-2 mb-4 flex-wrap">
                        <span className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded">Free WiFi</span>
                        <span className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded">Pool</span>
                        <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">Free Cancellation</span>
                      </div>
                      <p className="text-sm text-slate-600 line-clamp-2">{hotel.description}</p>
                    </div>
                    
                    <div className="flex justify-between items-end pt-4 border-t mt-4">
                      <div>
                        <div className="text-xs text-slate-500">Starting from</div>
                        <div className="text-xl font-bold text-[var(--color-brand-green)]">₦90,000 <span className="text-xs font-normal text-slate-500">/ night</span></div>
                      </div>
                      <Link href={`/hotels/book?hotelId=${hotel.id}`}>
                        <Button>Book Now</Button>
                      </Link>
                    </div>
                  </div>
               </div>
             ))}
             
             {hotels.length === 0 && (
               <div className="text-center py-12 bg-white rounded-xl border">
                 <p className="text-slate-500">No hotels found matching your criteria.</p>
               </div>
             )}
          </div>
        </div>
      </div>
    </div>
  );
}


