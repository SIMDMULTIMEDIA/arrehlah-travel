import { Button } from "@/components/ui/button";
import { Ticket, FileText, Clock, ChevronRight } from "lucide-react";
import Link from "next/link";

export default function AccountDashboard() {
  const recentBookings = [
    { id: "ARR-2026-X8F9A2", service: "Umrah Standard Package", date: "Oct 15, 2026", status: "Confirmed", amount: "₦2,500,000" },
    { id: "ARR-2026-B3K9L1", service: "Flight: KAN - DXB", date: "Nov 2, 2026", status: "Pending", amount: "₦850,000" },
  ];

  return (
    <div>
      <h1 className="text-3xl font-bold text-[var(--color-brand-navy)] mb-2">Welcome back, John!</h1>
      <p className="text-slate-600 mb-8">Here is an overview of your travel plans and applications.</p>
      
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm border p-6 flex items-center gap-4">
          <div className="h-12 w-12 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
            <Ticket className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Active Bookings</p>
            <p className="text-2xl font-bold text-[var(--color-brand-navy)]">2</p>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border p-6 flex items-center gap-4">
          <div className="h-12 w-12 rounded-full bg-orange-50 flex items-center justify-center text-orange-600">
            <Clock className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Pending Payments</p>
            <p className="text-2xl font-bold text-[var(--color-brand-navy)]">1</p>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border p-6 flex items-center gap-4">
          <div className="h-12 w-12 rounded-full bg-green-50 flex items-center justify-center text-green-600">
            <FileText className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Active Visas</p>
            <p className="text-2xl font-bold text-[var(--color-brand-navy)]">1</p>
          </div>
        </div>
      </div>

      {/* Recent Bookings */}
      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <div className="p-6 border-b flex justify-between items-center">
          <h2 className="text-lg font-bold text-[var(--color-brand-navy)]">Recent Bookings</h2>
          <Link href="/account/bookings" className="text-sm font-medium text-[var(--color-brand-green)] hover:underline flex items-center">
            View All <ChevronRight className="h-4 w-4 ml-1" />
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 text-xs uppercase text-slate-500">
              <tr>
                <th className="px-6 py-4 font-medium">Reference</th>
                <th className="px-6 py-4 font-medium">Service</th>
                <th className="px-6 py-4 font-medium">Date</th>
                <th className="px-6 py-4 font-medium">Amount</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {recentBookings.map((booking) => (
                <tr key={booking.id} className="hover:bg-slate-50">
                  <td className="px-6 py-4 font-medium text-[var(--color-brand-navy)]">{booking.id}</td>
                  <td className="px-6 py-4">{booking.service}</td>
                  <td className="px-6 py-4">{booking.date}</td>
                  <td className="px-6 py-4 font-medium">{booking.amount}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      booking.status === 'Confirmed' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'
                    }`}>
                      {booking.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <Button variant="outline" size="sm">View</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
