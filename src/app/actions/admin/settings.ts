"use server";

import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/admin-auth";
import { RoleName } from "@prisma/client";
import { revalidatePath } from "next/cache";

export async function updateSettings(formData: FormData) {
  try {
    await requireRole([RoleName.SUPER_ADMIN]);

    const keys = [
      "social_facebook", 
      "social_twitter", 
      "social_instagram",
      "contact_phone",
      "contact_email",
      "contact_address",
      "contact_whatsapp"
    ];

    for (const key of keys) {
      const value = formData.get(key) as string;
      if (value !== null) {
        await prisma.systemSetting.upsert({
          where: { key: key },
          update: { value: value },
          create: { key: key, value: value, description: "System Setting" },
        });
      }
    }

    revalidatePath("/", "layout"); 
    revalidatePath("/admin/settings");
    return { success: true, message: "Settings updated successfully" };
  } catch (error: any) {
    console.error("Failed to update settings:", error);
    return { success: false, message: error.message || "Failed to update settings" };
  }
}
