"use server";

import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/admin-auth";
import { RoleName } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export async function createTour(formData: FormData): Promise<void> {
  await requireRole([RoleName.SUPER_ADMIN, RoleName.ADMIN, RoleName.CONTENT_MANAGER]);

  const title = formData.get("title") as string;
  const destinationId = formData.get("destinationId") as string;
  const durationDays = parseInt(formData.get("durationDays") as string, 10);
  const price = parseFloat(formData.get("price") as string);
  const description = formData.get("description") as string;
  const coverImage = formData.get("coverImage") as string;
  const isActive = formData.get("isActive") === "true";

  // Parse includes/excludes from newline-separated text
  const includesRaw = formData.get("includes") as string;
  const excludesRaw = formData.get("excludes") as string;
  const includes = includesRaw ? includesRaw.split("\n").map((s) => s.trim()).filter(Boolean) : [];
  const excludes = excludesRaw ? excludesRaw.split("\n").map((s) => s.trim()).filter(Boolean) : [];

  let slug = slugify(title);
  // Ensure unique slug
  const existing = await prisma.tour.findUnique({ where: { slug } });
  if (existing) {
    slug = `${slug}-${Date.now().toString(36)}`;
  }

  await prisma.tour.create({
    data: {
      title,
      slug,
      destinationId,
      durationDays,
      price,
      description: description || null,
      coverImage: coverImage || null,
      includes,
      excludes,
      isActive,
    },
  });

  revalidatePath("/admin/tours");
  revalidatePath("/tours");
  redirect("/admin/tours");
}

export async function updateTour(formData: FormData): Promise<void> {
  await requireRole([RoleName.SUPER_ADMIN, RoleName.ADMIN, RoleName.CONTENT_MANAGER]);

  const id = formData.get("id") as string;
  const title = formData.get("title") as string;
  const destinationId = formData.get("destinationId") as string;
  const durationDays = parseInt(formData.get("durationDays") as string, 10);
  const price = parseFloat(formData.get("price") as string);
  const description = formData.get("description") as string;
  const coverImage = formData.get("coverImage") as string;
  const isActive = formData.get("isActive") === "true";

  const includesRaw = formData.get("includes") as string;
  const excludesRaw = formData.get("excludes") as string;
  const includes = includesRaw ? includesRaw.split("\n").map((s) => s.trim()).filter(Boolean) : [];
  const excludes = excludesRaw ? excludesRaw.split("\n").map((s) => s.trim()).filter(Boolean) : [];

  await prisma.tour.update({
    where: { id },
    data: {
      title,
      destinationId,
      durationDays,
      price,
      description: description || null,
      coverImage: coverImage || null,
      includes,
      excludes,
      isActive,
    },
  });

  revalidatePath("/admin/tours");
  revalidatePath("/tours");
  redirect("/admin/tours");
}

export async function deleteTour(formData: FormData): Promise<void> {
  await requireRole([RoleName.SUPER_ADMIN, RoleName.ADMIN]);

  const id = formData.get("id") as string;
  if (!id) return;

  await prisma.tour.delete({ where: { id } });

  revalidatePath("/admin/tours");
  revalidatePath("/tours");
}

export async function toggleTourStatus(formData: FormData): Promise<void> {
  await requireRole([RoleName.SUPER_ADMIN, RoleName.ADMIN, RoleName.CONTENT_MANAGER]);

  const id = formData.get("id") as string;
  if (!id) return;

  const tour = await prisma.tour.findUnique({ where: { id } });
  if (!tour) return;

  await prisma.tour.update({
    where: { id },
    data: { isActive: !tour.isActive },
  });

  revalidatePath("/admin/tours");
  revalidatePath("/tours");
}
