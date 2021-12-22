import { WS } from '@accord/types';
import { APIError } from '../rest/modules/api-error';
import DBWrapper from './db-wrapper';
import { Invite, InviteDocument } from './models/invite';
import generateInvite from './utils/generate-invite';

export default class Invites extends DBWrapper<string, InviteDocument> {
  public async get(code: string | undefined): Promise<InviteDocument> {
    const invite = await Invite.findById(code);
    if (!invite)
      throw new APIError(404, 'Invite Not Found');
    return invite;
  }

  public async create({ guildId, options }: WS.Params.InviteCreate, inviterId: string) {
    return await Invite.create({
      _id: generateInvite(),
      guildId,
      inviterId,
      options,
      uses: 0,
    });
  }
}