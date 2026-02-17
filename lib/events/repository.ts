import { SupabaseClient } from "@supabase/supabase-js";
import {
  CreateEventDto,
  EventListQueryDto,
  EventRecord,
  mapCreateEventDtoToInsert,
  mapEventRecordToEvent,
} from "@/lib/events/types";

type ListEventsResult = {
  events: ReturnType<typeof mapEventRecordToEvent>[];
  total: number;
  page: number;
  pageSize: number;
};

export async function listEventsForUser(
  supabase: SupabaseClient,
  userId: string,
  query: EventListQueryDto
): Promise<ListEventsResult> {
  const page = query.page ?? 1;
  const pageSize = query.pageSize ?? 20;
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  let builder = supabase
    .from("events")
    .select(
      "id, owner_user_id, name, sport_type, starts_at, ends_at, venues, description, created_at, updated_at",
      { count: "exact" }
    )
    .eq("owner_user_id", userId)
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
    .select(
      "id, owner_user_id, name, sport_type, starts_at, ends_at, venues, description, created_at, updated_at"
    )
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return mapEventRecordToEvent(data as EventRecord);
}
