import { requireRole } from "@/lib/admin-auth";
import { RoleName } from "@prisma/client";
import { Settings } from "lucide-react";

export default async function SettingsPage() {
  await requireRole([RoleName.SUPER_ADMIN]);

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-[var(--color-brand-navy)] flex items-center gap-3">
          System Settings
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Global application configuration.
        </p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border p-12 text-center flex flex-col items-center">
        <Settings className="w-12 h-12 text-slate-300 mb-4" />
        <h2 className="text-lg font-bold text-slate-700 mb-2">Configuration Panel</h2>
        <p className="text-slate-500 max-w-md">
          Manage environment variables, API keys, and core application settings.
        </p>
      </div>
    </div>
  );
}
