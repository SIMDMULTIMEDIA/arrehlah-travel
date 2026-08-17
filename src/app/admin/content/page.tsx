import { requireRole } from "@/lib/admin-auth";
import { RoleName } from "@prisma/client";
import { FileEdit } from "lucide-react";

export default async function ContentPage() {
  await requireRole([RoleName.SUPER_ADMIN, RoleName.ADMIN, RoleName.CONTENT_MANAGER]);

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-[var(--color-brand-navy)] flex items-center gap-3">
          Content Management
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Manage homepage content, blogs, and marketing material.
        </p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border p-12 text-center flex flex-col items-center">
        <FileEdit className="w-12 h-12 text-slate-300 mb-4" />
        <h2 className="text-lg font-bold text-slate-700 mb-2">CMS Module</h2>
        <p className="text-slate-500 max-w-md">
          Manage dynamic content, FAQs, and site pages here.
        </p>
      </div>
    </div>
  );
}
