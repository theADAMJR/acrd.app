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
  
  it('memberIsHigher: is noob, same level role, returns false', async () => {
    const result = await roles.memberIsHigher(guild, noobMember, [everyoneRole.id]);
    expect(result).to.be.false;
  });
  it('memberIsHigher: is owner, nothing is above them, returns true', async () => {
    const higherRole = await Mock.role(guild.id);
    const ownerMember = await GuildMember.findOne({ guildId: guild.id, userId: guild.ownerId });
    
    const result = await roles.memberIsHigher(guild, ownerMember, [higherRole.id]);
    expect(result).to.be.true;
  });
  it('memberIsHigher: is noob, not highest role, returns false', async () => {
    const higherRole = await Mock.role(guild.id);
    
    const result = await roles.memberIsHigher(guild, noobMember, [higherRole.id]);
    expect(result).to.be.false;
  });
  it('memberIsHigher: has manager role, is higher than admin, returns false', async () => {
    const roleManagerRole = await Mock.role(guild.id, { position: 1 });
    const adminRole = await Mock.role(guild.id, { position: 10 });
    noobMember.roleIds.push(roleManagerRole.id);
    await noobMember.save();
    
    const result = await roles.memberIsHigher(guild, noobMember, [adminRole.id]);
    expect(result).to.be.false;
  });
  it('memberIsHigher: has admin role, is highest role in guild, returns false', async () => {
    const adminRole = await Mock.role(guild.id, { position: 10 });
    noobMember.roleIds.push(adminRole.id);
    await noobMember.save();
    
    const result = await roles.memberIsHigher(guild, noobMember, [adminRole.id]);
    expect(result).to.be.false;
  });
});