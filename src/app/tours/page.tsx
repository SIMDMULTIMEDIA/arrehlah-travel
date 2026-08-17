import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, MapPin, Clock, Calendar } from "lucide-react";
import Link from "next/link";

export default function ToursPage() {
  const tours = [
    { id: 1, title: "Discover Dubai - 5 Days", dest: "Dubai, UAE", days: 5, price: "₦650,000", image: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?q=80&w=800&auto=format&fit=crop" },
    { id: 2, title: "Best of London", dest: "London, UK", days: 7, price: "₦1,200,000", image: "https://images.unsplash.com/photo-1513635269975-59693e0cd156?q=80&w=800&auto=format&fit=crop" },
    { id: 3, title: "Egyptian Wonders", dest: "Cairo, Egypt", days: 6, price: "₦750,000", image: "https://images.unsplash.com/photo-1539667468225-eebb663053e6?q=80&w=800&auto=format&fit=crop" },
  ];

  return (
    <div className="bg-slate-50 min-h-screen">
      <div className="bg-[var(--color-brand-navy)] py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-bold text-white mb-4">Explore Tour Packages</h1>
          <p className="text-slate-300 mb-8 max-w-2xl mx-auto">Discover handpicked experiences and unforgettable journeys around the globe.</p>
          
          <div className="bg-white rounded-full shadow-lg p-2 max-w-3xl mx-auto flex items-center">
             <div className="flex-1 flex items-center px-4 border-r">
               <MapPin className="h-5 w-5 text-slate-400 mr-2" />
               <input type="text" placeholder="Where do you want to go?" className="w-full h-10 outline-none text-slate-700" />
             </div>
             <Button className="rounded-full px-8 ml-2">Search</Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {tours.map(tour => (
            <div key={tour.id} className="bg-white rounded-2xl overflow-hidden shadow-sm border group hover:shadow-xl transition-all">
              <div className="h-56 relative overflow-hidden">
                <img src={tour.image} alt={tour.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-sm font-bold text-[var(--color-brand-navy)]">
                  {tour.price}
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-[var(--color-brand-navy)] mb-2 group-hover:text-[var(--color-brand-green)] transition-colors">{tour.title}</h3>
                <div className="flex items-center text-slate-500 text-sm mb-4 gap-4">
                  <span className="flex items-center gap-1"><MapPin className="h-4 w-4" /> {tour.dest}</span>
                  <span className="flex items-center gap-1"><Clock className="h-4 w-4" /> {tour.days} Days</span>
                </div>
                <p className="text-slate-600 text-sm mb-6 line-clamp-2">
                  Experience the best of {tour.dest} with our carefully curated itinerary including accommodation, transfers, and guided tours.
                </p>
                <Link href={`/tours/${tour.id}`}>
                  <Button className="w-full" variant="outline">View Details</Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
