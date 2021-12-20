import emitReady from './emit-ready';

export default async () => {
  const randomUser = await deps.users.create({
    email: 'user2@example.com',
    username: 'Test User 2',
    password: 'doesnotmatter',
  });
  await emitReady(randomUser);
}