import Link from "next/link";
import { Plane, MapPin, Phone, Mail } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-[var(--color-brand-navy)] text-white pt-16 pb-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div>
            <Link href="/" className="flex items-center gap-2 mb-6">
              <img src="/logo.png" alt="Arrehlah Travel Logo" className="h-16 w-auto bg-white p-2 rounded" />
            </Link>
            <p className="text-slate-300 mb-6 text-sm leading-relaxed">
              Premium travel services from Kano to the world. Flights, hotels, tours, Umrah, Hajj, and visas with complete peace of mind.
            </p>
            <div className="flex gap-4">
              <a href="#" className="text-slate-300 hover:text-[var(--color-brand-gold)] transition-colors" aria-label="Facebook">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"/></svg>
              </a>
              <a href="#" className="text-slate-300 hover:text-[var(--color-brand-gold)] transition-colors" aria-label="Twitter">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"/></svg>
              </a>
              <a href="#" className="text-slate-300 hover:text-[var(--color-brand-gold)] transition-colors" aria-label="Instagram">
                <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-6 text-[var(--color-brand-gold)]">Quick Links</h3>
            <ul className="space-y-3">
              <li><Link href="/about" className="text-slate-300 hover:text-white transition-colors text-sm">About Us</Link></li>
              <li><Link href="/flights" className="text-slate-300 hover:text-white transition-colors text-sm">Book Flights</Link></li>
              <li><Link href="/hotels" className="text-slate-300 hover:text-white transition-colors text-sm">Find Hotels</Link></li>
              <li><Link href="/tours" className="text-slate-300 hover:text-white transition-colors text-sm">Tour Packages</Link></li>
              <li><Link href="/offers" className="text-slate-300 hover:text-white transition-colors text-sm">Special Offers</Link></li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-lg font-semibold mb-6 text-[var(--color-brand-gold)]">Our Services</h3>
            <ul className="space-y-3">
              <li><Link href="/umrah" className="text-slate-300 hover:text-white transition-colors text-sm">Umrah Packages</Link></li>
              <li><Link href="/hajj" className="text-slate-300 hover:text-white transition-colors text-sm">Hajj Services</Link></li>
              <li><Link href="/visa" className="text-slate-300 hover:text-white transition-colors text-sm">Visa Application</Link></li>
              <li><Link href="/airport-transfers" className="text-slate-300 hover:text-white transition-colors text-sm">Airport Transfers</Link></li>
              <li><Link href="/travel-insurance" className="text-slate-300 hover:text-white transition-colors text-sm">Travel Insurance</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold mb-6 text-[var(--color-brand-gold)]">Contact Us</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-[var(--color-brand-green)] shrink-0 mt-0.5" />
                <span className="text-slate-300 text-sm">123 Travel Avenue, Central Business District, Kano, Nigeria</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-[var(--color-brand-green)] shrink-0" />
                <span className="text-slate-300 text-sm">+234 800 ARREHLAH</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-[var(--color-brand-green)] shrink-0" />
                <span className="text-slate-300 text-sm">info@arrehlah.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-slate-400 text-sm text-center md:text-left">
            &copy; {new Date().getFullYear()} Arrehlah Travel & Tours Ltd. All rights reserved.
          </p>
          <div className="flex gap-6">
            <Link href="/terms" className="text-slate-400 hover:text-white text-sm transition-colors">Terms of Service</Link>
            <Link href="/privacy" className="text-slate-400 hover:text-white text-sm transition-colors">Privacy Policy</Link>
            <Link href="/refund-policy" className="text-slate-400 hover:text-white text-sm transition-colors">Refund Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
