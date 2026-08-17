import { cookies } from "next/headers"

export function isAdminSession() {
  return cookies().get("eren_admin")?.value === "authenticated"
}
