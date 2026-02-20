import { canUserEditEvent } from "@/lib/events/permissions";

describe("event permissions", () => {
  test("allows edit when current user owns the event", () => {
    expect(canUserEditEvent("user-1", "user-1")).toBe(true);
  });

  test("hides edit when current user does not own the event", () => {
    expect(canUserEditEvent("owner-1", "viewer-2")).toBe(false);
  });
});
