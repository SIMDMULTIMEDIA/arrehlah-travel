"use server";

import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/admin-auth";
import { RoleName } from "@prisma/client";
import { revalidatePath } from "next/cache";

export async function updateSocialSettings(formData: FormData) {
  try {
    await requireRole([RoleName.SUPER_ADMIN]);

    const facebook = formData.get("social_facebook") as string;
    const twitter = formData.get("social_twitter") as string;
    const instagram = formData.get("social_instagram") as string;

    const updates = [
      { key: "social_facebook", value: facebook },
      { key: "social_twitter", value: twitter },
      { key: "social_instagram", value: instagram },
    ];

    for (const item of updates) {
      if (item.value !== null) {
        await prisma.systemSetting.upsert({
          where: { key: item.key },
          update: { value: item.value },
          create: { key: item.key, value: item.value, description: "Social Media Link" },
        });
      }
    }

    revalidatePath("/"); // revalidate layout/footer
    revalidatePath("/admin/settings");
    return { success: true, message: "Settings updated successfully" };
  } catch (error: any) {
    console.error("Failed to update settings:", error);
    return { success: false, message: error.message || "Failed to update settings" };
  }
}
