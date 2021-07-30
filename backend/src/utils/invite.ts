import uuid from 'uuid';

export function generateInvite(length = 6) {
  return uuid
    .v4()
    .replace(/-/g, '')
    .slice(0, length);
}