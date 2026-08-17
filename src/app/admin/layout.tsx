import Link from "next/link";
import { 
  LayoutDashboard, Users, Ticket, Map, Plane, FileText, Settings, 
  LogOut, CreditCard, Hotel, MapPin, Briefcase, Tag, MessageSquare, 
  Bell, Shield, Search, Menu
} from "lucide-react";
import { requireAdmin } from "@/lib/admin-auth";
import AdminSidebar from "./_components/AdminSidebar";
import AdminHeader from "./_components/AdminHeader";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Enforce authentication & role on the entire /admin tree
  const user = await requireAdmin();

  return (
    <div className="bg-slate-50 min-h-screen flex">
      {/* Sidebar (Desktop & Mobile) */}
      <AdminSidebar user={user} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <AdminHeader user={user} />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
