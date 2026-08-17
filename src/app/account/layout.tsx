import Link from "next/link";
import { LayoutDashboard, Ticket, FileText, CreditCard, Settings, LogOut } from "lucide-react";

export default function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const navItems = [
    { name: "Dashboard", href: "/account", icon: LayoutDashboard },
    { name: "My Bookings", href: "/account/bookings", icon: Ticket },
    { name: "Applications", href: "/account/applications", icon: FileText },
    { name: "Payment History", href: "/account/payments", icon: CreditCard },
    { name: "Settings", href: "/account/settings", icon: Settings },
  ];

  return (
    <div className="bg-slate-50 min-h-screen flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-white border-r min-h-[calc(100vh-64px)] p-6">
        <div className="flex items-center gap-4 mb-8 pb-8 border-b">
          <div className="h-12 w-12 rounded-full bg-[var(--color-brand-green)] flex items-center justify-center text-white font-bold text-xl">
            JD
          </div>
          <div>
            <h2 className="font-bold text-[var(--color-brand-navy)]">John Doe</h2>
            <p className="text-xs text-slate-500">john.doe@example.com</p>
          </div>
        </div>

        <nav className="space-y-2">
          {navItems.map((item) => (
            <Link 
              key={item.name} 
              href={item.href}
              className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-[var(--color-brand-green)] transition-colors"
            >
              <item.icon className="h-5 w-5" />
              {item.name}
            </Link>
          ))}
          
          <button className="flex w-full items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 mt-8 transition-colors">
            <LogOut className="h-5 w-5" />
            Sign Out
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-8">
        {children}
      </main>
    </div>
  );
}
