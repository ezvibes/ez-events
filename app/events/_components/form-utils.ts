export function parseVenuesFromInput(value: string) {
  return value
    .split(",")
    .map((venue) => venue.trim())
    .filter(Boolean);
}

export function toIsoFromLocalDateTime(value: string) {
  return new Date(value).toISOString();
}

export function toLocalDateTimeInputValue(isoValue: string) {
  const date = new Date(isoValue);
  const localDate = new Date(date.getTime() - date.getTimezoneOffset() * 60_000);
  return localDate.toISOString().slice(0, 16);
}
