"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { submitVisaApplication } from "@/app/actions/visa";
import Link from "next/link";
import { CheckCircle2 } from "lucide-react";

export function VisaApplicationForm({ initialDestination }: { initialDestination: string }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successRef, setSuccessRef] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const formData = new FormData(event.currentTarget);
    const result = await submitVisaApplication(formData);

    if (result.success) {
      setSuccessRef(result.applicationReference || "UNKNOWN");
    } else {
      setError(result.error || "An error occurred");
    }
    
    setIsSubmitting(false);
  }

  if (successRef) {
    return (
      <div className="bg-white p-8 rounded-xl shadow-sm border text-center max-w-lg mx-auto mt-12">
        <div className="flex justify-center mb-6">
          <CheckCircle2 className="h-16 w-16 text-green-500" />
        </div>
        <h2 className="text-2xl font-bold text-[var(--color-brand-navy)] mb-4">Application Submitted!</h2>
        <p className="text-slate-600 mb-6">
          Thank you for applying. Your visa application has been received successfully.
        </p>
        <div className="bg-slate-50 p-4 rounded-lg mb-8">
          <p className="text-sm text-slate-500 mb-1">Your Reference Number</p>
          <p className="text-xl font-bold font-mono text-[var(--color-brand-navy)]">{successRef}</p>
        </div>
        <p className="text-sm text-slate-500 mb-8">
          One of our visa agents will contact you shortly with the next steps and document requirements.
        </p>
        <Link href="/visa">
          <Button className="w-full">Return to Visa Services</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 md:p-8 rounded-xl shadow-sm border max-w-2xl mx-auto mt-12">
      <h2 className="text-2xl font-bold text-[var(--color-brand-navy)] mb-6">Visa Application Form</h2>
      
      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label htmlFor="destination" className="text-sm font-medium text-slate-700">Destination Country</label>
            <Input id="destination" name="destination" defaultValue={initialDestination} required placeholder="e.g. UAE, Saudi Arabia, UK" />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="visaType" className="text-sm font-medium text-slate-700">Visa Type</label>
            <select 
              id="visaType" 
              name="visaType" 
              required
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <option value="">Select a visa type...</option>
              <option value="Tourist">Tourist Visa</option>
              <option value="Business">Business Visa</option>
              <option value="Transit">Transit Visa</option>
              <option value="Student">Student Visa</option>
              <option value="Umrah">Umrah Visa</option>
              <option value="Other">Other</option>
            </select>
          </div>
        </div>

        <div className="border-t pt-6 mt-6">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">Personal Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label htmlFor="firstName" className="text-sm font-medium text-slate-700">First Name</label>
              <Input id="firstName" name="firstName" required />
            </div>
            <div className="space-y-2">
              <label htmlFor="lastName" className="text-sm font-medium text-slate-700">Last Name</label>
              <Input id="lastName" name="lastName" required />
            </div>
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium text-slate-700">Email Address</label>
              <Input id="email" name="email" type="email" required />
            </div>
            <div className="space-y-2">
              <label htmlFor="phone" className="text-sm font-medium text-slate-700">Phone Number</label>
              <Input id="phone" name="phone" type="tel" required />
            </div>
            <div className="space-y-2 md:col-span-2">
              <label htmlFor="passportNumber" className="text-sm font-medium text-slate-700">Passport Number</label>
              <Input id="passportNumber" name="passportNumber" required />
            </div>
          </div>
        </div>

        <div className="border-t pt-6 mt-6">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">Travel Details</h3>
          <div className="grid grid-cols-1 gap-6">
            <div className="space-y-2">
              <label htmlFor="travelDate" className="text-sm font-medium text-slate-700">Expected Travel Date</label>
              <Input id="travelDate" name="travelDate" type="date" required />
            </div>
            <div className="space-y-2">
              <label htmlFor="notes" className="text-sm font-medium text-slate-700">Additional Notes (Optional)</label>
              <textarea 
                id="notes" 
                name="notes" 
                rows={4}
                className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                placeholder="Any special requirements or previous visa rejections?"
              ></textarea>
            </div>
          </div>
        </div>

        <Button type="submit" className="w-full h-12 text-lg mt-8" disabled={isSubmitting}>
          {isSubmitting ? "Submitting Application..." : "Submit Application"}
        </Button>
      </form>
    </div>
  );
}
