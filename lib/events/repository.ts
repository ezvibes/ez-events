import { SupabaseClient } from "@supabase/supabase-js";
import {
  CreateEventDto,
  EventUpdateInputDto,
  EventListQueryDto,
  EventRecord,
  mapCreateEventDtoToInsert,
  mapEventRecordToEvent,
  mapUpdateEventDtoToPatch,
} from "@/lib/events/types";

const EVENT_SELECT_COLUMNS =
  "id, owner_user_id, name, sport_type, starts_at, ends_at, venues, description, created_at, updated_at";

type ListEventsResult = {
  events: ReturnType<typeof mapEventRecordToEvent>[];
  total: number;
  page: number;
  pageSize: number;
};

export async function listEventsForUser(
  supabase: SupabaseClient,
  query: EventListQueryDto
): Promise<ListEventsResult> {
  const page = query.page ?? 1;
  const pageSize = query.pageSize ?? 20;
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  let builder = supabase
    .from("events")
    .select(EVENT_SELECT_COLUMNS, { count: "exact" })
    .order("starts_at", { ascending: true })
    .range(from, to);

  if (query.q) {
    builder = builder.ilike("name", `%${query.q}%`);
  }
  if (query.sportType) {
    builder = builder.eq("sport_type", query.sportType);
  }
  if (query.startsAfterIso) {
    builder = builder.gte("starts_at", query.startsAfterIso);
  }
  if (query.startsBeforeIso) {
    builder = builder.lte("starts_at", query.startsBeforeIso);
  }

  const { data, error, count } = await builder;
  if (error) {
    throw new Error(error.message);
  }

  const rows = (data ?? []) as EventRecord[];
  return {
    events: rows.map(mapEventRecordToEvent),
    total: count ?? 0,
    page,
    pageSize,
  };
}

export async function createEventForUser(
  supabase: SupabaseClient,
  userId: string,
  dto: CreateEventDto
) {
  const insertPayload = mapCreateEventDtoToInsert(dto, userId);
  const { data, error } = await supabase
    .from("events")
    .insert(insertPayload)
    .select(EVENT_SELECT_COLUMNS)
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return mapEventRecordToEvent(data as EventRecord);
}

export async function getEventByIdForUser(
  supabase: SupabaseClient,
  userId: string,
  eventId: string
) {
  const { data, error } = await supabase
    .from("events")
    .select(EVENT_SELECT_COLUMNS)
    .eq("id", eventId)
    .eq("owner_user_id", userId)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  if (!data) {
    return null;
  }

  return mapEventRecordToEvent(data as EventRecord);
}

export async function updateEventForUser(
  supabase: SupabaseClient,
  userId: string,
  eventId: string,
  update: EventUpdateInputDto
) {
  const patch = mapUpdateEventDtoToPatch(update);

  const { data, error } = await supabase
    .from("events")
    .update(patch)
    .eq("id", eventId)
    .eq("owner_user_id", userId)
    .select(EVENT_SELECT_COLUMNS)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  if (!data) {
    throw new Error("Event not found.");
  }

  return mapEventRecordToEvent(data as EventRecord);
}

export async function deleteEventForUser(
  supabase: SupabaseClient,
  userId: string,
  eventId: string
) {
  const { data, error } = await supabase
    .from("events")
    .delete()
    .eq("id", eventId)
    .eq("owner_user_id", userId)
    .select("id")
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  if (!data) {
    throw new Error("Event not found.");
  }
}

export async function registerForEvent(
  supabase: SupabaseClient,
  userId: string,
  eventId: string
) {
  const { error } = await supabase.from("event_registrations").insert({
    event_id: eventId,
    user_id: userId,
  });

  if (error) {
    // Unique violation means the user is already registered; treat as idempotent success.
    if (error.code === "23505") {
      return;
    }

    throw new Error(error.message);
  }
}

export async function listRegisteredEventIdsForUser(
  supabase: SupabaseClient,
  userId: string,
  eventIds: string[]
) {
  if (eventIds.length === 0) {
    return new Set<string>();
  }

  const { data, error } = await supabase
    .from("event_registrations")
    .select("event_id")
    .eq("user_id", userId)
    .in("event_id", eventIds);

  if (error) {
    throw new Error(error.message);
  }

  const ids = (data ?? [])
    .map((row) => row.event_id)
    .filter((value): value is string => typeof value === "string");

  return new Set(ids);
}
