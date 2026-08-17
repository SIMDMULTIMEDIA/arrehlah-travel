"use client";

import { useState, useTransition, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { submitHotelBooking } from "@/app/actions/hotels";

const formSchema = z.object({
  firstName: z.string().min(2, "First name is required"),
  lastName: z.string().min(2, "Last name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(5, "Phone number is required"),
  hotelId: z.string().min(1, "Please select a hotel"),
  checkIn: z.string().min(1, "Check-in date is required"),
  checkOut: z.string().min(1, "Check-out date is required"),
  rooms: z.string().refine((val) => parseInt(val) > 0, "At least 1 room required"),
  notes: z.string().optional(),
}).refine((data) => {
  return new Date(data.checkIn) < new Date(data.checkOut);
}, {
  message: "Check-out must be after check-in",
  path: ["checkOut"],
});

type FormValues = z.infer<typeof formSchema>;

interface HotelBookingFormProps {
  initialHotelId?: string;
  hotels: { id: string; name: string }[];
}

export default function HotelBookingForm({ initialHotelId, hotels }: HotelBookingFormProps) {
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
      hotelId: initialHotelId || (hotels.length > 0 ? hotels[0].id : ""),
      rooms: "1",
    },
  });

  useEffect(() => {
    if (initialHotelId) {
      setValue("hotelId", initialHotelId);
    }
  }, [initialHotelId, setValue]);

  const onSubmit = (data: FormValues) => {
    setSubmitStatus(null);
    startTransition(async () => {
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        if (value) formData.append(key, value);
      });

      const result = await submitHotelBooking(formData);

      if (result.success) {
        setSubmitStatus({
          success: true,
          message: "Hotel booking request received! Our agents will verify availability and send you a confirmation.",
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
        <h3 className="text-2xl font-bold mb-4">Request Received!</h3>
        <p className="mb-4">{submitStatus.message}</p>
        <div className="bg-white p-4 rounded-lg inline-block shadow-sm">
          <p className="text-sm text-slate-500 mb-1">Your Booking Reference</p>
          <p className="font-mono text-xl font-bold text-[var(--color-brand-navy)]">{submitStatus.reference}</p>
        </div>
        <div className="mt-8">
          <Button onClick={() => setSubmitStatus(null)} variant="outline">
            Book Another Hotel
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

        <div className="space-y-2 md:col-span-2">
          <label className="text-sm font-medium text-slate-700">Select Hotel <span className="text-red-500">*</span></label>
          <select
            {...register("hotelId")}
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-[var(--color-brand-navy)] outline-none transition bg-white"
          >
            {hotels.map(h => (
              <option key={h.id} value={h.id}>{h.name}</option>
            ))}
          </select>
          {errors.hotelId && <p className="text-red-500 text-xs">{errors.hotelId.message}</p>}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700">Check In <span className="text-red-500">*</span></label>
          <input
            type="date"
            {...register("checkIn")}
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-[var(--color-brand-navy)] outline-none transition"
          />
          {errors.checkIn && <p className="text-red-500 text-xs">{errors.checkIn.message}</p>}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700">Check Out <span className="text-red-500">*</span></label>
          <input
            type="date"
            {...register("checkOut")}
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-[var(--color-brand-navy)] outline-none transition"
          />
          {errors.checkOut && <p className="text-red-500 text-xs">{errors.checkOut.message}</p>}
        </div>

        <div className="space-y-2 md:col-span-2">
          <label className="text-sm font-medium text-slate-700">Number of Rooms <span className="text-red-500">*</span></label>
          <input
            type="number"
            min="1"
            {...register("rooms")}
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-[var(--color-brand-navy)] outline-none transition"
          />
          {errors.rooms && <p className="text-red-500 text-xs">{errors.rooms.message}</p>}
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-700">Additional Notes / Special Requests</label>
        <textarea
          {...register("notes")}
          rows={4}
          className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-[var(--color-brand-navy)] outline-none transition"
          placeholder="Any specific room preferences (e.g., high floor, twin beds)?"
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
