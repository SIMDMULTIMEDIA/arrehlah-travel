import { Building, Globe2, Users, ShieldCheck } from "lucide-react";

export const metadata = {
  title: "About Us | Arrehlah Travel",
  description: "Learn more about Arrehlah Travel & Tours Ltd, your trusted travel partner in Kano."
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-slate-50 py-12 lg:py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
        <div className="bg-white rounded-2xl shadow-sm p-8 md:p-12 border border-slate-100">
          <h1 className="text-3xl md:text-5xl font-bold text-[var(--color-brand-navy)] mb-6">
            About Arrehlah Travel & Tours
          </h1>
          <div className="prose prose-lg text-slate-600 max-w-none mb-12">
            <p className="mb-6">
              Welcome to <strong>Arrehlah Travel & Tours Ltd</strong>, your trusted gateway to the world. Based in the heart of Kano, Nigeria, we specialize in providing premium, hassle-free travel solutions for individuals, families, and corporate clients.
            </p>
            <p className="mb-6">
              Our name "Arrehlah" translates to "The Journey," and that is exactly what we are dedicated to perfecting. Whether you are planning a spiritual pilgrimage for Hajj or Umrah, booking a much-needed vacation, or arranging complex corporate travel, we are committed to making your journey as seamless and memorable as possible.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            <div className="p-6 bg-slate-50 rounded-xl border border-slate-100">
              <div className="w-12 h-12 bg-[var(--color-brand-navy)]/10 rounded-lg flex items-center justify-center mb-4">
                <Globe2 className="h-6 w-6 text-[var(--color-brand-navy)]" />
              </div>
              <h3 className="text-xl font-bold text-[var(--color-brand-navy)] mb-2">Our Mission</h3>
              <p className="text-slate-600">To simplify travel by providing transparent, reliable, and premium services that connect our clients to their dream destinations safely and comfortably.</p>
            </div>
            <div className="p-6 bg-slate-50 rounded-xl border border-slate-100">
              <div className="w-12 h-12 bg-[var(--color-brand-navy)]/10 rounded-lg flex items-center justify-center mb-4">
                <ShieldCheck className="h-6 w-6 text-[var(--color-brand-navy)]" />
              </div>
              <h3 className="text-xl font-bold text-[var(--color-brand-navy)] mb-2">Our Vision</h3>
              <p className="text-slate-600">To be the most trusted and sought-after travel agency in Nigeria, renowned for our exceptional customer service and comprehensive travel solutions.</p>
            </div>
          </div>

          <h2 className="text-2xl font-bold text-[var(--color-brand-navy)] mb-6">Why Choose Us?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
             <div className="flex flex-col gap-2">
                <Users className="h-8 w-8 text-[var(--color-brand-green)]" />
                <h4 className="font-bold text-slate-900">Expert Team</h4>
                <p className="text-sm text-slate-600">Our experienced agents handle all the complex details of your itinerary.</p>
             </div>
             <div className="flex flex-col gap-2">
                <Building className="h-8 w-8 text-[var(--color-brand-green)]" />
                <h4 className="font-bold text-slate-900">Local Presence</h4>
                <p className="text-sm text-slate-600">Easily reach us at our physical office in Kano for face-to-face consultations.</p>
             </div>
             <div className="flex flex-col gap-2">
                <Globe2 className="h-8 w-8 text-[var(--color-brand-green)]" />
                <h4 className="font-bold text-slate-900">Global Reach</h4>
                <p className="text-sm text-slate-600">Partnerships with top airlines and hotels worldwide guarantee the best rates.</p>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
