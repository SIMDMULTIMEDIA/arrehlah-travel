import HotelBookingForm from "@/components/hotels/HotelBookingForm";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { Metadata } from "next";
import { createClient } from "@supabase/supabase-js";

export const metadata: Metadata = {
  title: "Book Hotel - Arrehlah Travel",
  description: "Book your hotel with Arrehlah Travel.",
};

export const revalidate = 60;

async function getHotels() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { data, error } = await supabase
    .from("Hotel")
    .select("id, name")
    .eq("isActive", true);

  if (error) {
    console.error("Error fetching hotels:", error);
    return [];
  }
  return data || [];
}

export default async function HotelBookingPage({
  searchParams,
}: {
  searchParams: { hotelId?: string };
}) {
  const hotelId = searchParams.hotelId;
  const hotels = await getHotels();

  return (
    <div className="bg-slate-50 min-h-screen py-12">
      <div className="container mx-auto px-4 max-w-5xl">
        <Link 
          href="/hotels" 
          className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-[var(--color-brand-navy)] mb-8 transition"
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Back to Hotels
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          <div className="lg:col-span-5">
            <h1 className="text-3xl md:text-4xl font-bold text-[var(--color-brand-navy)] mb-6">
              Hotel Booking
            </h1>
            <p className="text-slate-600 text-lg mb-8">
              Complete this form to reserve your room. Our agents will process your request and reach out to finalize the details.
            </p>
            
            <div className="bg-white p-6 rounded-xl border shadow-sm">
              <h3 className="font-bold text-lg mb-4 text-[var(--color-brand-navy)]">What happens next?</h3>
              <div className="space-y-4">
                {[
                  "Submit your booking request",
                  "Our team checks availability for your dates",
                  "We contact you with a confirmation and payment link",
                  "Receive your hotel voucher",
                  "Enjoy your stay!"
                ].map((step, i) => (
                  <div key={i} className="flex gap-3">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-[var(--color-brand-green)] text-white flex items-center justify-center font-bold text-sm">
                      {i + 1}
                    </div>
                    <span className="text-slate-700">{step}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-7">
            <HotelBookingForm initialHotelId={hotelId} hotels={hotels} />
          </div>

        </div>
      </div>
    </div>
  );
}
