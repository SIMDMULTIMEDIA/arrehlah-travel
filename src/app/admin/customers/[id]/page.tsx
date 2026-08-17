import { requireAdmin } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Mail, Phone, MapPin, Calendar, FileText, Ticket } from "lucide-react";

export default async function CustomerProfilePage({
  params,
}: {
  params: { id: string };
}) {
  await requireAdmin();

  let customer: any = null;

  try {
    customer = await prisma.user.findUnique({
      where: { id: params.id },
      include: {
        bookings: {
          orderBy: { createdAt: 'desc' },
          take: 5
        },
        visaApplications: {
          orderBy: { createdAt: 'desc' }
        },
        payments: {
          orderBy: { createdAt: 'desc' },
          take: 5
        }
      },
    });
  } catch (error) {
    console.error("Error fetching customer profile", error);
  }

  if (!customer) {
    notFound();
  }

  const totalSpent = customer.payments
    .filter((p: any) => p.status === 'PAID')
    .reduce((sum: number, p: any) => sum + Number(p.amount), 0);

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/admin/customers" className="p-2 bg-white border rounded-full hover:bg-slate-50 transition-colors">
          <ArrowLeft className="w-5 h-5 text-slate-600" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-[var(--color-brand-navy)] flex items-center gap-3">
            {customer.firstName} {customer.lastName}
            {!customer.isActive && (
              <span className="text-xs px-2.5 py-1 rounded-full font-medium uppercase bg-red-100 text-red-800">
                Inactive
              </span>
            )}
          </h1>
          <p className="text-sm text-slate-500">Customer ID: {customer.id}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Profile Card */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <div className="flex justify-center mb-6">
              <div className="w-24 h-24 rounded-full bg-[var(--color-brand-navy)] text-white flex items-center justify-center text-3xl font-bold">
                {customer.firstName?.charAt(0) || 'C'}
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-sm">
                <Mail className="w-4 h-4 text-slate-400" />
                <a href={`mailto:${customer.email}`} className="text-[var(--color-brand-green)] hover:underline font-medium">
                  {customer.email}
                </a>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Phone className="w-4 h-4 text-slate-400" />
                <span className="text-slate-700">{customer.phone || 'No phone provided'}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Calendar className="w-4 h-4 text-slate-400" />
                <span className="text-slate-700">Joined {new Date(customer.createdAt).toLocaleDateString()}</span>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t grid grid-cols-2 gap-4 text-center">
              <div>
                <p className="text-xs text-slate-500 uppercase font-semibold">Total Bookings</p>
                <p className="text-xl font-bold text-slate-900">{customer.bookings?.length || 0}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 uppercase font-semibold">Total Spent</p>
                <p className="text-xl font-bold text-[var(--color-brand-navy)]">₦{(totalSpent / 1000).toFixed(0)}k</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Activity & Data */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Recent Bookings */}
          <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
            <div className="p-4 border-b flex justify-between items-center bg-slate-50">
              <h2 className="font-bold text-[var(--color-brand-navy)] flex items-center gap-2">
                <Ticket className="w-5 h-5 text-slate-400" /> Recent Bookings
              </h2>
              <Link href={`/admin/bookings?q=${customer.email}`} className="text-xs text-[var(--color-brand-green)] hover:underline font-medium">
                View All
              </Link>
            </div>
            <div className="divide-y">
              {customer.bookings?.length === 0 ? (
                <div className="p-6 text-center text-slate-500 text-sm">No bookings found for this customer.</div>
              ) : (
                customer.bookings?.map((booking: any) => (
                  <div key={booking.id} className="p-4 flex justify-between items-center hover:bg-slate-50">
                    <div>
                      <Link href={`/admin/bookings/${booking.id}`} className="font-medium text-[var(--color-brand-navy)] hover:underline">
                        {booking.reference}
                      </Link>
                      <p className="text-xs text-slate-500">{new Date(booking.createdAt).toLocaleDateString()}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-slate-900">₦{Number(booking.totalAmount).toLocaleString()}</p>
                      <span className={`inline-block mt-1 text-[10px] px-2 py-0.5 rounded uppercase font-bold
                        ${booking.status === 'CONFIRMED' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-700'}
                      `}>
                        {booking.status}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Visa Applications */}
          <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
            <div className="p-4 border-b bg-slate-50">
              <h2 className="font-bold text-[var(--color-brand-navy)] flex items-center gap-2">
                <FileText className="w-5 h-5 text-slate-400" /> Visa Applications
              </h2>
            </div>
            <div className="divide-y">
              {customer.visaApplications?.length === 0 ? (
                <div className="p-6 text-center text-slate-500 text-sm">No visa applications found.</div>
              ) : (
                customer.visaApplications?.map((app: any) => (
                  <div key={app.id} className="p-4 flex justify-between items-center hover:bg-slate-50">
                    <div>
                      <p className="font-medium text-slate-900">{app.reference}</p>
                      <p className="text-sm text-slate-600">{app.destination} - {app.visaType}</p>
                    </div>
                    <span className="text-xs px-2 py-1 bg-slate-100 text-slate-700 rounded font-medium">
                      {app.status}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}
