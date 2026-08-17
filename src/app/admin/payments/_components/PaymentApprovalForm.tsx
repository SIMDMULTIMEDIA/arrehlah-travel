"use client";

import { useState } from "react";
import { approvePayment, rejectPayment } from "@/app/actions/admin/payments";
import { CheckCircle, XCircle, RefreshCw } from "lucide-react";

export default function PaymentApprovalForm({ 
  paymentId,
  bookingId
}: { 
  paymentId: string;
  bookingId: string | null;
}) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  async function handleApprove() {
    if (!confirm("I confirm that the exact funds have been received in the company bank account.")) return;
    
    setIsProcessing(true);
    setError(null);
    try {
      const res = await approvePayment(paymentId, bookingId);
      if (res.success) {
        setSuccess(true);
      } else {
        setError(res.error || "Approval failed.");
      }
    } catch (e: any) {
      setError(e.message || "An unexpected error occurred");
    } finally {
      setIsProcessing(false);
    }
  }

  async function handleReject() {
    const reason = prompt("Reason for rejection (e.g., Funds not received, Wrong amount):");
    if (reason === null) return; // User cancelled

    setIsProcessing(true);
    setError(null);
    try {
      const res = await rejectPayment(paymentId, bookingId, reason);
      if (res.success) {
        setSuccess(true);
      } else {
        setError(res.error || "Rejection failed.");
      }
    } catch (e: any) {
      setError(e.message || "An unexpected error occurred");
    } finally {
      setIsProcessing(false);
    }
  }

  if (success) {
    return (
      <div className="bg-green-50 text-green-700 p-4 rounded-lg flex items-center justify-center gap-2 font-medium">
        <CheckCircle className="w-5 h-5" /> Done
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {error && <div className="text-xs text-red-600 bg-red-50 p-2 rounded">{error}</div>}
      
      <button
        onClick={handleApprove}
        disabled={isProcessing}
        className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-bold transition-colors disabled:opacity-50"
      >
        {isProcessing ? <RefreshCw className="w-5 h-5 animate-spin" /> : <CheckCircle className="w-5 h-5" />}
        Approve Funds
      </button>
      
      <button
        onClick={handleReject}
        disabled={isProcessing}
        className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-white border border-red-200 text-red-600 hover:bg-red-50 rounded-lg font-bold transition-colors disabled:opacity-50"
      >
        <XCircle className="w-5 h-5" />
        Reject
      </button>
    </div>
  );
}
