import {
  parseCreateEventDto,
  parseUpdateEventRequestDto,
} from "@/lib/events/types";

describe("events types parsing", () => {
  test("parseCreateEventDto returns normalized payload for valid input", () => {
    const result = parseCreateEventDto({
      name: "  Women's Curling Semifinal ",
      sportType: "curling",
      startsAtIso: "2026-02-14T10:00:00.000Z",
      venues: ["  Cortina Sheet A  ", " "],
      description: "  Playoff round ",
    });

    expect(result.ok).toBe(true);
    if (!result.ok) return;

    expect(result.data).toEqual({
      name: "Women's Curling Semifinal",
      sportType: "curling",
      startsAtIso: "2026-02-14T10:00:00.000Z",
      endsAtIso: null,
      venues: ["Cortina Sheet A"],
      description: "Playoff round",
    });
  });

  test("parseCreateEventDto rejects when venues are empty after trim", () => {
    const result = parseCreateEventDto({
      name: "Event",
      sportType: "curling",
      startsAtIso: "2026-02-14T10:00:00.000Z",
      venues: [" ", ""],
    });

    expect(result).toEqual({
      ok: false,
      error: "At least one venue is required.",
    });
  });

  test("parseUpdateEventRequestDto rejects empty update object", () => {
    const result = parseUpdateEventRequestDto({ update: {} });

    expect(result).toEqual({
      ok: false,
      error: "update must include at least one editable field.",
    });
  });

  test("parseUpdateEventRequestDto accepts partial updates", () => {
    const result = parseUpdateEventRequestDto({
      update: {
        name: "  Updated name ",
        description: "  Updated description ",
      },
    });

    expect(result.ok).toBe(true);
    if (!result.ok) return;

    expect(result.data.update).toEqual({
      name: "Updated name",
      description: "Updated description",
    });
  });
});
