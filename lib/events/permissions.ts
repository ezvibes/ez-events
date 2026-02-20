export function canUserEditEvent(eventOwnerUserId: string, currentUserId: string) {
  return eventOwnerUserId === currentUserId;
}
