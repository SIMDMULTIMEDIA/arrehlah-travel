"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function submitVisaApplication(formData: FormData) {
  try {
    const destination = formData.get("destination") as string;
    const visaType = formData.get("visaType") as string;
    const firstName = formData.get("firstName") as string;
    const lastName = formData.get("lastName") as string;
    const email = formData.get("email") as string;
    const phone = formData.get("phone") as string;
    const passportNumber = formData.get("passportNumber") as string;
    const travelDate = formData.get("travelDate") as string;
    const notes = formData.get("notes") as string;

    if (!destination || !visaType || !firstName || !lastName || !email || !passportNumber) {
      return { success: false, error: "Missing required fields" };
    }

    // In a real app with auth, you'd get the userId from the session.
    // Since auth might not be fully hooked up, we'll try to find a user by email,
    // or create a dummy user to attach this application to if no user is found.
    let user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          email,
          firstName,
          lastName,
          phone,
          role: "CUSTOMER",
        },
      });
    }

    // Generate a reference number
    const reference = `VISA-${Date.now().toString().slice(-6)}`;

    const application = await prisma.visaApplication.create({
      data: {
        reference,
        userId: user.id,
        destination,
        visaType,
        serviceFee: 50000, // Placeholder fee
        notes: `Expected Travel: ${travelDate}\nPassport: ${passportNumber}\nAdditional Notes: ${notes}`,
      },
    });

    revalidatePath("/visa");
    return { success: true, applicationReference: application.reference };
  } catch (error: any) {
    console.error("Visa application error:", error);
    return { success: false, error: error.message || "Failed to submit application" };
  }
}
