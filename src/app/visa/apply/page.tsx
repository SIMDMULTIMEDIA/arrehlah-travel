import { VisaApplicationForm } from "@/components/visa/VisaApplicationForm";

export default function VisaApplyPage({
  searchParams,
}: {
  searchParams: { country?: string };
}) {
  const destination = searchParams.country || "";

  return (
    <div className="bg-slate-50 min-h-screen py-12 px-4">
      <div className="container mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-[var(--color-brand-navy)] mb-4">
            Visa Application
          </h1>
          <p className="text-slate-600 max-w-xl mx-auto">
            Fill out the form below to start your visa application process. 
            Ensure all details match your passport exactly.
          </p>
        </div>
        
        <VisaApplicationForm initialDestination={destination} />
      </div>
    </div>
  );
}

