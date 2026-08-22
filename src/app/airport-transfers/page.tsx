import { Button } from "@/components/ui/button";
import { Car, Shield, Clock } from "lucide-react";

export const metadata = {
  title: "Airport Transfers | Arrehlah Travel"
};

export default function TransfersPage() {
  return (
    <div className="min-h-screen bg-slate-50 py-12 lg:py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
        <div className="bg-white rounded-2xl shadow-sm p-8 md:p-12 border border-slate-100">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <Car className="h-16 w-16 text-[var(--color-brand-navy)] mx-auto mb-6" />
            <h1 className="text-3xl md:text-5xl font-bold text-[var(--color-brand-navy)] mb-6">
              Airport Transfers
            </h1>
            <p className="text-slate-600 text-lg">
              Start and end your journey with comfort and peace of mind. We provide reliable airport pickup and drop-off services globally.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
             <div className="text-center">
                <div className="bg-slate-50 h-16 w-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Clock className="h-8 w-8 text-[var(--color-brand-green)]" />
                </div>
                <h3 className="font-bold text-lg mb-2">Punctual</h3>
                <p className="text-slate-600 text-sm">Our drivers monitor your flight status to ensure they are there right when you land.</p>
             </div>
             <div className="text-center">
                <div className="bg-slate-50 h-16 w-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Car className="h-8 w-8 text-[var(--color-brand-green)]" />
                </div>
                <h3 className="font-bold text-lg mb-2">Comfortable Fleet</h3>
                <p className="text-slate-600 text-sm">Choose from standard sedans, executive SUVs, or larger vans for group travel.</p>
             </div>
             <div className="text-center">
                <div className="bg-slate-50 h-16 w-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="h-8 w-8 text-[var(--color-brand-green)]" />
                </div>
                <h3 className="font-bold text-lg mb-2">Safe & Secure</h3>
                <p className="text-slate-600 text-sm">Professional, vetted drivers operating in major destinations worldwide.</p>
             </div>
          </div>

          <div className="bg-slate-900 rounded-xl p-8 text-center text-white">
            <h3 className="text-2xl font-bold mb-4">Need a transfer for your upcoming trip?</h3>
            <p className="text-slate-300 mb-6 max-w-lg mx-auto">Contact our support team with your flight itinerary and destination, and we'll arrange the perfect vehicle for you.</p>
            <Button size="lg" className="bg-[var(--color-brand-green)] hover:bg-[var(--color-brand-green)]/90 text-white">
              Request a Transfer
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
