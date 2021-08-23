/** Keys of objects that cannot be updated. */
export namespace Prohibited {
  export const general: any = ['id', 'createdAt'];

  export const app: (keyof Entity.App)[] = [
    ...general,
    'owner',
    'user',
  ];
  export const channel: (keyof Entity.Channel)[] = [
    ...general,
    'guildId',
    'lastMessageId',
    'memberIds',
    'type',
  ];
  export const guild: (keyof Entity.Guild)[] = [
    ...general,
    'members',
    'nameAcronym',
  ];
  export const guildMember: (keyof Entity.GuildMember)[] = [
    ...general,
    'guildId',
    'userId',
  ];
  export const message: (keyof Entity.Message)[] = [
    ...general,
    'authorId',
    'channelId',
    'updatedAt',
  ];
  export const role: (keyof Entity.Role)[] = [
    ...general,
    'guildId',
  ];
  export const user: (keyof UserTypes.Self)[] = [
    ...general,
    'badges',
    'bot',
    'email',
    'friendIds',
    'friendRequestIds',
    'verified',
  ];
}
