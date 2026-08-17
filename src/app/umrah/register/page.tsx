import UmrahRegistrationForm from "@/components/umrah/UmrahRegistrationForm";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Book Umrah Package - Arrehlah Travel",
  description: "Register for your Umrah journey with Arrehlah Travel.",
};

export default function UmrahRegistrationPage({
  searchParams,
}: {
  searchParams: { package?: string };
}) {
  const packageType = searchParams.package;

  return (
    <div className="bg-slate-50 min-h-screen py-12">
      <div className="container mx-auto px-4 max-w-5xl">
        <Link 
          href="/umrah" 
          className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-[var(--color-brand-navy)] mb-8 transition"
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Back to Umrah Packages
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          <div className="lg:col-span-5">
            <h1 className="text-3xl md:text-4xl font-bold text-[var(--color-brand-navy)] mb-6">
              Umrah Registration
            </h1>
            <p className="text-slate-600 text-lg mb-8">
              Fill out the form to secure your {packageType ? <strong className="text-[var(--color-brand-navy)]">{packageType}</strong> : "Umrah package"}.
            </p>
            
            <div className="bg-white p-6 rounded-xl border shadow-sm">
              <h3 className="font-bold text-lg mb-4 text-[var(--color-brand-navy)]">What happens next?</h3>
              <div className="space-y-4">
                {[
                  "Submit your registration details",
                  "Our Umrah team will review your application",
                  "We'll contact you to confirm dates and details",
                  "Process your Umrah visa",
                  "Prepare for your spiritual journey"
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
            <UmrahRegistrationForm initialPackage={packageType} />
          </div>

        </div>
      </div>
    </div>
  );
}
