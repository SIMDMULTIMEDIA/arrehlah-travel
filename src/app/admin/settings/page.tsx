import { requireRole } from "@/lib/admin-auth";
import { RoleName } from "@prisma/client";
import { Settings } from "lucide-react";
import SettingsForm from "./SettingsForm";
import { prisma } from "@/lib/prisma";

export default async function SettingsPage() {
  await requireRole([RoleName.SUPER_ADMIN]);

  // Fetch current settings
  const dbSettings = await prisma.systemSetting.findMany({
    where: {
      key: {
        in: [
          "social_facebook", 
          "social_twitter", 
          "social_instagram",
          "contact_phone",
          "contact_email",
          "contact_address",
          "contact_whatsapp"
        ]
      }
    }
  });

  const settingsMap = dbSettings.reduce((acc: any, curr) => {
    acc[curr.key] = curr.value;
    return acc;
  }, {});

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-[var(--color-brand-navy)] flex items-center gap-3">
          <Settings className="w-6 h-6" /> System Settings
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Global application configuration.
        </p>
      </div>

      <SettingsForm initialData={settingsMap} />
    </div>
  );
}
