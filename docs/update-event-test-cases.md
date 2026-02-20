# Update Event Action Test Cases

Action: `updateEventAction(eventId, { update: { ... } })`

UI path for manual testing: `/events/:id/edit`

Contract:

```json
{
  "update": {
    "...": "..."
  }
}
```

## Preconditions

1. User is logged in.
2. You have one valid event ID you own (from `/events` list).

## Case 1: Successful full update

Request body:

```json
{
  "update": {
    "name": "Updated Event Name",
    "sportType": "curling",
    "startsAtIso": "2026-02-28T15:00:00Z",
    "venues": ["Cortina Curling Olympic Arena"],
    "description": "Updated through PUT endpoint"
  }
}
```

Expected:

- Save succeeds
- Redirect to `/events`
- Success toast appears

## Case 2: Partial update (description only)

Request body:

```json
{
  "update": {
    "description": "Description-only patch"
  }
}
```

Expected:

- Save succeeds
- Only `description` changes

## Case 3: Validation failure, empty update object

Request body:

```json
{
  "update": {}
}
```

Expected:

- Action returns `ok: false`
- Error: `update must include at least one editable field.`

## Case 4: Validation failure, invalid startsAtIso

Request body:

```json
{
  "update": {
    "startsAtIso": "not-a-date"
  }
}
```

Expected:

- Action returns `ok: false`
- Error: `update.startsAtIso must be a valid ISO datetime.`

## Case 5: Validation failure, invalid venues

Request body:

```json
{
  "update": {
    "venues": []
  }
}
```

Expected:

- Action returns `ok: false`
- Error: `update.venues must include at least one venue.`

## Case 6: Not found / unauthorized ownership

Request body:

```json
{
  "update": {
    "name": "Attempt update"
  }
}
```

Use an event ID owned by another user, or a random UUID.

Expected:

- Action returns `ok: false`
- Error indicates event was not found or update failed.
