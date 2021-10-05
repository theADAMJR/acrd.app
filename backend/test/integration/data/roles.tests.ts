import { expect } from 'chai';
import { GuildDocument } from '../../../src/data/models/guild';
import { GuildMember, GuildMemberDocument } from '../../../src/data/models/guild-member';
import { Role, RoleDocument } from '../../../src/data/models/role';
import Roles from '../../../src/data/roles';
import { Mock } from '../../mock/mock';

describe('data/roles', () => {
  let roles: Roles;
  let guild: GuildDocument;
  let noobMember: GuildMemberDocument;
  let everyoneRole: RoleDocument;
  
  beforeEach(async () => {
    roles = new Roles();
    guild = await Mock.guild();
    noobMember = (await GuildMember.find({ guildId: guild.id }))![1];
    everyoneRole = await Role.findOne({ guildId: guild.id });
  });

  afterEach(() => Mock.cleanDB());
  
  it('isHigher: is noob, same level role, returns false', async () => {
    const result = await roles.isHigher(guild, noobMember, [everyoneRole.id]);
    expect(result).to.be.false;
  });
  it('isHigher: is owner, not highest role, returns false', async () => {
    await Mock.role(guild);
    const ownerMember = await GuildMember.findOne({ guildId: guild.id, userId: guild.ownerId });
    
    const result = await roles.isHigher(guild, ownerMember, [everyoneRole.id]);
    expect(result).to.be.false;
  });
  it('isHigher: is noob, not highest role, returns true', async () => {
    const higherRole = await Mock.role(guild);
    
    const result = await roles.isHigher(guild, noobMember, [higherRole.id]);
    expect(result).to.be.true;
  });
});