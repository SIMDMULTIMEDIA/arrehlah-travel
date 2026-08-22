import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Terms of Service",
  description: "Terms of service for Arrehlah Travel & Tours Ltd.",
  alternates: { canonical: "/terms" }
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-slate-50 py-12 lg:py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
        <div className="bg-white rounded-2xl shadow-sm p-8 md:p-12 border border-slate-100">
          <h1 className="text-3xl md:text-5xl font-bold text-[var(--color-brand-navy)] mb-8">
            Terms of Service
          </h1>
          <div className="prose prose-slate max-w-none text-slate-600 space-y-6">
            <p>Last updated: August 2026</p>
            <p>Welcome to Arrehlah Travel & Tours Ltd. By using our website and services, you agree to comply with and be bound by the following terms and conditions.</p>
            
            <h2 className="text-xl font-bold text-slate-900 mt-8 mb-4">1. Booking and Reservations</h2>
            <p>All bookings are subject to availability at the time of reservation. A booking is only confirmed once full or agreed partial payment has been received and you have been issued a booking reference or ticket.</p>
            
            <h2 className="text-xl font-bold text-slate-900 mt-8 mb-4">2. Pricing and Payment</h2>
            <p>Prices are quoted in Nigerian Naira (NGN) unless otherwise stated. Fares, taxes, and exchange rates are subject to change without prior notice until full payment is made and tickets are issued. We accept bank transfers, credit/debit cards, and approved online payment methods.</p>

            <h2 className="text-xl font-bold text-slate-900 mt-8 mb-4">3. Travel Documents (Passports and Visas)</h2>
            <p>It is the passenger's responsibility to ensure they possess valid travel documents. Passports must be valid for at least 6 months from the date of travel. Arrehlah Travel is not liable if a passenger is denied boarding or entry due to incorrect or missing documentation.</p>

            <h2 className="text-xl font-bold text-slate-900 mt-8 mb-4">4. Hajj & Umrah Packages</h2>
            <p>Hajj and Umrah packages are subject to Ministry of Hajj regulations and quota approvals. Changes in Saudi Arabian visa rules, flight schedules, or hotel availability may necessitate adjustments to packages. We will communicate any changes promptly.</p>

            <h2 className="text-xl font-bold text-slate-900 mt-8 mb-4">5. Liability</h2>
            <p>Arrehlah Travel acts as an agent for airlines, hotels, tour operators, and other service providers. We are not liable for personal injury, property damage, flight cancellations, or delays caused by these third-party providers or by force majeure.</p>
          </div>
        </div>
      </div>
    </div>
  );
}



