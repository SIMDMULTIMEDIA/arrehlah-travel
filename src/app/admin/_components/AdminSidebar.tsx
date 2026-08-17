"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, Users, Ticket, Map, Plane, FileText, Settings, 
  LogOut, CreditCard, Hotel, MapPin, Briefcase, Tag, MessageSquare, 
  Bell, Shield, X
} from "lucide-react";

type NavItem = {
  name: string;
  href: string;
  icon: React.ElementType;
};

type NavSection = {
  title: string;
  items: NavItem[];
};

export default function AdminSidebar({ user }: { user: any }) {
  const pathname = usePathname();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const navigation: NavSection[] = [
    {
      title: "Overview",
      items: [
        { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
        { name: "Reports", href: "/admin/reports", icon: FileText },
      ],
    },
    {
      title: "Travel Operations",
      items: [
        { name: "Bookings", href: "/admin/bookings", icon: Ticket },
        { name: "Flight Requests", href: "/admin/flight-requests", icon: Plane },
        { name: "Visa", href: "/admin/visa", icon: FileText },
        { name: "Umrah", href: "/admin/umrah", icon: Map },
        { name: "Hajj", href: "/admin/hajj", icon: MapPin },
      ],
    },
    {
      title: "Customers",
      items: [
        { name: "Customers", href: "/admin/customers", icon: Users },
      ],
    },
    {
      title: "Financial",
      items: [
        { name: "Payments", href: "/admin/payments", icon: CreditCard },
        { name: "Refunds", href: "/admin/refunds", icon: CreditCard },
        { name: "Invoices", href: "/admin/invoices", icon: FileText },
      ],
    },
    {
      title: "Products & Services",
      items: [
        { name: "Tours & Packages", href: "/admin/tours", icon: Briefcase },
        { name: "Destinations", href: "/admin/destinations", icon: MapPin },
        { name: "Visa Services", href: "/admin/visa-services", icon: FileText },
      ],
    },
    {
      title: "Marketing",
      items: [
        { name: "Offers", href: "/admin/offers", icon: Tag },
        { name: "Coupons", href: "/admin/coupons", icon: Tag },
      ],
    },
    {
      title: "Communication",
      items: [
        { name: "Support Tickets", href: "/admin/support", icon: MessageSquare },
        { name: "Notifications", href: "/admin/notifications", icon: Bell },
      ],
    },
    {
      title: "Administration",
      items: [
        { name: "Users & Staff", href: "/admin/users", icon: Shield },
        { name: "Audit Logs", href: "/admin/audit-logs", icon: FileText },
        { name: "Settings", href: "/admin/settings", icon: Settings },
      ],
    },
  ];

  return (
    <>
      {/* Mobile overlay */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 z-40 bg-gray-900/80 lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed lg:sticky top-0 z-50 flex flex-col w-64 h-screen 
        bg-[#0F172A] text-slate-300 transition-transform duration-300 ease-in-out
        ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="flex items-center justify-between h-16 px-4 border-b border-slate-800 bg-[#0F172A]">
          <div className="flex items-center gap-2">
            <Plane className="h-6 w-6 text-[var(--color-brand-green)]" />
            <span className="text-lg font-bold text-white tracking-tight">Arrehlah Admin</span>
          </div>
          <button 
            className="lg:hidden text-slate-400 hover:text-white"
            onClick={() => setIsMobileOpen(false)}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto py-4 px-3 space-y-6 scrollbar-hide">
          {navigation.map((section) => (
            <div key={section.title}>
              <h3 className="px-3 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                {section.title}
              </h3>
              <nav className="space-y-1">
                {section.items.map((item) => {
                  const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={`
                        flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors
                        ${isActive 
                          ? 'bg-[var(--color-brand-green)]/10 text-[var(--color-brand-green)]' 
                          : 'hover:bg-slate-800 hover:text-white'
                        }
                      `}
                    >
                      <item.icon className={`h-5 w-5 ${isActive ? 'text-[var(--color-brand-green)]' : 'text-slate-400'}`} />
                      {item.name}
                    </Link>
                  );
                })}
              </nav>
            </div>
          ))}
        </div>

        <div className="p-4 border-t border-slate-800 bg-[#0F172A]">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-8 w-8 rounded-full bg-[var(--color-brand-green)] text-white flex items-center justify-center font-bold text-sm">
              {user.firstName?.charAt(0) || 'A'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">{user.firstName} {user.lastName}</p>
              <p className="text-xs text-slate-400 truncate">{user.role}</p>
            </div>
          </div>
          <button className="flex w-full items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-red-400 hover:bg-slate-800 hover:text-red-300 transition-colors">
            <LogOut className="h-5 w-5" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Mobile Trigger (Absolute to page, normally handled by Header but we can put it here if Header isn't available) */}
      <button 
        className="lg:hidden fixed bottom-4 right-4 z-40 bg-[var(--color-brand-navy)] text-white p-3 rounded-full shadow-lg"
        onClick={() => setIsMobileOpen(true)}
      >
        <Plane className="h-6 w-6" />
      </button>
    </>
  );
}
