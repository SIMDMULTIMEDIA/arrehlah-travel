import { requireRole } from "@/lib/admin-auth";
import { RoleName } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import TourForm from "../TourForm";
import { createTour } from "@/app/actions/admin/tours";

export default async function NewTourPage() {
  await requireRole([RoleName.SUPER_ADMIN, RoleName.ADMIN, RoleName.CONTENT_MANAGER]);

  const destinations = await prisma.destination.findMany({
    where: { isActive: true },
    orderBy: { name: "asc" },
    select: { id: true, name: true },
  });

  return <TourForm destinations={destinations} action={createTour} />;
}
