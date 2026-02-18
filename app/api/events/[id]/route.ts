import { NextResponse } from "next/server";
import { deleteEventForUser, updateEventForUser } from "@/lib/events/repository";
import { parseUpdateEventRequestDto } from "@/lib/events/types";
import { createSupabaseRouteClient } from "@/lib/supabase/route";

type EventRouteContext = {
  params: Promise<{ id: string }> | { id: string };
};

export async function PUT(request: Request, context: EventRouteContext) {
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

    const { id } = await Promise.resolve(context.params);
    const eventId = id?.trim();
    if (!eventId) {
      return NextResponse.json({ error: "Event id is required." }, { status: 400 });
    }

    const body = await request.json().catch(() => null);
    const dtoResult = parseUpdateEventRequestDto(body);
    if (!dtoResult.ok) {
      return NextResponse.json({ error: dtoResult.error }, { status: 400 });
    }

    const updated = await updateEventForUser(
      supabase,
      user.id,
      eventId,
      dtoResult.data.update
    );

    return NextResponse.json({ event: updated });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to update event.";

    if (message === "Event not found.") {
      return NextResponse.json({ error: message }, { status: 404 });
    }

    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(request: Request, context: EventRouteContext) {
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

    const { id } = await Promise.resolve(context.params);
    const eventId = id?.trim();
    if (!eventId) {
      return NextResponse.json({ error: "Event id is required." }, { status: 400 });
    }

    await deleteEventForUser(supabase, user.id, eventId);
    return NextResponse.json({ message: "Event deleted." });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to delete event.";

    if (message === "Event not found.") {
      return NextResponse.json({ error: message }, { status: 404 });
    }

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
