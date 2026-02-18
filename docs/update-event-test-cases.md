# Update Event API Test Cases

Endpoint: `PUT /api/events/:id`

Contract:

```json
{
  "update": {
    "...": "..."
  }
}
```

## Preconditions

1. User is logged in (session cookie is present).
2. You have one valid event ID you own (call `GET /api/events?page=1&pageSize=1`).

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

- Status: `200`
- Response has `event.id` matching `:id`
- Updated values are returned

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

- Status: `200`
- Only `description` changes

## Case 3: Validation failure, empty update object

Request body:

```json
{
  "update": {}
}
```

Expected:

- Status: `400`
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

- Status: `400`
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

- Status: `400`
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

Use a random UUID or an event ID owned by another user.

Expected:

- Status: `404`
- Error: `Event not found.`
