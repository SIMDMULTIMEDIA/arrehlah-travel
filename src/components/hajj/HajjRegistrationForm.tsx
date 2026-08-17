"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { submitHajjRegistration } from "@/app/actions/hajj";

const formSchema = z.object({
  firstName: z.string().min(2, "First name is required"),
  lastName: z.string().min(2, "Last name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(5, "Phone number is required"),
  packageType: z.string().min(1, "Please select a package"),
  year: z.string().min(4, "Please select a year"),
  notes: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export default function HajjRegistrationForm() {
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
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      packageType: "STANDARD",
      year: new Date().getFullYear().toString(),
    },
  });

  const onSubmit = (data: FormValues) => {
    setSubmitStatus(null);
    startTransition(async () => {
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        if (value) formData.append(key, value);
      });

      const result = await submitHajjRegistration(formData);

      if (result.success) {
        setSubmitStatus({
          success: true,
          message: "Registration successful! Our team will contact you shortly.",
          reference: result.bookingReference,
        });
        reset();
      } else {
        setSubmitStatus({
          success: false,
          message: result.error || "An error occurred during registration.",
        });
      }
    });
  };

  if (submitStatus?.success) {
    return (
      <div className="bg-green-50 text-green-800 p-8 rounded-xl border border-green-200 text-center">
        <h3 className="text-2xl font-bold mb-4">Registration Received!</h3>
        <p className="mb-4">{submitStatus.message}</p>
        <div className="bg-white p-4 rounded-lg inline-block shadow-sm">
          <p className="text-sm text-slate-500 mb-1">Your Reference Number</p>
          <p className="font-mono text-xl font-bold text-[var(--color-brand-navy)]">{submitStatus.reference}</p>
        </div>
        <div className="mt-8">
          <Button onClick={() => setSubmitStatus(null)} variant="outline">
            Register Another Person
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
        {/* Personal Details */}
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

        {/* Hajj Preferences */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700">Preferred Package <span className="text-red-500">*</span></label>
          <select
            {...register("packageType")}
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-[var(--color-brand-navy)] outline-none transition bg-white"
          >
            <option value="STANDARD">Standard Package</option>
            <option value="VIP">VIP Package</option>
            <option value="EXECUTIVE">Executive Package</option>
          </select>
          {errors.packageType && <p className="text-red-500 text-xs">{errors.packageType.message}</p>}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700">Intended Year <span className="text-red-500">*</span></label>
          <select
            {...register("year")}
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-[var(--color-brand-navy)] outline-none transition bg-white"
          >
            <option value="2026">2026</option>
            <option value="2027">2027</option>
            <option value="2028">2028</option>
          </select>
          {errors.year && <p className="text-red-500 text-xs">{errors.year.message}</p>}
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-700">Additional Notes / Special Requirements</label>
        <textarea
          {...register("notes")}
          rows={4}
          className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-[var(--color-brand-navy)] outline-none transition"
          placeholder="Any specific requests or requirements?"
        />
      </div>

      <Button
        type="submit"
        disabled={isPending}
        className="w-full py-6 text-lg bg-[var(--color-brand-navy)] hover:bg-slate-800 text-white"
      >
        {isPending ? "Submitting Registration..." : "Submit Pre-Registration"}
      </Button>
    </form>
  );
}
