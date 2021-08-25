import { APIError } from '../api/modules/api-error';
import { WS } from '../types/ws';
import DBWrapper from './db-wrapper';
import { Guild } from './models/guild';
import { Invite, InviteDocument } from './models/invite';
import generateInvite from './utils/generate-invite';

export default class Invites extends DBWrapper<string, InviteDocument> {
  public async get(code: string | undefined): Promise<InviteDocument> {
    const invite = await Invite.findById(code);
    if (!invite)
      throw new APIError(404, 'Invite Not Found');
    return invite;
  }

  public async create({ guildId, options }: WS.Params.InviteCreate, userId: string) {
    const invite = await Invite.create({
      _id: generateInvite(),
      guildId,
      inviterId: userId,
      options,
      uses: 0,
    });
    await Guild.updateOne(
      { _id: guildId },
      { $push: { invites: invite } }
    );
    return invite;
  }
}