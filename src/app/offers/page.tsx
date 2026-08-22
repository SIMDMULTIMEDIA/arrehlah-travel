import { Button } from "@/components/ui/button";
import { Tag, PlaneTakeoff, Hotel } from "lucide-react";

export const metadata = {
  title: "Special Offers | Arrehlah Travel"
};

export default function OffersPage() {
  return (
    <div className="min-h-screen bg-slate-50 py-12 lg:py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h1 className="text-3xl md:text-5xl font-bold text-[var(--color-brand-navy)] mb-6">
            Special Offers & Deals
          </h1>
          <p className="text-slate-600 text-lg">
            Discover our latest promotions, discounted flights, and exclusive holiday packages. Book early to secure the best rates!
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Offer 1 */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden flex flex-col">
            <div className="h-48 bg-slate-200 relative">
              <img src="https://images.unsplash.com/photo-1518684079-3c830dcef090?q=80&w=600&auto=format&fit=crop" alt="Dubai" className="w-full h-full object-cover" />
              <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 text-sm font-bold rounded-full">-15% OFF</div>
            </div>
            <div className="p-6 flex-1 flex flex-col">
              <div className="flex items-center gap-2 text-sm text-[var(--color-brand-green)] font-semibold mb-2">
                <Tag className="h-4 w-4" /> Summer Special
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Dubai Family Getaway</h3>
              <p className="text-slate-600 text-sm mb-6 flex-1">Includes return flights from Kano, 5 nights at a 4-star hotel, desert safari, and UAE visas for a family of four.</p>
              <Button className="w-full">Claim Offer</Button>
            </div>
          </div>

          {/* Offer 2 */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden flex flex-col">
            <div className="h-48 bg-slate-200 relative">
              <img src="https://images.unsplash.com/photo-1436491865332-7a61a109cc05?q=80&w=600&auto=format&fit=crop" alt="Flights" className="w-full h-full object-cover" />
              <div className="absolute top-4 left-4 bg-[var(--color-brand-gold)] text-[var(--color-brand-navy)] px-3 py-1 text-sm font-bold rounded-full">EARLY BIRD</div>
            </div>
            <div className="p-6 flex-1 flex flex-col">
              <div className="flex items-center gap-2 text-sm text-[var(--color-brand-green)] font-semibold mb-2">
                <PlaneTakeoff className="h-4 w-4" /> Flight Deal
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">London Direct Flights</h3>
              <p className="text-slate-600 text-sm mb-6 flex-1">Book your December flights to London now and lock in lower fares before the holiday rush.</p>
              <Button className="w-full">Search Flights</Button>
            </div>
          </div>

          {/* Offer 3 */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden flex flex-col">
            <div className="h-48 bg-slate-200 relative">
              <img src="https://images.unsplash.com/photo-1563911302283-d2bc129e7570?q=80&w=600&auto=format&fit=crop" alt="Hotel" className="w-full h-full object-cover" />
            </div>
            <div className="p-6 flex-1 flex flex-col">
              <div className="flex items-center gap-2 text-sm text-[var(--color-brand-green)] font-semibold mb-2">
                <Hotel className="h-4 w-4" /> Staycation
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Abuja Weekend Retreat</h3>
              <p className="text-slate-600 text-sm mb-6 flex-1">Enjoy a luxury weekend stay at partner hotels in Abuja with complimentary breakfast and late check-out.</p>
              <Button className="w-full">Book Hotel</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
