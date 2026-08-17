"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@supabase/supabase-js";

// Initialize Supabase admin client to bypass RLS for inserting from the server action
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

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

    // 1. Find or create user
    let { data: users, error: userError } = await supabase
      .from("User")
      .select("id")
      .eq("email", email);

    if (userError) throw userError;

    let userId = users && users.length > 0 ? users[0].id : null;

    if (!userId) {
      const { data: newUser, error: createError } = await supabase
        .from("User")
        .insert({
          id: crypto.randomUUID(), // Ensure an ID is set matching Prisma UUID default
          email,
          firstName,
          lastName,
          phone,
          role: "CUSTOMER",
          updatedAt: new Date().toISOString()
        })
        .select()
        .single();

      if (createError) throw createError;
      userId = newUser.id;
    }

    // 2. Generate a reference number
    const reference = `VISA-${Date.now().toString().slice(-6)}`;

    // 3. Create Visa Application
    const { data: application, error: appError } = await supabase
      .from("VisaApplication")
      .insert({
        id: crypto.randomUUID(),
        reference,
        userId: userId,
        destination,
        visaType,
        status: "DRAFT", // Or SUBMITTED based on your enum
        serviceFee: 50000.00,
        notes: `Expected Travel: ${travelDate}\nPassport: ${passportNumber}\nAdditional Notes: ${notes}`,
        updatedAt: new Date().toISOString()
      })
      .select()
      .single();

    if (appError) throw appError;

    revalidatePath("/visa");
    return { success: true, applicationReference: application.reference };
  } catch (error: any) {
    console.error("Visa application error:", error);
    return { success: false, error: error.message || "Failed to submit application" };
  }
}
