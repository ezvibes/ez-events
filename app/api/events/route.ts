import { NextResponse } from "next/server";
import { createEventForUser, listEventsForUser } from "@/lib/events/repository";
import { parseCreateEventDto, parseEventListQuery } from "@/lib/events/types";
import { createSupabaseRouteClient } from "@/lib/supabase/route";

export async function GET(request: Request) {
  try {
    const response = NextResponse.json({ ok: true });
    const supabase = createSupabaseRouteClient(request, response);

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    const url = new URL(request.url);
    const queryResult = parseEventListQuery(url.searchParams);
    if (!queryResult.ok) {
      return NextResponse.json({ error: queryResult.error }, { status: 400 });
    }

    const result = await listEventsForUser(supabase, user.id, queryResult.data);
    return NextResponse.json(result);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to fetch events.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const response = NextResponse.json({ ok: true });
    const supabase = createSupabaseRouteClient(request, response);

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    const body = await request.json().catch(() => null);
    const dtoResult = parseCreateEventDto(body);
    if (!dtoResult.ok) {
      return NextResponse.json({ error: dtoResult.error }, { status: 400 });
    }

    const created = await createEventForUser(supabase, user.id, dtoResult.data);
    return NextResponse.json({ event: created }, { status: 201 });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to create event.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
