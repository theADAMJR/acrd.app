import { v4 } from 'uuid';

export default function (length = 6) {
  return v4()
    .replace(/-/g, '')
    .slice(0, length);
}