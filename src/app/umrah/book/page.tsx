import { BookingFlow } from "@/components/booking/BookingFlow";

export default function UmrahBookingPage() {
  return (
    <div className="bg-slate-50 min-h-screen py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-[var(--color-brand-navy)] mb-2">Book Umrah Package</h1>
          <p className="text-slate-600">Complete your booking in a few simple steps.</p>
        </div>
        
        <BookingFlow serviceId="UMRAH-STD-24" serviceType="UMRAH" initialPrice={2500000} />
      </div>
    </div>
  );
}
