import type { Metadata } from "next";
import { Button } from "@/components/ui/button";
import { Star, MapPin, CheckCircle2 } from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Umrah Packages from Nigeria",
  description: "Book your Umrah package from Kano, Nigeria with Arrehlah Travel & Tours. We handle visas, flights, hotels, and transport for a seamless spiritual journey.",
  alternates: { canonical: "/umrah" }
};

export default function UmrahPage() {
  const packages = [
    { name: 'Economy Package', nights: 14, price: '₦1,800,000', makkah: "3 Star Hotel (1000m)", madinah: "3 Star Hotel (500m)" },
    { name: 'Standard Package', nights: 14, price: '₦2,500,000', popular: true, makkah: "4 Star Hotel (500m)", madinah: "4 Star Hotel (250m)" },
    { name: 'Premium Package', nights: 10, price: '₦4,200,000', makkah: "5 Star Hotel (Haram View)", madinah: "5 Star Hotel (Haram View)" },
  ];

  return (
    <div className="bg-slate-50 min-h-screen">
      <div className="relative h-[400px] flex items-center justify-center">
        <div 
          className="absolute inset-0 z-0 bg-slate-900"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?q=80&w=2070&auto=format&fit=crop')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="absolute inset-0 bg-black/60" />
        </div>
        <div className="container relative z-10 mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Premium Umrah Packages</h1>
          <p className="text-lg text-slate-200 max-w-2xl mx-auto">Perform your Umrah with peace of mind. We handle your visas, flights, and accommodation near the Haramain.</p>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {packages.map((pkg, i) => (
            <div key={i} className={`rounded-2xl border bg-white p-8 relative flex flex-col ${pkg.popular ? 'shadow-xl ring-2 ring-[var(--color-brand-gold)] scale-105' : 'shadow-sm'}`}>
              {pkg.popular && (
                <div className="absolute top-0 right-8 -translate-y-1/2 bg-[var(--color-brand-gold)] text-[var(--color-brand-navy)] text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">
                  Most Popular
                </div>
              )}
              <h3 className="text-2xl font-bold text-[var(--color-brand-navy)] mb-2">{pkg.name}</h3>
              <div className="flex items-baseline gap-2 mb-6">
                <span className="text-3xl font-extrabold text-[var(--color-brand-green)]">{pkg.price}</span>
              </div>
              
              <div className="flex-1 space-y-4 mb-8">
                <div className="bg-slate-50 p-3 rounded-lg mb-4">
                  <p className="text-sm font-semibold text-[var(--color-brand-navy)] mb-1">Makkah Accommodation</p>
                  <p className="text-sm text-slate-600 flex items-center gap-1"><MapPin className="h-3 w-3" /> {pkg.makkah}</p>
                </div>
                <div className="bg-slate-50 p-3 rounded-lg mb-6">
                  <p className="text-sm font-semibold text-[var(--color-brand-navy)] mb-1">Madinah Accommodation</p>
                  <p className="text-sm text-slate-600 flex items-center gap-1"><MapPin className="h-3 w-3" /> {pkg.madinah}</p>
                </div>

                <ul className="space-y-3">
                  <li className="flex items-start gap-3 text-sm text-slate-600">
                    <CheckCircle2 className="h-5 w-5 text-[var(--color-brand-green)] shrink-0" />
                    {pkg.nights} Nights Total
                  </li>
                  <li className="flex items-start gap-3 text-sm text-slate-600">
                    <CheckCircle2 className="h-5 w-5 text-[var(--color-brand-green)] shrink-0" />
                    Return Flight from Kano/Abuja/Lagos
                  </li>
                  <li className="flex items-start gap-3 text-sm text-slate-600">
                    <CheckCircle2 className="h-5 w-5 text-[var(--color-brand-green)] shrink-0" />
                    Umrah Visa & Processing
                  </li>
                  <li className="flex items-start gap-3 text-sm text-slate-600">
                    <CheckCircle2 className="h-5 w-5 text-[var(--color-brand-green)] shrink-0" />
                    Guided Ziyarah Tours
                  </li>
                  <li className="flex items-start gap-3 text-sm text-slate-600">
                    <CheckCircle2 className="h-5 w-5 text-[var(--color-brand-green)] shrink-0" />
                    Air-conditioned Ground Transport
                  </li>
                </ul>
              </div>

              <Link href={`/umrah/register?package=${encodeURIComponent(pkg.name)}`}>
                <Button className="w-full h-12" variant={pkg.popular ? 'default' : 'outline'}>
                  Book This Package
                </Button>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}


