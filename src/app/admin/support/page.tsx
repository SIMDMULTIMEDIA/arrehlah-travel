import { requireRole } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Search, MessageSquare, Clock } from "lucide-react";
import { RoleName } from "@prisma/client";

export default async function SupportTicketsPage() {
  await requireRole([RoleName.SUPER_ADMIN, RoleName.ADMIN, RoleName.SUPPORT_AGENT]);

  // If there was a Ticket model, we would fetch it here.
  // We'll mock the UI for the ticketing system.
  const tickets: any[] = [];

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-[var(--color-brand-navy)] flex items-center gap-3">
            <MessageSquare className="w-6 h-6" /> Support Tickets
          </h1>
          <p className="text-sm text-slate-500">Manage customer inquiries and support requests.</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        {/* Filters Bar */}
        <div className="p-4 border-b bg-slate-50 flex gap-4">
          <div className="flex-1 max-w-xl flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                placeholder="Search ticket #, subject, customer..."
                className="w-full pl-9 pr-4 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-[var(--color-brand-green)] outline-none"
              />
            </div>
            <select
              className="px-3 py-2 border rounded-lg text-sm bg-white focus:ring-2 focus:ring-[var(--color-brand-green)] outline-none"
            >
              <option value="">All Statuses</option>
              <option value="OPEN">Open</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="WAITING_ON_CUSTOMER">Waiting on Customer</option>
              <option value="CLOSED">Closed</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 text-xs uppercase font-semibold text-slate-500 border-b">
              <tr>
                <th className="px-6 py-4">Ticket</th>
                <th className="px-6 py-4">Customer</th>
                <th className="px-6 py-4">Subject</th>
                <th className="px-6 py-4 text-center">Priority</th>
                <th className="px-6 py-4 text-center">Status</th>
                <th className="px-6 py-4 text-right">Last Updated</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {tickets.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-500 flex flex-col items-center">
                    <MessageSquare className="w-10 h-10 text-slate-200 mb-3" />
                    <p>No support tickets found.</p>
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
