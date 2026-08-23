import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { RoleName } from "@prisma/client";

/**
 * Creates a server-side Supabase client using cookies.
 */
export async function createClient() {
  const cookieStore = await cookies();
  
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch (error) {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    }
  );
}

/**
 * Development authentication bypass.
 * Strictly checks for NODE_ENV and explicit environment variable.
 */
async function getDevBypassUser() {
  if (
    process.env.NODE_ENV === "development" &&
    process.env.ADMIN_DEV_BYPASS === "true"
  ) {
    try {
      let admin = await prisma.user.findFirst({
        where: { role: RoleName.SUPER_ADMIN },
      });

      if (!admin) {
        admin = await prisma.user.create({
          data: {
            email: "devadmin@arrehlah.com",
            firstName: "Dev",
            lastName: "Admin",
            role: RoleName.SUPER_ADMIN,
          },
        });
      }
      return admin;
    } catch (error) {
      console.error("Database connection failed in DEV bypass, using mock user.");
      return {
        id: "mock-dev-id",
        email: "devadmin@arrehlah.com",
        firstName: "Dev",
        lastName: "Admin",
        phone: "123456789",
        role: RoleName.SUPER_ADMIN,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      };
    }
  }
  return null;
}

/**
 * Gets the currently authenticated user from the database.
 */
export async function getAuthenticatedUser() {
  try {
    // 1. Check Dev Bypass First (Only in Dev)
    const devUser = await getDevBypassUser();
    if (devUser) {
      return devUser;
    }

    // 2. Real Authentication Flow
    const supabase = await createClient();
    const { data: { user: supabaseUser }, error } = await supabase.auth.getUser();

    if (error || !supabaseUser) {
      return null;
    }

    // 3. Match Supabase user to Prisma user
    const dbUser = await prisma.user.findUnique({
      where: { id: supabaseUser.id },
    });

    if (!dbUser && supabaseUser.email) {
      return await prisma.user.findUnique({
        where: { email: supabaseUser.email }
      });
    }

    return dbUser;
  } catch (error: any) {
    if (error?.digest?.startsWith("NEXT_REDIRECT") || error?.digest === "DYNAMIC_SERVER_USAGE") {
      throw error;
    }
    console.error("Authentication error in getAuthenticatedUser:", error);
    return null;
  }
}

/**
 * Requires an authenticated user. Redirects to login if not authenticated.
 */
export async function requireAuthenticatedUser() {
  const user = await getAuthenticatedUser();
  if (!user) {
    redirect("/auth/login");
  }
  return user;
}

/**
 * Requires the user to have any role OTHER than CUSTOMER.
 * Used to protect the /admin base routes.
 */
export async function requireAdmin() {
  const user = await requireAuthenticatedUser();
  
  if (user.role === RoleName.CUSTOMER) {
    try {
      await prisma.auditLog.create({
        data: {
          userId: user.id,
          action: "UNAUTHORIZED_ADMIN_ACCESS",
          resource: "AdminPanel",
          metadata: { path: "/admin" }
        }
      });
    } catch (e) {
      // Ignore audit log failure during unauthorized access
    }
    redirect("/");
  }
  
  return user;
}

/**
 * Requires the user to have one of the specifically allowed roles.
 */
export async function requireRole(allowedRoles: RoleName[]) {
  const user = await requireAdmin();
  
  if (user.role === RoleName.SUPER_ADMIN) {
    return user;
  }

  if (!allowedRoles.includes(user.role)) {
    redirect("/admin");
  }

  return user;
}
