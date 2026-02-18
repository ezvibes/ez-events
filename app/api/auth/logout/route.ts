import { NextResponse } from "next/server";
import { createSupabaseRouteClient } from "@/lib/supabase/route";

export async function POST(request: Request) {
  try {
    const response = NextResponse.json({ message: "Logged out." });
    const supabase = createSupabaseRouteClient(request, response);

    const { error } = await supabase.auth.signOut();
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return response;
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to logout.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
