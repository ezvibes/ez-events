import { createServerClient } from "@supabase/ssr";
import { NextResponse } from "next/server";

export function createSupabaseRouteClient(request: Request, response: NextResponse) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    throw new Error("Missing Supabase environment variables.");
  }

  return createServerClient(supabaseUrl, supabaseKey, {
    cookies: {
      get(name) {
        return request.headers
          .get("cookie")
          ?.split(";")
          .map((cookie) => cookie.trim())
          .find((cookie) => cookie.startsWith(`${name}=`))
          ?.split("=")[1];
      },
      set(name, value, options) {
        response.cookies.set({ name, value, ...options });
      },
      remove(name, options) {
        response.cookies.set({ name, value: "", ...options });
      },
    },
  });
}
