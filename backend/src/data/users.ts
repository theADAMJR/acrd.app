import DBWrapper from './db-wrapper';
import jwt from 'jsonwebtoken';
import { SelfUserDocument, User, UserDocument } from './models/user';
import { generateSnowflake } from './snowflake-entity';

import { Guild } from './models/guild';
import { APIError } from '../api/modules/api-error';
import Deps from '../utils/deps';
import Guilds from './guilds';
import { Channel } from './models/channel';
import Channels from './channels';

export default class Users extends DBWrapper<string, UserDocument> {
  constructor(
    private channels = Deps.get<Channels>(Channels),
    private guilds = Deps.get<Guilds>(Guilds),
  ) { super(); }

  public async get(id: string | undefined): Promise<UserDocument> {
    const user = await User.findById(id);
    if (!user)
      throw new APIError(404, 'User Not Found');

    return this.secure(user);
  }

  // TODO: test that this is fully secure
  public secure(user: UserDocument): UserDocument {
    delete user['email'];
    delete user['verified'];
    delete user['ignored'];
    delete user['lastReadMessages'];
    return user;
  }

  public async getSelf(id: string | undefined, populateGuilds = true): Promise<SelfUserDocument> {
    const user = await this.get(id) as SelfUserDocument;
    if (populateGuilds)
      user.guilds = (await this.populateGuilds(user)).guilds as Entity.Guild[];

    return user;
  }

  private async populateGuilds(user: UserDocument) {
    const guilds: Entity.Guild[] = [];
    for (const id of user.guilds) {
      const isDuplicate = guilds.some(g => g.id === id);
      if (isDuplicate) continue;

      try {
        const guild = await this.guilds.get(id as string, true);
        guilds.push(new Guild(guild).toJSON());
      } catch { }
    }
    user.guilds = guilds as any;
    return user;
  }

  public async getByUsername(username: string): Promise<SelfUserDocument> {
    const user = await User.findOne({ username }) as SelfUserDocument;
    if (!user)
      throw new APIError(404, 'User Not Found');
    return user;
  }
  public async getByEmail(email: string): Promise<SelfUserDocument> {
    const user = await User.findOne({ email }) as SelfUserDocument;
    if (!user)
      throw new APIError(404, 'User Not Found');
    return user;
  }

  public async getKnown(userId: string) {
    const user = await this.getSelf(userId);

    return await User.find({
      _id: await this.getKnownIds(user) as any,
    }) as UserDocument[];
  }

  public async getRoomIds(user: UserTypes.Self) {
    const dmUsers = await Channel.find({ memberIds: user.id });
    const dmUserIds = dmUsers.flatMap(u => u.memberIds);

    return Array.from(new Set([
      user.id,
      ...dmUserIds,
      ...user.friendRequestIds,
      ...user.friendIds,
    ]));
  }

  public async getKnownIds(user: UserTypes.Self) {
    const incomingUsers = await User.find({
      friendIds: user.id,
      friendRequestIds: user.id,
    });
    const incomingUserIds = incomingUsers.map(u => u.id);

    const guildUserIds = user.guilds
      .flatMap(g => g.members.map(g => g.userId));

    const dmUsers = await Channel.find({ memberIds: user.id });
    const dmUserIds = dmUsers.flatMap(u => u.memberIds);

    return Array.from(new Set([
      user.id,
      ...dmUserIds,
      ...guildUserIds,
      ...incomingUserIds,
      ...user.friendRequestIds,
      ...user.friendIds,
    ]));
  }

  public async getDMChannels(userId: string) {
    return await Channel.find({ memberIds: userId });
  }

  public createToken(userId: string, expire = true) {
    return jwt.sign(
      { _id: userId },
      'secret',
      (expire) ? { expiresIn: '7d' } : {}
    );
  }

  public idFromAuth(auth: string | undefined): string {
    const token = auth?.slice('Bearer '.length);
    return this.verifyToken(token);
  }
  public verifyToken(token: string | undefined): string {
    const decoded = jwt.verify(token as string, 'secret') as UserToken;
    return decoded?._id;
  }

  public async create({ email, username, password }: Auth.Credentials, bot = false): Promise<UserDocument> {
    const count = await User.countDocuments({ username });
    const discriminator = count + 1;
    if (discriminator > 9999)
      throw new TypeError('Too many users have this username');

    return (User as any).register({
      _id: generateSnowflake(),
      username,
      discriminator,
      avatarURL: `/avatars/avatar_grey.png`,
      badges: [],
      bot,
      email,
      friends: [],
      status: 'ONLINE',
    }, password);
  }
}

interface UserToken { _id: string };
