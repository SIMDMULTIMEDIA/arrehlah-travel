"use client";

import { useState, useTransition, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { submitTourRegistration } from "@/app/actions/tours";

const formSchema = z.object({
  firstName: z.string().min(2, "First name is required"),
  lastName: z.string().min(2, "Last name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(5, "Phone number is required"),
  tourSlug: z.string().min(1, "Please select a tour"),
  travelers: z.string().refine((val) => parseInt(val) > 0, "At least 1 traveler required"),
  notes: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface TourRegistrationFormProps {
  initialTourSlug?: string;
}

export default function TourRegistrationForm({ initialTourSlug }: TourRegistrationFormProps) {
  const [isPending, startTransition] = useTransition();
  const [submitStatus, setSubmitStatus] = useState<{
    success?: boolean;
    message?: string;
    reference?: string;
  } | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      tourSlug: initialTourSlug || "discover-dubai-5-days",
      travelers: "1",
    },
  });

  useEffect(() => {
    if (initialTourSlug) {
      setValue("tourSlug", initialTourSlug);
    }
  }, [initialTourSlug, setValue]);

  const onSubmit = (data: FormValues) => {
    setSubmitStatus(null);
    startTransition(async () => {
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        if (value) formData.append(key, value);
      });

      const result = await submitTourRegistration(formData);

      if (result.success) {
        setSubmitStatus({
          success: true,
          message: "Tour booking successful! Our agents will contact you shortly to confirm your itinerary and dates.",
          reference: result.bookingReference,
        });
        reset();
      } else {
        setSubmitStatus({
          success: false,
          message: result.error || "An error occurred during booking.",
        });
      }
    });
  };

  if (submitStatus?.success) {
    return (
      <div className="bg-green-50 text-green-800 p-8 rounded-xl border border-green-200 text-center">
        <h3 className="text-2xl font-bold mb-4">Booking Received!</h3>
        <p className="mb-4">{submitStatus.message}</p>
        <div className="bg-white p-4 rounded-lg inline-block shadow-sm">
          <p className="text-sm text-slate-500 mb-1">Your Booking Reference</p>
          <p className="font-mono text-xl font-bold text-[var(--color-brand-navy)]">{submitStatus.reference}</p>
        </div>
        <div className="mt-8">
          <Button onClick={() => setSubmitStatus(null)} variant="outline">
            Book Another Tour
          </Button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 bg-white p-6 md:p-8 rounded-xl shadow-sm border">
      
      {submitStatus?.success === false && (
        <div className="bg-red-50 text-red-800 p-4 rounded-lg text-sm border border-red-200">
          {submitStatus.message}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700">First Name <span className="text-red-500">*</span></label>
          <input
            {...register("firstName")}
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-[var(--color-brand-navy)] outline-none transition"
            placeholder="Ahmad"
          />
          {errors.firstName && <p className="text-red-500 text-xs">{errors.firstName.message}</p>}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700">Last Name <span className="text-red-500">*</span></label>
          <input
            {...register("lastName")}
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-[var(--color-brand-navy)] outline-none transition"
            placeholder="Abdullah"
          />
          {errors.lastName && <p className="text-red-500 text-xs">{errors.lastName.message}</p>}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700">Email <span className="text-red-500">*</span></label>
          <input
            type="email"
            {...register("email")}
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-[var(--color-brand-navy)] outline-none transition"
            placeholder="ahmad@example.com"
          />
          {errors.email && <p className="text-red-500 text-xs">{errors.email.message}</p>}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700">Phone Number <span className="text-red-500">*</span></label>
          <input
            type="tel"
            {...register("phone")}
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-[var(--color-brand-navy)] outline-none transition"
            placeholder="+234 XXX XXXX"
          />
          {errors.phone && <p className="text-red-500 text-xs">{errors.phone.message}</p>}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700">Select Tour <span className="text-red-500">*</span></label>
          <select
            {...register("tourSlug")}
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-[var(--color-brand-navy)] outline-none transition bg-white"
          >
            <option value="discover-dubai-5-days">Discover Dubai - 5 Days</option>
            <option value="best-of-london">Best of London - 7 Days</option>
            <option value="egyptian-wonders">Egyptian Wonders - 6 Days</option>
          </select>
          {errors.tourSlug && <p className="text-red-500 text-xs">{errors.tourSlug.message}</p>}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700">Number of Travelers <span className="text-red-500">*</span></label>
          <input
            type="number"
            min="1"
            {...register("travelers")}
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-[var(--color-brand-navy)] outline-none transition"
          />
          {errors.travelers && <p className="text-red-500 text-xs">{errors.travelers.message}</p>}
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-700">Additional Notes / Special Requests</label>
        <textarea
          {...register("notes")}
          rows={4}
          className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-[var(--color-brand-navy)] outline-none transition"
          placeholder="Any specific dates in mind, dietary requirements, or flight preferences?"
        />
      </div>

      <Button
        type="submit"
        disabled={isPending}
        className="w-full py-6 text-lg bg-[var(--color-brand-navy)] hover:bg-slate-800 text-white"
      >
        {isPending ? "Processing..." : "Complete Booking"}
      </Button>
    </form>
  );
}
