import { requireAdmin, requireRole } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, User, CreditCard, Clock, FileText, CheckCircle, XCircle } from "lucide-react";
import BookingStatusForm from "./_components/BookingStatusForm";

export default async function BookingDetailsPage({
  params,
}: {
  params: { id: string };
}) {
  const user = await requireAdmin();

  let booking: any = null;

  try {
    booking = await prisma.booking.findUnique({
      where: { id: params.id },
      include: {
        user: true,
        items: true,
        payments: true,
      },
    });
  } catch (error) {
    console.error("Error fetching booking details", error);
  }

  if (!booking) {
    notFound();
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin/bookings" className="p-2 bg-white border rounded-full hover:bg-slate-50 transition-colors">
            <ArrowLeft className="w-5 h-5 text-slate-600" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-[var(--color-brand-navy)] flex items-center gap-3">
              Booking {booking.reference}
              <span className={`text-xs px-2.5 py-1 rounded-full font-medium uppercase
                ${booking.status === 'CONFIRMED' ? 'bg-green-100 text-green-800' : 
                  booking.status === 'PENDING' ? 'bg-amber-100 text-amber-800' :
                  booking.status === 'CANCELLED' ? 'bg-red-100 text-red-800' :
                  'bg-slate-100 text-slate-800'}
              `}>
                {booking.status}
              </span>
            </h1>
            <p className="text-sm text-slate-500">Created on {new Date(booking.createdAt).toLocaleString()}</p>
          </div>
        </div>
        
        {/* Quick Actions Component (Client-side form for changing status) */}
        <BookingStatusForm bookingId={booking.id} currentStatus={booking.status} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Column (Main Details) */}
        <div className="md:col-span-2 space-y-6">
          
          {/* Services/Items */}
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <h2 className="text-lg font-bold text-[var(--color-brand-navy)] mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5 text-slate-400" /> Booked Services
            </h2>
            <div className="divide-y border rounded-lg">
              {booking.items.map((item: any) => (
                <div key={item.id} className="p-4 flex justify-between items-center bg-slate-50">
                  <div>
                    <p className="font-semibold text-slate-900">{item.serviceType}</p>
                    {item.metadata && (
                      <pre className="mt-2 text-xs text-slate-500 bg-white p-2 rounded border overflow-auto">
                        {JSON.stringify(item.metadata, null, 2)}
                      </pre>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-[var(--color-brand-navy)]">
                      {booking.currency} {Number(item.amount).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-4 flex justify-between items-center py-3 border-t">
              <span className="font-medium text-slate-600">Total Amount</span>
              <span className="text-xl font-bold text-[var(--color-brand-navy)]">
                {booking.currency} {Number(booking.totalAmount).toLocaleString()}
              </span>
            </div>
          </div>

          {/* Payments */}
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <h2 className="text-lg font-bold text-[var(--color-brand-navy)] mb-4 flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-slate-400" /> Payment History
            </h2>
            {booking.payments.length === 0 ? (
              <p className="text-sm text-slate-500">No payments recorded for this booking.</p>
            ) : (
              <div className="divide-y border rounded-lg overflow-hidden">
                {booking.payments.map((payment: any) => (
                  <div key={payment.id} className="p-4 bg-slate-50 flex justify-between items-center">
                    <div>
                      <p className="font-medium text-slate-900">{payment.provider} Payment</p>
                      <p className="text-xs text-slate-500">Ref: {payment.reference}</p>
                      <p className="text-xs text-slate-400">{new Date(payment.createdAt).toLocaleString()}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-[var(--color-brand-navy)]">
                        {payment.currency} {Number(payment.amount).toLocaleString()}
                      </p>
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase
                        ${payment.status === 'PAID' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}
                      `}>
                        {payment.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

        {/* Right Column (Sidebar info) */}
        <div className="space-y-6">
          
          {/* Customer Info */}
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <h2 className="text-lg font-bold text-[var(--color-brand-navy)] mb-4 flex items-center gap-2">
              <User className="w-5 h-5 text-slate-400" /> Customer Details
            </h2>
            <div className="space-y-3 text-sm">
              <div>
                <p className="text-slate-500 text-xs">Name</p>
                <p className="font-medium text-slate-900">{booking.user.firstName} {booking.user.lastName}</p>
              </div>
              <div>
                <p className="text-slate-500 text-xs">Email</p>
                <a href={`mailto:${booking.user.email}`} className="font-medium text-[var(--color-brand-green)] hover:underline">
                  {booking.user.email}
                </a>
              </div>
              <div>
                <p className="text-slate-500 text-xs">Phone</p>
                <p className="font-medium text-slate-900">{booking.user.phone || 'N/A'}</p>
              </div>
              <div className="pt-3 border-t">
                <Link href={`/admin/customers/${booking.user.id}`} className="text-[var(--color-brand-navy)] text-sm font-medium hover:underline flex items-center justify-center w-full bg-slate-100 py-2 rounded-lg">
                  View Full Profile
                </Link>
              </div>
            </div>
          </div>

          {/* Timeline / Audit Placeholder */}
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <h2 className="text-lg font-bold text-[var(--color-brand-navy)] mb-4 flex items-center gap-2">
              <Clock className="w-5 h-5 text-slate-400" /> Timeline
            </h2>
            <div className="space-y-4">
              <div className="flex gap-3">
                <div className="flex flex-col items-center">
                  <div className="w-2 h-2 rounded-full bg-[var(--color-brand-green)] mt-1.5" />
                  <div className="w-px h-full bg-slate-200 my-1" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-900">Booking Created</p>
                  <p className="text-xs text-slate-500">{new Date(booking.createdAt).toLocaleString()}</p>
                </div>
              </div>
              {/* Additional timeline events would be populated from AuditLogs */}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
