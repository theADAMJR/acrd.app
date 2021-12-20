import { SelfUserDocument } from '@accord/backend/data/models/user';

export default async (user: SelfUserDocument) => {
  const token = await deps.users.createToken(user);
  socket.emit('READY', { token });
}