import DBWrapper from './db-wrapper';
import jwt from 'jsonwebtoken';
import { SelfUserDocument, User, UserDocument } from './models/user';
import { generateSnowflake } from './snowflake-entity';
import { APIError } from '../rest/modules/api-error';
import { GuildMember } from './models/guild-member';
import { Guild, GuildDocument } from './models/guild';
import { UpdateQuery } from 'mongoose';

export default class Users extends DBWrapper<string, UserDocument> {
  public async get(id: string | undefined): Promise<UserDocument> {
    const user = await User.findById(id);
    if (!user)
      throw new APIError(404, 'User Not Found');

    return this.secure(user);
  }

  // TODO: test that this is fully secure
  public secure(user: UserDocument): UserDocument {
    const u = user as any;
    u.email = undefined;
    u.locked = undefined;
    u.ignored = undefined;
    u.lastReadMessageIds = undefined;
    u.verified = undefined;
    return u;
  }

  public async getSelf(id: string | undefined): Promise<SelfUserDocument> {
    const user = await User.findById(id);
    if (!user)
      throw new APIError(404, 'User Not Found');
    return user as any as SelfUserDocument;  
  }
  public async getByEmail(email: string): Promise<SelfUserDocument> {
    const user = await User.findOne({ email }) as any as SelfUserDocument;
    if (!user)
      throw new APIError(404, 'User Not Found');
    return user;
  }

  public async getKnown(userId: string) {
    const user = await this.getSelf(userId);
    return await User.find({ _id: { $in: await this.getKnownIds(user) } });
  }  
  public async getKnownIds(user: UserTypes.Self) {
    const members = await GuildMember.find({ guildId: { $in: user.guildIds } });
    const memberIds = members.map(m => m.userId);

    return Array.from(new Set([user.id, ...memberIds]));
  }

  public async updateById(id: string | undefined, partial: UpdateQuery<SelfUserDocument>) {
    await User.updateOne({ _id: id }, partial);
  }

  public createToken(userId: string, expire = true) {
    return jwt.sign(
      { _id: userId },
      'secret',
      (expire) ? { expiresIn: '7d' } : {},
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

  public async getUserGuilds(userId: string): Promise<GuildDocument[]> {
    const user = await this.getSelf(userId);
    return await Guild.find({ _id: { $in: user.guildIds } });
  }

  public async create({ email, username, password }: Auth.Credentials, bot = false): Promise<UserDocument> {
    return (User as any).register({
      _id: generateSnowflake(),
      username,
      discriminator: await this.getDiscriminator(username),
      avatarURL: `/avatars/avatar_grey.png`,
      badges: [],
      bot,
      email,
      friends: [],
      status: 'ONLINE',
    }, password);
  }

  public async getDiscriminator(username: string) {
    const count = await User.countDocuments({ username });
    const discriminator = count + 1;
    if (discriminator > 9999)
      throw new TypeError('Too many users have this username');

    return discriminator;
  }
}

interface UserToken { _id: string };
