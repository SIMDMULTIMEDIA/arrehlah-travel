import { 
  Ticket, Users, FileText, DollarSign, TrendingUp, ArrowUpRight, Clock 
} from "lucide-react";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import DashboardCharts from "./_components/DashboardCharts";

export default async function AdminDashboard() {
  // Fetch real metrics from the database
  let totalBookings = 0;
  let pendingBookings = 0;
  let totalCustomers = 0;
  let pendingPayments = 0;
  let totalRevenue = 0;
  let recentActivity: any[] = [];
  let chartData: any[] = [];

  try {
    const [
      dbTotalBookings,
      dbPendingBookings,
      dbTotalCustomers,
      dbPendingPayments,
      dbTotalRevenueResult,
      dbRecentActivity,
      dbChartData
    ] = await Promise.all([
      prisma.booking.count(),
      prisma.booking.count({ where: { status: "PENDING" } }),
      prisma.user.count({ where: { role: "CUSTOMER" } }),
      prisma.payment.count({ where: { status: "PENDING" } }),
      prisma.payment.aggregate({
        where: { status: "PAID" },
        _sum: { amount: true }
      }),
      prisma.booking.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: { user: true }
      }),
      prisma.booking.findMany({
        take: 100,
        orderBy: { createdAt: 'desc' },
        select: { createdAt: true, totalAmount: true }
      })
    ]);

    totalBookings = dbTotalBookings;
    pendingBookings = dbPendingBookings;
    totalCustomers = dbTotalCustomers;
    pendingPayments = dbPendingPayments;
    totalRevenue = dbTotalRevenueResult._sum.amount?.toNumber() || 0;
    recentActivity = dbRecentActivity;
    chartData = dbChartData;
  } catch (error) {
    console.error("Database connection failed in Dashboard, using fallback empty data.", error);
    // Fallback data
  }

  // Process chart data (Last 7 days revenue)
  const last7Days = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - i);
    d.setHours(0, 0, 0, 0);
    return d;
  }).reverse();

  const revenueData = last7Days.map(date => {
    const nextDay = new Date(date);
    nextDay.setDate(date.getDate() + 1);
    
    const dayBookings = chartData.filter(b => b.createdAt >= date && b.createdAt < nextDay);
    const dayRevenue = dayBookings.reduce((sum, b) => sum + Number(b.totalAmount), 0);
    
    return {
      name: date.toLocaleDateString('en-US', { weekday: 'short' }),
      revenue: dayRevenue
    };
  });

  const stats = [
    { name: "Total Revenue", value: `₦${totalRevenue.toLocaleString()}`, change: "+14%", icon: DollarSign },
    { name: "Active Bookings", value: totalBookings.toString(), change: "+5%", icon: Ticket },
    { name: "Total Customers", value: totalCustomers.toString(), change: "+12%", icon: Users },
    { name: "Pending Payments", value: pendingPayments.toString(), change: "-2%", icon: Clock },
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
        {/* Charts & Graphs */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border overflow-hidden p-6">
          <h2 className="text-lg font-bold text-[var(--color-brand-navy)] mb-6">Revenue Trends</h2>
          <div className="h-80 w-full">
            <DashboardCharts data={revenueData} />
          </div>
        </div>

        {/* Recent Activity & Quick Actions */}
        <div className="space-y-8">
          <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
            <div className="p-4 border-b flex justify-between items-center">
              <h2 className="text-sm font-bold text-[var(--color-brand-navy)]">Recent Bookings</h2>
              <Link href="/admin/bookings" className="text-xs text-[var(--color-brand-green)] font-medium hover:underline flex items-center">
                View All <ArrowUpRight className="h-3 w-3 ml-1" />
              </Link>
            </div>
            <div className="divide-y">
              {recentActivity.length === 0 ? (
                <div className="p-6 text-center text-sm text-slate-500">No recent activity</div>
              ) : (
                recentActivity.map((booking) => (
                  <div key={booking.id} className="p-4 hover:bg-slate-50">
                    <div className="flex justify-between items-start mb-1">
                      <p className="font-semibold text-sm text-[var(--color-brand-navy)]">
                        {booking.reference}
                      </p>
                      <span className="text-xs font-bold text-slate-700">₦{Number(booking.totalAmount).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <p className="text-xs text-slate-500">{booking.user.firstName} {booking.user.lastName}</p>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-medium">
                        {booking.status}
                      </span>
                    </div>
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
