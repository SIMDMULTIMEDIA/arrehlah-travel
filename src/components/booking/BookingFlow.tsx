"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { CheckCircle2, ChevronRight, AlertCircle } from "lucide-react";
import { cn } from "@/utils/cn";

interface BookingFlowProps {
  serviceId: string;
  serviceType: "FLIGHT" | "HOTEL" | "TOUR" | "UMRAH" | "HAJJ" | "VISA";
  initialPrice: number;
}

const STEPS = [
  "Service Selection",
  "Travelers",
  "Add-ons",
  "Documents",
  "Review",
  "Payment",
  "Confirmation"
];

export function BookingFlow({ serviceId, serviceType, initialPrice }: BookingFlowProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [travelers, setTravelers] = useState<any[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleNext = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(c => c + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(c => c - 1);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex items-center justify-between relative">
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-slate-200 -z-10" />
          <div 
            className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-[var(--color-brand-green)] -z-10 transition-all duration-300"
            style={{ width: `${(currentStep / (STEPS.length - 1)) * 100}%` }}
          />
          
          {STEPS.map((step, idx) => (
            <div key={idx} className="flex flex-col items-center">
              <div 
                className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border-2 bg-white transition-colors",
                  currentStep > idx ? "border-[var(--color-brand-green)] text-[var(--color-brand-green)]" :
                  currentStep === idx ? "border-[var(--color-brand-navy)] bg-[var(--color-brand-navy)] text-white" :
                  "border-slate-300 text-slate-400"
                )}
              >
                {currentStep > idx ? <CheckCircle2 className="h-5 w-5" /> : idx + 1}
              </div>
              <span className="text-xs font-medium text-slate-500 mt-2 hidden md:block w-20 text-center">
                {step}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Step Content */}
      <div className="bg-white rounded-2xl shadow-sm border p-6 md:p-8 min-h-[400px]">
        {currentStep === 0 && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 className="text-2xl font-bold text-[var(--color-brand-navy)] mb-6">Confirm Service Details</h2>
            <div className="p-4 bg-slate-50 rounded-lg border">
              <p className="text-sm text-slate-500 mb-1">Service Type: <strong className="text-[var(--color-brand-navy)]">{serviceType}</strong></p>
              <p className="text-sm text-slate-500 mb-1">Service ID: {serviceId}</p>
              <p className="text-2xl font-bold text-[var(--color-brand-green)] mt-4">₦{initialPrice.toLocaleString()}</p>
            </div>
          </div>
        )}

        {currentStep === 1 && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 className="text-2xl font-bold text-[var(--color-brand-navy)] mb-6">Traveler Information</h2>
            <div className="p-4 bg-blue-50 text-blue-800 rounded-lg border border-blue-200 flex gap-3 mb-6">
              <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
              <p className="text-sm">Please ensure names match passport exactly. Errors may result in denied boarding or visa rejection.</p>
            </div>
            {/* Form placeholders */}
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <input type="text" placeholder="First Name" className="flex h-10 w-full rounded-md border border-[var(--color-border)] bg-white px-3 py-2 text-sm" />
                <input type="text" placeholder="Last Name" className="flex h-10 w-full rounded-md border border-[var(--color-border)] bg-white px-3 py-2 text-sm" />
              </div>
            </div>
          </div>
        )}

        {currentStep === 4 && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 className="text-2xl font-bold text-[var(--color-brand-navy)] mb-6">Review & Payment</h2>
            <p className="text-slate-600 mb-6">Please review your booking details before proceeding to payment.</p>
          </div>
        )}

        {currentStep === STEPS.length - 1 && (
          <div className="animate-in fade-in zoom-in duration-500 text-center py-12">
            <div className="h-20 w-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="h-10 w-10 text-[var(--color-brand-green)]" />
            </div>
            <h2 className="text-3xl font-bold text-[var(--color-brand-navy)] mb-2">Booking Confirmed!</h2>
            <p className="text-slate-600 mb-6">Your booking reference is <strong className="text-[var(--color-brand-navy)]">ARR-2026-X8F9A2</strong></p>
            <Button>View in Dashboard</Button>
          </div>
        )}
      </div>

      {/* Navigation */}
      {currentStep < STEPS.length - 1 && (
        <div className="flex justify-between items-center mt-8">
          <Button 
            variant="outline" 
            onClick={handleBack} 
            disabled={currentStep === 0 || isProcessing}
          >
            Back
          </Button>
          <Button onClick={handleNext} disabled={isProcessing}>
            {currentStep === STEPS.length - 2 ? "Proceed to Payment" : "Next"} 
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      )}
    </div>
  );
}
