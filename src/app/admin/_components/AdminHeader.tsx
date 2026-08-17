"use client";

import { useState } from "react";
import { Search, Bell, ChevronRight, Menu } from "lucide-react";
import { usePathname } from "next/navigation";
import Link from "next/link";

export default function AdminHeader({ user }: { user: any }) {
  const pathname = usePathname();
  const [searchQuery, setSearchQuery] = useState("");

  // Generate breadcrumbs from pathname
  const paths = pathname.split("/").filter(Boolean);
  
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-slate-200 bg-white px-4 sm:px-6 lg:px-8">
      <div className="flex items-center gap-4 flex-1">
        {/* Mobile menu trigger is handled in Sidebar, but we can put a placeholder here if needed */}
        
        {/* Breadcrumbs (Hidden on very small screens) */}
        <nav className="hidden sm:flex items-center text-sm font-medium text-slate-500">
          <Link href="/admin" className="hover:text-[var(--color-brand-navy)]">
            Admin
          </Link>
          {paths.slice(1).map((path, index) => (
            <div key={path} className="flex items-center">
              <ChevronRight className="h-4 w-4 mx-1 flex-shrink-0" />
              <span className={index === paths.length - 2 ? "text-[var(--color-brand-navy)]" : "hover:text-[var(--color-brand-navy)] capitalize"}>
                {path.replace(/-/g, ' ')}
              </span>
            </div>
          ))}
        </nav>
      </div>

      <div className="flex items-center gap-4 sm:gap-6 flex-1 justify-end">
        {/* Global Search */}
        <div className="relative max-w-md w-full hidden md:block">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Search className="h-4 w-4 text-slate-400" />
          </div>
          <input
            type="text"
            className="block w-full rounded-full border-0 py-1.5 pl-10 pr-4 text-slate-900 ring-1 ring-inset ring-slate-300 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-[var(--color-brand-green)] sm:text-sm sm:leading-6 bg-slate-50"
            placeholder="Global search (Bookings, Customers...)"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Notifications */}
        <button className="relative p-2 text-slate-400 hover:text-slate-500">
          <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white" />
          <Bell className="h-6 w-6" />
        </button>

        {/* User Dropdown (Simple for now) */}
        <div className="h-8 w-8 rounded-full bg-[var(--color-brand-navy)] text-white flex items-center justify-center font-bold text-sm">
          {user.firstName?.charAt(0) || 'A'}
        </div>
      </div>
    </header>
  );
}
