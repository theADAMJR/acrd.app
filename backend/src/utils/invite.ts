import { v4 } from 'uuid';

export function generateInvite(length = 6) {
  return v4()
    .replace(/-/g, '')
    .slice(0, length);
}