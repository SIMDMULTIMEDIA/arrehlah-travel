import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PlaneTakeoff, Hotel, Map, Calendar, Search, ArrowRight, Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import HeroSlider from "@/components/HeroSlider";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[600px] flex items-center justify-center">
        {/* Background Image Slider */}
        <HeroSlider />

        <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8 pt-20 text-center md:text-left">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-white mb-6">
              Your Journey Begins With Arrehlah
            </h1>
            <p className="text-lg md:text-xl text-slate-200 mb-10 max-w-2xl leading-relaxed">
              Flights, hotels, tours, Umrah, Hajj, visas and complete travel solutions from Kano to the world.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              <Link href="/flights">
                <Button size="lg" className="text-base font-semibold px-8 py-6 h-auto w-full sm:w-auto">
                  Start Your Journey
                </Button>
              </Link>
              <Link href="/tours">
                <Button size="lg" variant="outline" className="text-base font-semibold px-8 py-6 h-auto w-full sm:w-auto bg-white/10 text-white border-white/30 hover:bg-white hover:text-[var(--color-brand-navy)]">
                  Explore Packages
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Search Widget */}
      <section className="relative z-20 -mt-24 mb-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-xl shadow-xl p-4 md:p-8">
            {/* Tabs */}
            <div className="flex overflow-x-auto hide-scrollbar gap-2 mb-6 pb-2">
              {[
                { name: "Flights", icon: PlaneTakeoff, href: "/flights" },
                { name: "Hotels", icon: Hotel, href: "/hotels" },
                { name: "Tours", icon: Map, href: "/tours" },
                { name: "Umrah", icon: Star, href: "/umrah" },
                { name: "Visa", icon: Calendar, href: "/visa" },
              ].map((tab, idx) => (
                <Link
                  key={tab.name}
                  href={tab.href}
                  className={`flex items-center gap-2 px-6 py-3 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                    idx === 0 
                      ? "bg-[var(--color-brand-navy)] text-white" 
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  <tab.icon className="h-4 w-4" />
                  {tab.name}
                </Link>
              ))}
            </div>

            {/* Flight Search Form (Default) */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">From</label>
                <div className="relative">
                  <Input placeholder="e.g. Kano (KAN)" className="pl-10" />
                  <PlaneTakeoff className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">To</label>
                <div className="relative">
                  <Input placeholder="e.g. Dubai (DXB)" className="pl-10" />
                  <Map className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Departure</label>
                <div className="relative">
                  <Input type="date" className="pl-10" />
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                </div>
              </div>
              <div>
                <Link href="/flights">
                  <Button className="w-full h-10 gap-2">
                    <Search className="h-4 w-4" />
                    Search Flights
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Destinations */}
      <section className="py-16 bg-slate-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-10">
            <div>
              <h2 className="text-3xl font-bold text-[var(--color-brand-navy)] mb-2">Popular Destinations</h2>
              <p className="text-slate-600">Explore our most requested locations for your next trip.</p>
            </div>
            <Link href="/destinations" className="hidden sm:flex items-center text-[var(--color-brand-green)] font-medium hover:underline">
              View all <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {['Dubai, UAE', 'London, UK', 'Jeddah, KSA', 'Cairo, Egypt'].map((dest, i) => (
              <Link key={i} href="/tours" className="group relative rounded-2xl overflow-hidden cursor-pointer h-72 shadow-sm hover:shadow-xl transition-all duration-300 block">
                <div className="absolute inset-0 bg-slate-900">
                  <img 
                    src={`https://images.unsplash.com/photo-1518684079-3c830dcef090?q=80&w=600&auto=format&fit=crop&sig=${i}`}
                    alt={dest}
                    className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute bottom-0 left-0 p-6">
                  <h3 className="text-xl font-bold text-white mb-1">{dest}</h3>
                  <p className="text-sm text-slate-300">Explore tours & flights</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Umrah Packages */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-bold text-[var(--color-brand-navy)] mb-4">Premium Umrah Packages</h2>
            <p className="text-slate-600">Experience a spiritual journey with complete peace of mind. We handle your visas, flights, and premium accommodation near the Haramain.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { name: 'Economy Package', nights: 14, price: '₦1,800,000' },
              { name: 'Standard Package', nights: 14, price: '₦2,500,000', popular: true },
              { name: 'VIP Package', nights: 10, price: '₦4,200,000' },
            ].map((pkg, i) => (
              <div key={i} className={`rounded-2xl border bg-white p-8 relative ${pkg.popular ? 'shadow-xl ring-2 ring-[var(--color-brand-gold)]' : 'shadow-sm'}`}>
                {pkg.popular && (
                  <div className="absolute top-0 right-8 -translate-y-1/2 bg-[var(--color-brand-gold)] text-[var(--color-brand-navy)] text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">
                    Most Popular
                  </div>
                )}
                <h3 className="text-2xl font-bold text-[var(--color-brand-navy)] mb-2">{pkg.name}</h3>
                <div className="flex items-baseline gap-2 mb-6">
                  <span className="text-3xl font-extrabold text-[var(--color-brand-green)]">{pkg.price}</span>
                  <span className="text-slate-500">/ person</span>
                </div>
                
                <ul className="space-y-4 mb-8">
                  <li className="flex items-center gap-3 text-slate-600">
                    <div className="h-2 w-2 rounded-full bg-[var(--color-brand-gold)]" />
                    {pkg.nights} Nights Accommodation
                  </li>
                  <li className="flex items-center gap-3 text-slate-600">
                    <div className="h-2 w-2 rounded-full bg-[var(--color-brand-gold)]" />
                    Return Flight from Kano/Abuja
                  </li>
                  <li className="flex items-center gap-3 text-slate-600">
                    <div className="h-2 w-2 rounded-full bg-[var(--color-brand-gold)]" />
                    Umrah Visa Included
                  </li>
                  <li className="flex items-center gap-3 text-slate-600">
                    <div className="h-2 w-2 rounded-full bg-[var(--color-brand-gold)]" />
                    Premium Ziyarah
                  </li>
                </ul>

                <Link href="/umrah">
                  <Button className="w-full h-12" variant={pkg.popular ? 'default' : 'outline'}>
                    View Details
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-[var(--color-brand-green)]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Ready to plan your next trip?</h2>
          <p className="text-green-100 text-lg mb-10 max-w-2xl mx-auto">
            Chat with our travel experts on WhatsApp or give us a call. We're here to make your travel dreams a reality.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="https://wa.me/2347012345678" target="_blank">
              <Button size="lg" variant="secondary" className="px-8 py-6 text-base font-bold w-full sm:w-auto">
                Chat on WhatsApp
              </Button>
            </Link>
            <Link href="/support">
              <Button size="lg" variant="outline" className="px-8 py-6 text-base font-bold bg-transparent text-white border-white hover:bg-white/10 hover:text-white w-full sm:w-auto">
                Contact Us
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

