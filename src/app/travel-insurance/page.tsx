import type { Metadata } from "next";
import { Button } from "@/components/ui/button";
import { ShieldAlert, HeartPulse, Luggage, PlaneTakeoff, Clock } from "lucide-react";

export default function InsurancePage() {
  return (
    <div className="min-h-screen bg-slate-50 py-12 lg:py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
        <div className="bg-white rounded-2xl shadow-sm p-8 md:p-12 border border-slate-100">
          <div className="flex flex-col md:flex-row items-center gap-12 mb-12">
            <div className="flex-1">
              <h1 className="text-3xl md:text-5xl font-bold text-[var(--color-brand-navy)] mb-6">
                Travel Insurance
              </h1>
              <p className="text-slate-600 text-lg mb-6">
                Travel with confidence knowing you are protected against the unexpected. From medical emergencies to trip cancellations, our comprehensive travel insurance plans have you covered.
              </p>
              <Button size="lg">Get a Quote</Button>
            </div>
            <div className="w-full md:w-1/3 flex justify-center">
               <ShieldAlert className="h-48 w-48 text-[var(--color-brand-green)] opacity-20" />
            </div>
          </div>

          <h2 className="text-2xl font-bold text-[var(--color-brand-navy)] mb-8">What's typically covered?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <div className="flex gap-4 p-6 bg-slate-50 rounded-xl">
                <HeartPulse className="h-8 w-8 text-red-500 shrink-0" />
                <div>
                  <h3 className="font-bold text-lg mb-1">Medical Emergencies</h3>
                  <p className="text-slate-600 text-sm">Coverage for unexpected illness or injury abroad, including hospitalization and emergency medical evacuation.</p>
                </div>
             </div>
             <div className="flex gap-4 p-6 bg-slate-50 rounded-xl">
                <PlaneTakeoff className="h-8 w-8 text-blue-500 shrink-0" />
                <div>
                  <h3 className="font-bold text-lg mb-1">Trip Cancellation</h3>
                  <p className="text-slate-600 text-sm">Reimbursement for non-refundable expenses if you have to cancel your trip due to covered reasons like illness or family emergencies.</p>
                </div>
             </div>
             <div className="flex gap-4 p-6 bg-slate-50 rounded-xl">
                <Luggage className="h-8 w-8 text-amber-500 shrink-0" />
                <div>
                  <h3 className="font-bold text-lg mb-1">Baggage Loss or Delay</h3>
                  <p className="text-slate-600 text-sm">Compensation for lost, stolen, or damaged luggage, as well as funds to buy essentials if your bags are delayed.</p>
                </div>
             </div>
             <div className="flex gap-4 p-6 bg-slate-50 rounded-xl">
                <Clock className="h-8 w-8 text-purple-500 shrink-0" />
                <div>
                  <h3 className="font-bold text-lg mb-1">Flight Delays</h3>
                  <p className="text-slate-600 text-sm">Coverage for meals and accommodation if your flight is significantly delayed or cancelled.</p>
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}


