import { APIError } from '../api/modules/api-error';
import DBWrapper from './db-wrapper';
import { generateInviteCode, Invite, InviteDocument } from './models/invite';
import { Params } from './types/ws-types';

export default class Invites extends DBWrapper<string, InviteDocument> {
  public async get(code: string | undefined): Promise<InviteDocument> {
    const invite = await Invite.findById(code);
    if (!invite)
      throw new APIError(404, 'Invite Not Found');
    return invite;
  }

  public async create({ guildId, options }: Params.InviteCreate, userId: string) {
    return Invite.create({
      _id: generateInviteCode(),
      guildId,
      inviterId: userId,
      options,
      uses: 0,
    });
  }
}