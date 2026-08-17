import { prisma } from "./prisma";

export async function logAudit(
  userId: string,
  action: string,
  resource: string,
  metadata?: any
) {
  try {
    await prisma.auditLog.create({
      data: {
        userId,
        action,
        resource,
        metadata: metadata || {},
      },
    });
  } catch (error) {
    console.error("Failed to write audit log:", error);
    // In a production environment, we might want to push this to a fallback logging system
    // if the main DB is unreachable, but we shouldn't crash the main request.
  }
}
