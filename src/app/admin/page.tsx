import { Ticket, Users, FileText, DollarSign, TrendingUp, ArrowUpRight } from "lucide-react";

export default function AdminDashboard() {
  const stats = [
    { name: "Total Revenue", value: "₦12,450,000", change: "+14%", icon: DollarSign },
    { name: "Active Bookings", value: "142", change: "+5%", icon: Ticket },
    { name: "Total Customers", value: "856", change: "+12%", icon: Users },
    { name: "Pending Applications", value: "28", change: "-2%", icon: FileText },
  ];

  const recentActivity = [
    { id: 1, type: "New Booking", detail: "Umrah VIP Package - John Doe", time: "10 minutes ago", amount: "₦4,200,000" },
    { id: 2, type: "Payment Received", detail: "Flight Booking ARR-892", time: "1 hour ago", amount: "₦850,000" },
    { id: 3, type: "Visa Application", detail: "Dubai Tourist - Sarah Smith", time: "3 hours ago", amount: "₦150,000" },
    { id: 4, type: "New Customer", detail: "Registration - Ahmed Musa", time: "5 hours ago", amount: "-" },
  ];

  return (
    <div>
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white rounded-xl shadow-sm border p-6">
            <div className="flex justify-between items-start mb-4">
              <div className="p-2 bg-slate-50 rounded-lg">
                <stat.icon className="h-6 w-6 text-slate-600" />
              </div>
              <span className={`text-xs font-bold flex items-center ${
                stat.change.startsWith('+') ? 'text-green-600' : 'text-red-600'
              }`}>
                {stat.change} <TrendingUp className="h-3 w-3 ml-1" />
              </span>
            </div>
            <p className="text-sm font-medium text-slate-500 mb-1">{stat.name}</p>
            <h3 className="text-2xl font-bold text-[var(--color-brand-navy)]">{stat.value}</h3>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Activity */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border overflow-hidden">
          <div className="p-6 border-b flex justify-between items-center">
            <h2 className="text-lg font-bold text-[var(--color-brand-navy)]">Recent Activity</h2>
            <button className="text-sm text-[var(--color-brand-green)] font-medium hover:underline flex items-center">
              View All <ArrowUpRight className="h-4 w-4 ml-1" />
            </button>
          </div>
          <div className="divide-y">
            {recentActivity.map((activity) => (
              <div key={activity.id} className="p-6 flex items-center justify-between hover:bg-slate-50">
                <div>
                  <p className="font-semibold text-[var(--color-brand-navy)] mb-1">{activity.type}</p>
                  <p className="text-sm text-slate-500">{activity.detail}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-slate-700">{activity.amount}</p>
                  <p className="text-xs text-slate-400 mt-1">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <h2 className="text-lg font-bold text-[var(--color-brand-navy)] mb-6">Quick Actions</h2>
          <div className="space-y-3">
            <button className="w-full text-left px-4 py-3 rounded-lg border hover:bg-slate-50 font-medium text-slate-700 transition-colors">
              Create New Booking
            </button>
            <button className="w-full text-left px-4 py-3 rounded-lg border hover:bg-slate-50 font-medium text-slate-700 transition-colors">
              Add Travel Package
            </button>
            <button className="w-full text-left px-4 py-3 rounded-lg border hover:bg-slate-50 font-medium text-slate-700 transition-colors">
              Review Visa Applications
            </button>
            <button className="w-full text-left px-4 py-3 rounded-lg border hover:bg-slate-50 font-medium text-slate-700 transition-colors">
              Generate Financial Report
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
