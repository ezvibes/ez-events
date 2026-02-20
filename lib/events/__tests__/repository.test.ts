import { SupabaseClient } from "@supabase/supabase-js";
import { EventRecord } from "@/lib/events/types";
import { listEventsForUser, updateEventForUser } from "@/lib/events/repository";

function makeListBuilder(response: {
  data: EventRecord[] | null;
  error: { message: string } | null;
  count: number | null;
}) {
  const builder = {
    data: response.data,
    error: response.error,
    count: response.count,
    select: jest.fn(),
    order: jest.fn(),
    range: jest.fn(),
    ilike: jest.fn(),
    eq: jest.fn(),
    gte: jest.fn(),
    lte: jest.fn(),
  };

  builder.select.mockReturnValue(builder);
  builder.order.mockReturnValue(builder);
  builder.range.mockReturnValue(builder);
  builder.ilike.mockReturnValue(builder);
  builder.eq.mockReturnValue(builder);
  builder.gte.mockReturnValue(builder);
  builder.lte.mockReturnValue(builder);

  return builder;
}

describe("events repository", () => {
  test("listEventsForUser returns mapped events and applies query filters", async () => {
    const startsAt = "2026-02-14T10:00:00.000Z";
    const record: EventRecord = {
      id: "event-1",
      owner_user_id: "owner-1",
      name: "Women Final",
      sport_type: "curling",
      starts_at: startsAt,
      ends_at: null,
      venues: ["Cortina Sheet A"],
      description: "Playoff",
      created_at: startsAt,
      updated_at: startsAt,
    };

    const builder = makeListBuilder({
      data: [record],
      error: null,
      count: 1,
    });

    const supabase = {
      from: jest.fn().mockReturnValue(builder),
    } as unknown as SupabaseClient;

    const result = await listEventsForUser(supabase, {
      page: 1,
      pageSize: 20,
      q: "women",
      sportType: "curling",
      startsAfterIso: "2026-02-01T00:00:00.000Z",
      startsBeforeIso: "2026-03-01T00:00:00.000Z",
    });

    expect(supabase.from).toHaveBeenCalledWith("events");
    expect(builder.ilike).toHaveBeenCalledWith("name", "%women%");
    expect(builder.eq).toHaveBeenCalledWith("sport_type", "curling");
    expect(builder.gte).toHaveBeenCalledWith("starts_at", "2026-02-01T00:00:00.000Z");
    expect(builder.lte).toHaveBeenCalledWith("starts_at", "2026-03-01T00:00:00.000Z");
    expect(result.total).toBe(1);
    expect(result.events[0]).toMatchObject({
      id: "event-1",
      name: "Women Final",
      sportType: "curling",
      venues: ["Cortina Sheet A"],
    });
  });

  test("updateEventForUser throws when row is missing", async () => {
    const maybeSingle = jest.fn().mockResolvedValue({ data: null, error: null });
    const select = jest.fn().mockReturnValue({ maybeSingle });
    const eqSecond = jest.fn().mockReturnValue({ select });
    const eqFirst = jest.fn().mockReturnValue({ eq: eqSecond });
    const update = jest.fn().mockReturnValue({ eq: eqFirst });

    const supabase = {
      from: jest.fn().mockReturnValue({ update }),
    } as unknown as SupabaseClient;

    await expect(
      updateEventForUser(supabase, "user-1", "event-1", { name: "Updated" })
    ).rejects.toThrow("Event not found.");

    expect(update).toHaveBeenCalledWith({ name: "Updated" });
    expect(eqFirst).toHaveBeenCalledWith("id", "event-1");
    expect(eqSecond).toHaveBeenCalledWith("owner_user_id", "user-1");
  });
});
