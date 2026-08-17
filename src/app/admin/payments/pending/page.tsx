import { requireAdmin, requireRole } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { AlertCircle, CheckCircle, XCircle } from "lucide-react";
import { RoleName } from "@prisma/client";
import PaymentApprovalForm from "./_components/PaymentApprovalForm";

export default async function PendingPaymentsPage() {
  const user = await requireRole([
    RoleName.SUPER_ADMIN,
    RoleName.ADMIN,
    RoleName.FINANCE
  ]);

  let pendingPayments: any[] = [];

  try {
    pendingPayments = await prisma.payment.findMany({
      where: {
        status: "PENDING",
      },
      include: {
        user: true,
        booking: true
      },
      orderBy: { createdAt: "asc" }, // Oldest first
    });
  } catch (error) {
    console.error("Database error fetching pending payments:", error);
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-[var(--color-brand-navy)] flex items-center gap-3">
          Pending Transfers Verification
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Review and approve manual bank transfers and offline payments. Ensure the exact amount has reached the Arrehlah bank account before approving.
        </p>
      </div>

      {pendingPayments.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border p-12 text-center">
          <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-slate-900 mb-2">All Caught Up!</h2>
          <p className="text-slate-500">There are no pending payments requiring verification.</p>
          <Link href="/admin/payments" className="inline-block mt-6 px-4 py-2 bg-slate-100 text-slate-700 font-medium rounded-lg hover:bg-slate-200">
            View All Payments
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {pendingPayments.map((payment) => (
            <div key={payment.id} className="bg-white rounded-xl shadow-sm border p-6 flex flex-col md:flex-row gap-6">
              
              {/* Payment Details */}
              <div className="flex-1 space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 mb-1">{payment.reference}</h3>
                    <p className="text-xs text-slate-500">Submitted {new Date(payment.createdAt).toLocaleString()}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-black text-[var(--color-brand-navy)]">
                      {payment.currency} {Number(payment.amount).toLocaleString()}
                    </p>
                    <p className="text-xs font-bold text-amber-600 uppercase bg-amber-50 inline-block px-2 py-0.5 rounded mt-1">
                      {payment.provider}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm bg-slate-50 p-4 rounded-lg border border-slate-100">
                  <div>
                    <p className="text-xs text-slate-500 uppercase font-bold mb-1">Customer</p>
                    <p className="font-medium">{payment.user.firstName} {payment.user.lastName}</p>
                    <a href={`mailto:${payment.user.email}`} className="text-[var(--color-brand-green)] hover:underline block truncate">
                      {payment.user.email}
                    </a>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 uppercase font-bold mb-1">Booking Link</p>
                    {payment.booking ? (
                      <Link href={`/admin/bookings/${payment.booking.id}`} className="font-medium text-[var(--color-brand-navy)] hover:underline inline-flex items-center">
                        {payment.booking.reference}
                      </Link>
                    ) : (
                      <span className="text-slate-400">Standalone Payment</span>
                    )}
                  </div>
                </div>

                {/* Proof of Payment Placeholder */}
                <div className="border border-dashed border-slate-300 rounded-lg p-4 flex items-center justify-center bg-slate-50 text-slate-500 text-sm">
                  {/* Ideally, we display a link or thumbnail of the uploaded receipt here */}
                  <AlertCircle className="w-4 h-4 mr-2" /> No receipt image attached by customer.
                </div>
              </div>

              {/* Action Form */}
              <div className="w-full md:w-72 border-t md:border-t-0 md:border-l pt-6 md:pt-0 md:pl-6 flex flex-col justify-center">
                <p className="text-sm text-slate-600 mb-4 font-medium">Verify this transaction:</p>
                <PaymentApprovalForm paymentId={payment.id} bookingId={payment.bookingId} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
