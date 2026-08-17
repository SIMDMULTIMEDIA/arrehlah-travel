"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { submitFlightBooking } from "@/app/actions/flights";
import { useRouter } from "next/navigation";
import { Plane, AlertCircle } from "lucide-react";

// Form Validation Schema using Zod
const flightBookingSchema = z.object({
  // Offer ID (Hidden)
  offerId: z.string().min(1),
  
  // Primary Traveler
  title: z.string().min(1, "Title is required"),
  firstName: z.string().min(2, "First name is required"),
  middleName: z.string().optional(),
  lastName: z.string().min(2, "Last name is required"),
  dateOfBirth: z.string().min(1, "Date of birth is required"),
  gender: z.string().min(1, "Gender is required"),
  nationality: z.string().min(2, "Nationality is required"),
  
  // Passport
  passportNumber: z.string().min(5, "Passport number is required"),
  passportNationality: z.string().min(2, "Passport nationality is required"),
  passportIssueDate: z.string().min(1, "Issue date is required"),
  passportExpiryDate: z.string().min(1, "Expiry date is required"),
  placeOfIssue: z.string().min(2, "Place of issue is required"),

  // Contact Information
  email: z.string().email("Invalid email address"),
  phone: z.string().min(8, "Phone number is required"),
  emergencyContact: z.string().min(2, "Emergency contact is required"),
}).refine((data) => {
  const expiry = new Date(data.passportExpiryDate);
  const now = new Date();
  // Passport must be valid for at least 6 months
  const sixMonthsFromNow = new Date();
  sixMonthsFromNow.setMonth(now.getMonth() + 6);
  return expiry > sixMonthsFromNow;
}, {
  message: "Passport must be valid for at least 6 months from today",
  path: ["passportExpiryDate"],
});

export type FlightBookingFormValues = z.infer<typeof flightBookingSchema>;

interface FlightBookingFormProps {
  offerId: string;
}

export default function FlightBookingForm({ offerId }: FlightBookingFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FlightBookingFormValues>({
    resolver: zodResolver(flightBookingSchema),
    defaultValues: {
      offerId,
      title: "Mr",
      gender: "Male"
    },
  });

  const onSubmit = (data: FlightBookingFormValues) => {
    setErrorMsg(null);
    startTransition(async () => {
      const result = await submitFlightBooking(data);

      if (result.success && result.bookingReference) {
        // Redirect to confirmation page
        router.push(`/flights/confirmation/${result.bookingReference}`);
      } else {
        setErrorMsg(result.error || "An unexpected error occurred during booking.");
      }
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      
      {errorMsg && (
        <div className="bg-red-50 border border-red-200 text-red-800 p-4 rounded-xl flex items-start gap-3">
          <AlertCircle className="h-5 w-5 mt-0.5 flex-shrink-0" />
          <p className="text-sm font-medium">{errorMsg}</p>
        </div>
      )}

      {/* Primary Traveler */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
        <h2 className="text-xl font-bold text-[var(--color-brand-navy)] mb-6 border-b pb-4">Primary Traveler</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Title <span className="text-red-500">*</span></label>
            <select {...register("title")} className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-[var(--color-brand-navy)] outline-none bg-white">
              <option value="Mr">Mr</option>
              <option value="Mrs">Mrs</option>
              <option value="Ms">Ms</option>
              <option value="Dr">Dr</option>
            </select>
            {errors.title && <p className="text-red-500 text-xs">{errors.title.message}</p>}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">First Name <span className="text-red-500">*</span></label>
            <input {...register("firstName")} className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-[var(--color-brand-navy)] outline-none" placeholder="As on passport" />
            {errors.firstName && <p className="text-red-500 text-xs">{errors.firstName.message}</p>}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Middle Name</label>
            <input {...register("middleName")} className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-[var(--color-brand-navy)] outline-none" placeholder="Optional" />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Last Name <span className="text-red-500">*</span></label>
            <input {...register("lastName")} className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-[var(--color-brand-navy)] outline-none" placeholder="As on passport" />
            {errors.lastName && <p className="text-red-500 text-xs">{errors.lastName.message}</p>}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Date of Birth <span className="text-red-500">*</span></label>
            <input type="date" {...register("dateOfBirth")} className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-[var(--color-brand-navy)] outline-none" />
            {errors.dateOfBirth && <p className="text-red-500 text-xs">{errors.dateOfBirth.message}</p>}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Gender <span className="text-red-500">*</span></label>
            <select {...register("gender")} className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-[var(--color-brand-navy)] outline-none bg-white">
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
            {errors.gender && <p className="text-red-500 text-xs">{errors.gender.message}</p>}
          </div>

          <div className="space-y-2 md:col-span-3">
            <label className="text-sm font-medium text-slate-700">Nationality <span className="text-red-500">*</span></label>
            <input {...register("nationality")} className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-[var(--color-brand-navy)] outline-none" placeholder="e.g. Nigerian" />
            {errors.nationality && <p className="text-red-500 text-xs">{errors.nationality.message}</p>}
          </div>
        </div>
      </div>

      {/* Passport Details */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
        <h2 className="text-xl font-bold text-[var(--color-brand-navy)] mb-6 border-b pb-4">Passport Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Passport Number <span className="text-red-500">*</span></label>
            <input {...register("passportNumber")} className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-[var(--color-brand-navy)] outline-none uppercase" />
            {errors.passportNumber && <p className="text-red-500 text-xs">{errors.passportNumber.message}</p>}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Passport Nationality <span className="text-red-500">*</span></label>
            <input {...register("passportNationality")} className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-[var(--color-brand-navy)] outline-none" />
            {errors.passportNationality && <p className="text-red-500 text-xs">{errors.passportNationality.message}</p>}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Issue Date <span className="text-red-500">*</span></label>
            <input type="date" {...register("passportIssueDate")} className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-[var(--color-brand-navy)] outline-none" />
            {errors.passportIssueDate && <p className="text-red-500 text-xs">{errors.passportIssueDate.message}</p>}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Expiry Date <span className="text-red-500">*</span></label>
            <input type="date" {...register("passportExpiryDate")} className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-[var(--color-brand-navy)] outline-none" />
            {errors.passportExpiryDate && <p className="text-red-500 text-xs">{errors.passportExpiryDate.message}</p>}
          </div>

          <div className="space-y-2 md:col-span-2">
            <label className="text-sm font-medium text-slate-700">Place of Issue <span className="text-red-500">*</span></label>
            <input {...register("placeOfIssue")} className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-[var(--color-brand-navy)] outline-none" placeholder="e.g. Kano, Nigeria" />
            {errors.placeOfIssue && <p className="text-red-500 text-xs">{errors.placeOfIssue.message}</p>}
          </div>
          
          <div className="space-y-2 md:col-span-2 bg-slate-50 p-4 rounded-lg border border-slate-100">
            <p className="text-sm text-slate-500 mb-2 font-medium">Passport Document Upload</p>
            <p className="text-xs text-slate-400">Document upload is optional during this development preview phase. In production, securely uploaded documents will be stored in private, encrypted storage.</p>
          </div>
        </div>
      </div>

      {/* Contact Information */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
        <h2 className="text-xl font-bold text-[var(--color-brand-navy)] mb-6 border-b pb-4">Contact Details</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Email Address <span className="text-red-500">*</span></label>
            <input type="email" {...register("email")} className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-[var(--color-brand-navy)] outline-none" placeholder="For booking confirmation" />
            {errors.email && <p className="text-red-500 text-xs">{errors.email.message}</p>}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Phone Number <span className="text-red-500">*</span></label>
            <input type="tel" {...register("phone")} className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-[var(--color-brand-navy)] outline-none" placeholder="+234 XXX XXXX" />
            {errors.phone && <p className="text-red-500 text-xs">{errors.phone.message}</p>}
          </div>

          <div className="space-y-2 md:col-span-2">
            <label className="text-sm font-medium text-slate-700">Emergency Contact (Name & Phone) <span className="text-red-500">*</span></label>
            <input {...register("emergencyContact")} className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-[var(--color-brand-navy)] outline-none" placeholder="E.g. Fatima Abdullah +234..." />
            {errors.emergencyContact && <p className="text-red-500 text-xs">{errors.emergencyContact.message}</p>}
          </div>
        </div>
      </div>

      {/* Submit */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
        <div className="flex items-start gap-3 mb-6">
          <input type="checkbox" required className="mt-1" />
          <p className="text-sm text-slate-600">
            I confirm that the names provided exactly match the government-issued passports for all travelers. I understand that Arrehlah Travel & Tours is acting as an agent and standard airline cancellation policies apply.
          </p>
        </div>
        <Button
          type="submit"
          disabled={isPending}
          className="w-full py-6 text-lg bg-[var(--color-brand-green)] hover:bg-green-700 text-white gap-2 font-bold"
        >
          {isPending ? "Processing Request..." : (
            <>
              <Plane className="h-5 w-5" /> Submit Booking Request
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
