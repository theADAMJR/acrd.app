import DBWrapper from './db-wrapper';
import jwt from 'jsonwebtoken';
import { SelfUserDocument, User, UserDocument } from './models/user';
import { generateSnowflake } from './snowflake-entity';
import { readdirSync } from 'fs';
import { resolve } from 'path';
import { Lean, UserTypes } from './types/entity-types';
import { Guild } from './models/guild';
import { APIError } from '../api/modules/api-error';
import Deps from '../utils/deps';
import Guilds from './guilds';
import { Channel } from './models/channel';

export default class Users extends DBWrapper<string, UserDocument> {
  private avatarNames: string[] = [];
  private systemUser: UserDocument;

  constructor(private guilds = Deps.get<Guilds>(Guilds)) {
    super();

    this.avatarNames = readdirSync(resolve('assets/avatars'))
      .filter(n => n.startsWith('avatar'));
  }

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
      user.guilds = (await this.populateGuilds(user)).guilds as Lean.Guild[];

    return user;
  }

  private async populateGuilds(user: UserDocument) {
    const guilds: Lean.Guild[] = [];
    for (const id of user.guilds) {
      const isDuplicate = guilds.some(g => g.id === id);
      if (isDuplicate) continue;

      try {
        const guild = await this.guilds.get(id as string, true); 
        guilds.push(new Guild(guild).toJSON());
      } catch {}
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
      this.systemUser?.id,
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
      this.systemUser?.id,
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

  public async updateSystemUser() {
    const username = '2PG';
    return this.systemUser = await User.findOne({ username })
      ?? await User.create({
        _id: generateSnowflake(),
        avatarURL: `${process.env.API_URL ?? 'http://localhost:3000'}/avatars/bot.png`,
        friendRequestIds: [],
        badges: [],
        bot: true,
        status: 'ONLINE',
        username,
        friendIds: [],
        guilds: [],
      });
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
    const key = jwt.verify(token as string, 'secret') as UserToken;   
    return key?._id;
  }

  public create(username: string, password: string, bot = false): Promise<UserDocument> {
    const randomAvatar = this.getRandomAvatar();
    return (User as any).register({
      _id: generateSnowflake(),
      username,
      avatarURL: `${process.env.API_URL ?? 'http://localhost:3000'}/avatars/${randomAvatar}`,
      badges: [],
      bot,
      email: `${generateSnowflake()}@avoid-mongodb-error.com`, // FIXME
      friends: [],
      status: 'ONLINE',
    }, password);
  }

  private getRandomAvatar() {
    const randomIndex = Math.floor(Math.random() * this.avatarNames.length);
    return this.avatarNames[randomIndex];
  }
}

interface UserToken { _id: string };
