export const metadata = {
  title: "Refund Policy | Arrehlah Travel"
};

export default function RefundPage() {
  return (
    <div className="min-h-screen bg-slate-50 py-12 lg:py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
        <div className="bg-white rounded-2xl shadow-sm p-8 md:p-12 border border-slate-100">
          <h1 className="text-3xl md:text-5xl font-bold text-[var(--color-brand-navy)] mb-8">
            Refund & Cancellation Policy
          </h1>
          <div className="prose prose-slate max-w-none text-slate-600 space-y-6">
            <p>We understand that travel plans can change. Our refund and cancellation policies are designed to be as transparent as possible, though they are largely governed by the policies of the airlines, hotels, and service providers we partner with.</p>

            <h2 className="text-xl font-bold text-slate-900 mt-8 mb-4">Flight Tickets</h2>
            <p>Refundability depends entirely on the fare rules of the airline ticket purchased. Non-refundable tickets cannot be refunded under any circumstances. For refundable tickets, airlines usually charge a cancellation fee. Arrehlah Travel also applies a standard processing fee for all flight refunds.</p>

            <h2 className="text-xl font-bold text-slate-900 mt-8 mb-4">Hotel and Tour Bookings</h2>
            <p>Cancellations made before the supplier's penalty deadline will be refunded minus our processing fee. Cancellations made within the penalty period (usually 24-72 hours before check-in, though some properties have strict no-refund policies) will incur charges up to 100% of the booking value.</p>

            <h2 className="text-xl font-bold text-slate-900 mt-8 mb-4">Visas</h2>
            <p>Visa application fees are <strong>strictly non-refundable</strong> once the application has been submitted to the respective embassy or immigration authority, regardless of whether the visa is approved or rejected.</p>

            <h2 className="text-xl font-bold text-slate-900 mt-8 mb-4">Hajj & Umrah</h2>
            <p>Due to the strict regulations and upfront commitments required for Hajj and Umrah packages, a specific cancellation schedule applies. Cancellations made close to the departure date may result in a 100% loss of funds. Please refer to your specific Hajj/Umrah contract for exact timelines.</p>

            <h2 className="text-xl font-bold text-slate-900 mt-8 mb-4">Refund Processing Time</h2>
            <p>Approved refunds are processed back to the original payment method. Please allow 14-21 working days for flight refunds (as they must be processed by the airline first), and 7-14 working days for other services.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
