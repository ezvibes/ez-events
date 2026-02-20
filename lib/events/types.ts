export const SPORT_TYPES = [
  "curling",
  "ski_jumping",
  "snowboard_superpipe",
  "alpine_skiing",
  "biathlon",
  "figure_skating",
  "ice_hockey",
  "short_track",
  "cross_country_skiing",
  "freestyle_skiing",
  "luge",
  "bobsleigh",
  "skeleton",
] as const;

export type SportType = (typeof SPORT_TYPES)[number];

export type Event = {
  id: string;
  ownerUserId: string;
  name: string;
  sportType: SportType | string;
  startsAt: Date;
  endsAt: Date | null;
  venues: string[];
  description: string | null;
  createdAt: Date;
  updatedAt: Date;
};

export type EventRecord = {
  id: string;
  owner_user_id: string;
  name: string;
  sport_type: string;
  starts_at: string;
  ends_at: string | null;
  venues: string[] | null;
  description: string | null;
  created_at: string;
  updated_at: string;
};

export type CreateEventDto = {
  name: string;
  sportType: SportType | string;
  startsAtIso: string;
  endsAtIso?: string | null;
  venues: string[];
  description?: string | null;
};

export type EventUpdateInputDto = {
  name?: string;
  sportType?: SportType | string;
  startsAtIso?: string;
  venues?: string[];
  description?: string | null;
};

export type UpdateEventRequestDto = {
  update: EventUpdateInputDto;
};

export type EventListQueryDto = {
  q?: string;
  sportType?: SportType | string;
  page?: number;
  pageSize?: number;
  startsAfterIso?: string;
  startsBeforeIso?: string;
};

export type ValidationResult<T> =
  | { ok: true; data: T }
  | { ok: false; error: string };

export function formatSportTypeLabel(value: string) {
  return value.replaceAll("_", " ");
}

export function mapEventRecordToEvent(record: EventRecord): Event {
  return {
    id: record.id,
    ownerUserId: record.owner_user_id,
    name: record.name,
    sportType: record.sport_type,
    startsAt: new Date(record.starts_at),
    endsAt: record.ends_at ? new Date(record.ends_at) : null,
    venues: record.venues ?? [],
    description: record.description,
    createdAt: new Date(record.created_at),
    updatedAt: new Date(record.updated_at),
  };
}

export function mapCreateEventDtoToInsert(dto: CreateEventDto, ownerUserId: string) {
  return {
    owner_user_id: ownerUserId,
    name: dto.name.trim(),
    sport_type: dto.sportType,
    starts_at: dto.startsAtIso,
    ends_at: dto.endsAtIso ?? null,
    venues: dto.venues,
    description: dto.description ?? null,
  };
}

export function mapUpdateEventDtoToPatch(dto: EventUpdateInputDto) {
  const patch: Record<string, string | string[] | null> = {};

  if (dto.name !== undefined) patch.name = dto.name.trim();
  if (dto.sportType !== undefined) patch.sport_type = dto.sportType;
  if (dto.startsAtIso !== undefined) patch.starts_at = dto.startsAtIso;
  if (dto.venues !== undefined) patch.venues = dto.venues;
  if (dto.description !== undefined) patch.description = dto.description;

  return patch;
}

export function parseCreateEventDto(input: unknown): ValidationResult<CreateEventDto> {
  if (!input || typeof input !== "object") {
    return { ok: false, error: "Request body must be a JSON object." };
  }

  const body = input as Record<string, unknown>;
  const name = typeof body.name === "string" ? body.name.trim() : "";
  const sportType =
    typeof body.sportType === "string" ? body.sportType.trim() : "";
  const startsAtIso =
    typeof body.startsAtIso === "string" ? body.startsAtIso.trim() : "";
  const endsAtIso =
    typeof body.endsAtIso === "string" ? body.endsAtIso.trim() : null;
  const description =
    typeof body.description === "string" ? body.description.trim() : null;

  if (!name) return { ok: false, error: "name is required." };
  if (!sportType) return { ok: false, error: "sportType is required." };
  if (!isValidDate(startsAtIso)) {
    return { ok: false, error: "startsAtIso must be a valid ISO datetime." };
  }
  if (endsAtIso && !isValidDate(endsAtIso)) {
    return { ok: false, error: "endsAtIso must be a valid ISO datetime." };
  }

  const rawVenues = body.venues;
  if (!Array.isArray(rawVenues)) {
    return { ok: false, error: "venues must be an array of strings." };
  }

  const venues = rawVenues
    .filter((value): value is string => typeof value === "string")
    .map((value) => value.trim())
    .filter(Boolean);

  if (venues.length === 0) {
    return { ok: false, error: "At least one venue is required." };
  }

  return {
    ok: true,
    data: {
      name,
      sportType,
      startsAtIso,
      endsAtIso,
      venues,
      description,
    },
  };
}

export function parseEventListQuery(
  searchParams: URLSearchParams
): ValidationResult<EventListQueryDto> {
  const q = searchParams.get("q")?.trim() || undefined;
  const sportType = searchParams.get("sportType")?.trim() || undefined;
  const page = parsePositiveInt(searchParams.get("page"), 1);
  const pageSize = parsePositiveInt(searchParams.get("pageSize"), 20);
  const startsAfterIso = searchParams.get("startsAfterIso")?.trim() || undefined;
  const startsBeforeIso =
    searchParams.get("startsBeforeIso")?.trim() || undefined;

  if (startsAfterIso && !isValidDate(startsAfterIso)) {
    return { ok: false, error: "startsAfterIso must be a valid ISO datetime." };
  }
  if (startsBeforeIso && !isValidDate(startsBeforeIso)) {
    return { ok: false, error: "startsBeforeIso must be a valid ISO datetime." };
  }

  return {
    ok: true,
    data: {
      q,
      sportType,
      page,
      pageSize: Math.min(pageSize, 100),
      startsAfterIso,
      startsBeforeIso,
    },
  };
}

export function parseUpdateEventRequestDto(
  input: unknown
): ValidationResult<UpdateEventRequestDto> {
  if (!input || typeof input !== "object") {
    return { ok: false, error: "Request body must be a JSON object." };
  }

  const body = input as Record<string, unknown>;
  const rawUpdate = body.update;

  if (!rawUpdate || typeof rawUpdate !== "object" || Array.isArray(rawUpdate)) {
    return { ok: false, error: "update object is required." };
  }

  const source = rawUpdate as Record<string, unknown>;
  const update: EventUpdateInputDto = {};
  let hasAtLeastOneField = false;

  if ("name" in source) {
    if (typeof source.name !== "string") {
      return { ok: false, error: "update.name must be a string." };
    }
    const name = source.name.trim();
    if (!name) {
      return { ok: false, error: "update.name cannot be empty." };
    }
    update.name = name;
    hasAtLeastOneField = true;
  }

  if ("sportType" in source) {
    if (typeof source.sportType !== "string") {
      return { ok: false, error: "update.sportType must be a string." };
    }
    const sportType = source.sportType.trim();
    if (!sportType) {
      return { ok: false, error: "update.sportType cannot be empty." };
    }
    update.sportType = sportType;
    hasAtLeastOneField = true;
  }

  if ("startsAtIso" in source) {
    if (typeof source.startsAtIso !== "string") {
      return { ok: false, error: "update.startsAtIso must be a string." };
    }
    const startsAtIso = source.startsAtIso.trim();
    if (!startsAtIso || !isValidDate(startsAtIso)) {
      return {
        ok: false,
        error: "update.startsAtIso must be a valid ISO datetime.",
      };
    }
    update.startsAtIso = startsAtIso;
    hasAtLeastOneField = true;
  }

  if ("venues" in source) {
    if (!Array.isArray(source.venues)) {
      return { ok: false, error: "update.venues must be an array of strings." };
    }
    const venues = source.venues
      .filter((value): value is string => typeof value === "string")
      .map((value) => value.trim())
      .filter(Boolean);

    if (venues.length === 0) {
      return {
        ok: false,
        error: "update.venues must include at least one venue.",
      };
    }

    update.venues = venues;
    hasAtLeastOneField = true;
  }

  if ("description" in source) {
    if (source.description !== null && typeof source.description !== "string") {
      return {
        ok: false,
        error: "update.description must be a string or null.",
      };
    }

    const description =
      typeof source.description === "string" ? source.description.trim() : null;
    update.description = description || null;
    hasAtLeastOneField = true;
  }

  if (!hasAtLeastOneField) {
    return {
      ok: false,
      error: "update must include at least one editable field.",
    };
  }

  return {
    ok: true,
    data: {
      update,
    },
  };
}

function isValidDate(value: string) {
  return !Number.isNaN(Date.parse(value));
}

function parsePositiveInt(value: string | null, fallback: number) {
  if (!value) return fallback;
  const parsed = Number.parseInt(value, 10);
  if (Number.isNaN(parsed) || parsed < 1) return fallback;
  return parsed;
}
