import { requireRole } from "@/lib/admin-auth";
import { RoleName } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import TourForm from "../../TourForm";
import { updateTour } from "@/app/actions/admin/tours";

export default async function EditTourPage({ params }: { params: Promise<{ id: string }> }) {
  await requireRole([RoleName.SUPER_ADMIN, RoleName.ADMIN, RoleName.CONTENT_MANAGER]);

  const { id } = await params;

  const tour = await prisma.tour.findUnique({ where: { id } });
  if (!tour) notFound();

  const destinations = await prisma.destination.findMany({
    where: { isActive: true },
    orderBy: { name: "asc" },
    select: { id: true, name: true },
  });

  const tourData = {
    id: tour.id,
    title: tour.title,
    destinationId: tour.destinationId,
    durationDays: tour.durationDays,
    price: Number(tour.price),
    description: tour.description || "",
    coverImage: tour.coverImage || "",
    includes: Array.isArray(tour.includes) ? (tour.includes as string[]) : [],
    excludes: Array.isArray(tour.excludes) ? (tour.excludes as string[]) : [],
    isActive: tour.isActive,
  };

  return <TourForm tour={tourData} destinations={destinations} action={updateTour} />;
}
