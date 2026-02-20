"use server";

import {
  createEventForUser,
  deleteEventForUser,
  listEventsForUser,
  updateEventForUser,
} from "@/lib/events/repository";
import {
  parseCreateEventDto,
  parseUpdateEventRequestDto,
} from "@/lib/events/types";
import { createSupabaseActionClient } from "@/lib/supabase/action";

type ActionResult<T = void> =
  | { ok: true; data?: T }
  | { ok: false; error: string };

type ListEventsPageInput = {
  page: number;
  pageSize: number;
  q?: string;
  sportType?: string;
};

export async function listEventsPageAction(
  input: ListEventsPageInput
): Promise<
  ActionResult<{
    events: {
      id: string;
      ownerUserId: string;
      name: string;
      sportType: string;
      startsAt: string;
      venues: string[];
      description: string | null;
    }[];
    total: number;
  }>
> {
  try {
    const supabase = await createSupabaseActionClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return { ok: false, error: "Unauthorized." };
    }

    const page = Number.isFinite(input.page) && input.page > 0 ? input.page : 1;
    const pageSize =
      Number.isFinite(input.pageSize) && input.pageSize > 0
        ? Math.min(input.pageSize, 100)
        : 20;

    const result = await listEventsForUser(supabase, {
      page,
      pageSize,
      q: input.q?.trim() || undefined,
      sportType: input.sportType?.trim() || undefined,
    });

    return {
      ok: true,
      data: {
        events: result.events.map((event) => ({
          id: event.id,
          ownerUserId: event.ownerUserId,
          name: event.name,
          sportType: event.sportType,
          startsAt: event.startsAt.toISOString(),
          venues: event.venues,
          description: event.description,
        })),
        total: result.total,
      },
    };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to fetch events.";
    return { ok: false, error: message };
  }
}

export async function createEventAction(input: unknown): Promise<ActionResult> {
  const dtoResult = parseCreateEventDto(input);
  if (!dtoResult.ok) {
    return { ok: false, error: dtoResult.error };
  }

  try {
    const supabase = await createSupabaseActionClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return { ok: false, error: "Unauthorized." };
    }

    await createEventForUser(supabase, user.id, dtoResult.data);
    return { ok: true };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to create event.";
    return { ok: false, error: message };
  }
}

export async function updateEventAction(
  eventId: string,
  input: unknown
): Promise<ActionResult> {
  const parsedEventId = eventId.trim();
  if (!parsedEventId) {
    return { ok: false, error: "Event id is required." };
  }

  const dtoResult = parseUpdateEventRequestDto(input);
  if (!dtoResult.ok) {
    return { ok: false, error: dtoResult.error };
  }

  try {
    const supabase = await createSupabaseActionClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return { ok: false, error: "Unauthorized." };
    }

    await updateEventForUser(supabase, user.id, parsedEventId, dtoResult.data.update);
    return { ok: true };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to update event.";
    return { ok: false, error: message };
  }
}

export async function deleteEventAction(eventId: string): Promise<ActionResult> {
  const parsedEventId = eventId.trim();
  if (!parsedEventId) {
    return { ok: false, error: "Event id is required." };
  }

  try {
    const supabase = await createSupabaseActionClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return { ok: false, error: "Unauthorized." };
    }

    await deleteEventForUser(supabase, user.id, parsedEventId);
    return { ok: true };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to delete event.";
    return { ok: false, error: message };
  }
}
