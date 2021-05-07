import { TestBed } from '@angular/core/testing';
import { AppModule } from 'src/app/app.module';
import { Lean } from 'src/app/types/entity-types';
import { AccordMock } from 'src/tests/accord-mock';
import { GuildService } from '../guild.service';
import { UserService } from '../user.service';

import { GuildEventService } from './guild-event.service';

describe('GuildEventService', () => {
  let service: GuildEventService;
  let userService: UserService;
  let guildService: GuildService;

  beforeEach(() => {
    TestBed
      .configureTestingModule({ imports: [AppModule] })
      .compileComponents();

    service = TestBed.inject(GuildEventService);
    userService = TestBed.inject(UserService);
    guildService = TestBed.inject(GuildService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
  
  it('create role, adds role to guild', () => {
    const guild = addGuild();
    
    const role = AccordMock.role(guild._id);
    service.createRole({
      guildId: guild._id,
      role,
    });
    
    expect(guild.roles).toContain(role);
  });
  
  it('delete role, removes role from guild', () => {
    const guild = addGuild();

    const role = AccordMock.role(guild._id);
    service.createRole({
      guildId: guild._id,
      role,
    });
    service.deleteRole({
      guildId: guild._id,
      roleId: role._id,
    });
    
    expect(guild.roles).not.toContain(role);
  });
  
  it('update role, updates existing role', () => {
    const guild = addGuild();
    
    const role = AccordMock.role(guild._id);
    service.createRole({
      guildId: guild._id,
      role,
    });
    service.updateRole({
      guildId: guild._id,
      roleId: role._id,
      partialRole: {
        name: 'Epic Role',
        color: '#FFFFFF',
      }
    });

    expect(role.name).toEqual('Epic Name');
  });
  
  it('add member, adds member to guild', async () => {
    const guild = addGuild();
    const member = await addMember(guild);

    expect(guild.members).toContain(member);
  });
  
  it('remove member, removes member from guild', async () => {
    const guild = addGuild();
    const member = await addMember(guild);
    
    service.removeMember({
      guildId: guild._id,
      memberId: member._id,
    });

    expect(guild.members).not.toContain(member);
  });
  
  it('update member, updates member in guild', async () => {
    const guild = addGuild();
    const member = await addMember(guild);

    const newRoleId = AccordMock.snowflake();
    service.updateMember({
      guildId: guild._id,
      memberId: member._id,
      partialMember: {
        roleIds: [newRoleId],
      }
    });

    expect(member.roleIds).toContain(newRoleId);
  });
  
  it('add channel, adds channel to guild', () => {
    const guild = addGuild();
    
    const channel = AccordMock.channel(guild._id);
    service.addChannel({
      guildId: guild._id,
      channel,
    });

    expect(guild.channels).toContain(channel);
  });
  
  it('delete channel, removes channel to guild', () => {
    const guild = addGuild();
    
    const channel = AccordMock.channel(guild._id);
    service.addChannel({
      guildId: guild._id,
      channel,
    });
    service.deleteChannel({
      guildId: guild._id,
      channelId: channel._id,
    });

    expect(guild.channels).not.toContain(channel);
  });
  
  it('update guild, updates guild in guilds', () => {
    const guild = addGuild();
    
    service.updateGuild({
      guildId: guild._id,
      partialGuild: { name: 'Epic Guild' },
    });

    expect(guild.name).toEqual('Epic Guild');
  });
  
  it('delete guild, delete guild from guilds', () => {
    const guild = addGuild();
    
    service.updateGuild({
      guildId: guild._id,
      partialGuild: { name: 'Epic Guild' },
    });

    expect(guildService.guilds).not.toContain(guild);
  });

  function addGuild() {
    const guild = AccordMock.guild();
    guildService.add(guild);
    return guild;
  }

  async function addMember(guild: Lean.Guild) {
    const everyoneRoleId = guild.roles[0]._id;
    const user = AccordMock.user();
    userService.add(user);

    const member = AccordMock.member(guild._id, everyoneRoleId, { userId: user._id });
    await service.addMember({ guildId: guild._id, member });
    
    return member;
  }
});
