import { SelfUserDocument } from '@acrd/backend/data/models/user';
import emitAsync from './emit-async';

export default async (user: SelfUserDocument) => {
  const token = await deps.users.createToken(user);
  return emitAsync('READY', { token });
}