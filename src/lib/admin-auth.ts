import { createHash } from "node:crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const COOKIE_NAME = "teh_admin";

function expectedToken() {
  const password = process.env.ADMIN_PASSWORD;
  if (!password) return null;
  return createHash("sha256").update(password).digest("hex");
}

export async function isAdminAuthenticated() {
  const token = expectedToken();
  if (!token) return false;
  const cookieStore = await cookies();
  return cookieStore.get(COOKIE_NAME)?.value === token;
}

export async function requireAdmin() {
  if (!(await isAdminAuthenticated())) redirect("/admin/login");
}

export async function createAdminSession(password: string) {
  const expectedPassword = process.env.ADMIN_PASSWORD;
  if (!expectedPassword || password !== expectedPassword) return false;
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, expectedToken()!, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 12,
  });
  return true;
}

export async function clearAdminSession() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}
