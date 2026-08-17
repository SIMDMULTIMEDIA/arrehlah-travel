import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";
import Link from "next/link";

export default function HajjPage() {
  return (
    <div className="bg-slate-50 min-h-screen pb-20">
      <div className="bg-[var(--color-brand-navy)] py-20 text-center px-4">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">Hajj Services</h1>
        <p className="text-lg text-slate-300 max-w-2xl mx-auto mb-8">Begin your journey of a lifetime with Arrehlah Travel. Pre-register for the upcoming Hajj season.</p>
        <Button size="lg" className="px-8 bg-[var(--color-brand-gold)] text-[var(--color-brand-navy)] hover:bg-[var(--color-brand-gold-light)]">Pre-Register Now</Button>
      </div>

      <div className="container mx-auto px-4 mt-16 max-w-4xl">
        <div className="bg-white rounded-2xl shadow-sm border p-8 md:p-12">
          <h2 className="text-2xl font-bold text-[var(--color-brand-navy)] mb-6">Why perform Hajj with Arrehlah?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              "Experienced guides and Islamic scholars",
              "Premium accommodation near Jamarat and Haram",
              "VIP transport services during Mashair",
              "Full catering services included",
              "Comprehensive Hajj seminar before departure",
              "Dedicated medical support staff"
            ].map((feature, i) => (
              <div key={i} className="flex items-start gap-3">
                <CheckCircle2 className="h-6 w-6 text-[var(--color-brand-green)] shrink-0" />
                <span className="text-slate-700 font-medium">{feature}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
