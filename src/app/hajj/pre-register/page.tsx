import HajjRegistrationForm from "@/components/hajj/HajjRegistrationForm";
import { CheckCircle2, ChevronLeft } from "lucide-react";
import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pre-Register for Hajj - Arrehlah Travel",
  description: "Secure your spot for the upcoming Hajj season.",
};

export default function HajjPreRegistrationPage() {
  return (
    <div className="bg-slate-50 min-h-screen py-12">
      <div className="container mx-auto px-4 max-w-5xl">
        <Link 
          href="/hajj" 
          className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-[var(--color-brand-navy)] mb-8 transition"
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Back to Hajj Services
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          <div className="lg:col-span-5">
            <h1 className="text-3xl md:text-4xl font-bold text-[var(--color-brand-navy)] mb-6">
              Hajj Pre-Registration
            </h1>
            <p className="text-slate-600 text-lg mb-8">
              Due to high demand and limited quotas, we highly recommend pre-registering to secure your spot for the upcoming Hajj season.
            </p>
            
            <div className="bg-white p-6 rounded-xl border shadow-sm">
              <h3 className="font-bold text-lg mb-4 text-[var(--color-brand-navy)]">What happens next?</h3>
              <div className="space-y-4">
                {[
                  "Submit your pre-registration details",
                  "Our Hajj consultants will contact you",
                  "Discuss package options and requirements",
                  "Secure your slot with a deposit",
                  "Begin preparation and seminars"
                ].map((step, i) => (
                  <div key={i} className="flex gap-3">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-[var(--color-brand-gold)] text-[var(--color-brand-navy)] flex items-center justify-center font-bold text-sm">
                      {i + 1}
                    </div>
                    <span className="text-slate-700">{step}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-7">
            <HajjRegistrationForm />
          </div>

        </div>
      </div>
    </div>
  );
}

