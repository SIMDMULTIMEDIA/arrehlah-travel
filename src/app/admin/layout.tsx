import Link from "next/link";
import { LayoutDashboard, Users, Ticket, Map, Plane, FileText, Settings, LogOut } from "lucide-react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const navItems = [
    { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { name: "Bookings", href: "/admin/bookings", icon: Ticket },
    { name: "Customers", href: "/admin/customers", icon: Users },
    { name: "Packages", href: "/admin/packages", icon: Map },
    { name: "Flights", href: "/admin/flights", icon: Plane },
    { name: "Applications", href: "/admin/applications", icon: FileText },
    { name: "Settings", href: "/admin/settings", icon: Settings },
  ];

  return (
    <div className="bg-slate-50 min-h-screen flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-[#0F172A] text-slate-300 min-h-screen p-4 flex flex-col fixed md:sticky top-0 z-40 hidden md:flex">
        <div className="flex items-center gap-2 mb-8 px-2 py-4 border-b border-slate-800">
          <Plane className="h-6 w-6 text-[var(--color-brand-green)]" />
          <span className="text-lg font-bold text-white tracking-tight">Arrehlah Admin</span>
        </div>

        <nav className="flex-1 space-y-1">
          {navItems.map((item) => (
            <Link 
              key={item.name} 
              href={item.href}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium hover:bg-slate-800 hover:text-white transition-colors"
            >
              <item.icon className="h-5 w-5" />
              {item.name}
            </Link>
          ))}
        </nav>
        
        <div className="border-t border-slate-800 pt-4 mt-4">
          <button className="flex w-full items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-red-400 hover:bg-slate-800 transition-colors">
            <LogOut className="h-5 w-5" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-8 md:ml-0">
        <header className="flex justify-between items-center mb-8 pb-4 border-b">
          <h1 className="text-2xl font-bold text-[var(--color-brand-navy)]">Admin Dashboard</h1>
          <div className="flex items-center gap-4">
            <div className="h-10 w-10 rounded-full bg-[var(--color-brand-green)] text-white flex items-center justify-center font-bold">
              AD
            </div>
          </div>
        </header>
        {children}
      </main>
    </div>
  );
}
