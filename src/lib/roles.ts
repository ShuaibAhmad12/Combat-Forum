import { currentUser } from "@clerk/nextjs/server";

export type UserRole = "user" | "moderator" | "admin";

export async function getUserRole(): Promise<UserRole> {
  const user = await currentUser();
  
  if (!user) {
    return "user";
  }
  
  // Get the user's role from public metadata
  // Default to "user" if no role is set
  return (user.publicMetadata?.role as UserRole) || "user";
}

export async function hasModeratorPermission(): Promise<boolean> {
  const role = await getUserRole();
  return role === "moderator" || role === "admin";
}

export async function hasAdminPermission(): Promise<boolean> {
  const role = await getUserRole();
  return role === "admin";
}