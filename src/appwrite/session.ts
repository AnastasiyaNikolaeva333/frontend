let sessionUserId: string | null = null;

export function setSessionUserId(id: string | null) {
  sessionUserId = id;
}

export function getSessionUserId() {
  return sessionUserId;
}
