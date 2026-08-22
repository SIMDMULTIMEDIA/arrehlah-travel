import type { Metadata } from "next";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Globe, FileText, CheckCircle2 } from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Visa Services in Kano, Nigeria",
  description: "Expert visa assistance in Kano for Dubai, Saudi Arabia, UK, USA, and Schengen countries. Fast processing and reliable support by Arrehlah Travel & Tours.",
  alternates: { canonical: "/visa" }
};

export default function VisaPage() {
  const popularVisas = [
    { country: "UAE (Dubai)", time: "2-3 Days", type: "Tourist / Transit" },
    { country: "Saudi Arabia", time: "24 Hours", type: "Tourist / Umrah" },
    { country: "Turkey", time: "3-5 Days", type: "Tourist / Business" },
    { country: "Schengen", time: "14-21 Days", type: "Tourist / Business" },
    { country: "UK", time: "15-21 Days", type: "Standard Visitor" },
    { country: "USA", time: "Varies", type: "B1/B2" },
  ];

  return (
    <div className="bg-slate-50 min-h-screen pb-20">
      <div className="bg-[var(--color-brand-navy)] py-20 text-center px-4">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">Visa Application Services</h1>
        <p className="text-lg text-slate-300 max-w-2xl mx-auto mb-8">Expert assistance for all your visa applications. Fast, reliable, and transparent.</p>
        
        <div className="bg-white rounded-full p-2 max-w-xl mx-auto flex">
          <Input placeholder="Search destination country..." className="border-0 focus-visible:ring-0 shadow-none" />
          <Button className="rounded-full px-6">Search</Button>
        </div>
      </div>

      <div className="container mx-auto px-4 mt-16">
        <h2 className="text-2xl font-bold text-[var(--color-brand-navy)] mb-8 text-center">Popular Destinations</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {popularVisas.map((visa, i) => (
            <div key={i} className="bg-white rounded-xl shadow-sm border p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-4 mb-4">
                <div className="h-12 w-12 rounded-full bg-slate-100 flex items-center justify-center text-[var(--color-brand-green)]">
                  <Globe className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-[var(--color-brand-navy)]">{visa.country}</h3>
                  <p className="text-sm text-slate-500">{visa.type}</p>
                </div>
              </div>
              <div className="flex justify-between items-center pt-4 border-t">
                <div className="text-sm text-slate-600">
                  <span className="block text-xs text-slate-400">Processing Time</span>
                  <span className="font-semibold">{visa.time}</span>
                </div>
                <Link href={`/visa/apply?country=${visa.country}`}>
                  <Button variant="outline" size="sm">Apply Now</Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}


