import emitReady from './emit-ready';

export default async (guildId: string) => {
  const noobUser = await deps.users.create({
    email: 'user2@example.com',
    username: 'Test User 2',
    password: 'doesnotmatter',
  });
  await deps.guildMembers.create({ userId: noobUser.id, guildId });
  await emitReady(noobUser);
}