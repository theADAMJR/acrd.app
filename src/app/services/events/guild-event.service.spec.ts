import { TestBed } from '@angular/core/testing';
import { AppModule } from 'src/app/app.module';
import { Lean } from 'src/app/types/entity-types';
import { AccordMock } from 'src/tests/accord-mock';
import { ChannelService } from '../api/channel.service';
import { GuildService } from '../api/guild.service';
import { UserService } from '../api/user.service';

import { GuildEventService } from './guild-event.service';

describe('GuildEventService', () => {
  let service: GuildEventService;
  let channelService: ChannelService;
  let userService: UserService;
  let guildService: GuildService;

  beforeEach(() => {
    TestBed
      .configureTestingModule({ imports: [AppModule] })
      .compileComponents();

    service = TestBed.inject(GuildEventService);
    channelService = TestBed.inject(ChannelService);
    guildService = TestBed.inject(GuildService);
    userService = TestBed.inject(UserService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
  
  it('create role, adds role to guild', () => {
    const guild = addGuild();
    
    const role = AccordMock.role(guild.id);
    service.createRole({
      guildId: guild.id,
      role,
    });
    
    expect(guild.roles).toContain(role);
  });
  
  it('delete role, removes role from guild', () => {
    const guild = addGuild();

    const role = AccordMock.role(guild.id);
    service.createRole({
      guildId: guild.id,
      role,
    });
    service.deleteRole({
      guildId: guild.id,
      roleId: role.id,
    });
    
    expect(guild.roles).not.toContain(role);
  });
  
  it('update role, updates existing role', () => {
    const guild = addGuild();
    
    const role = AccordMock.role(guild.id);
    service.createRole({
      guildId: guild.id,
      role,
    });
    service.updateRole({
      guildId: guild.id,
      roleId: role.id,
      partialRole: {
        name: 'Epic Role',
        color: '#FFFFFF',
      }
    });

    expect(role.name).toEqual('Epic Role');
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
      guildId: guild.id,
      memberId: member.id,
    });

    expect(guild.members).not.toContain(member);
  });
  
  it('update member, updates member in guild', async () => {
    const guild = addGuild();
    const member = await addMember(guild);

    const newRoleId = AccordMock.snowflake();
    service.updateMember({
      guildId: guild.id,
      memberId: member.id,
      partialMember: { roleIds: [newRoleId] },
    });

    expect(member.roleIds).toContain(newRoleId);
  });
  
  it('add channel, adds channel to guild', () => {
    const guild = addGuild();
    
    const channel = AccordMock.channel(guild.id);
    service.addChannel({
      guildId: guild.id,
      channel,
    });

    expect(guild.channels).toContain(channel);
  });
  
  it('add channel, adds channel to channel service', () => {
    const guild = addGuild();
    
    const channel = AccordMock.channel(guild.id);
    service.addChannel({
      guildId: guild.id,
      channel,
    });

    expect(channelService.channels).toContain(channel);
  });
  
  it('delete channel, removes channel to guild', () => {
    const guild = addGuild();
    const channel = AccordMock.channel(guild.id);
    
    service.addChannel({
      guildId: guild.id,
      channel,
    });
    service.deleteChannel({
      guildId: guild.id,
      channelId: channel.id,
    });

    expect(guild.channels).not.toContain(channel);
  });
  
  it('update guild, updates guild in guilds', () => {
    const guild = addGuild();
    
    service.updateGuild({
      guildId: guild.id,
      partialGuild: { name: 'Epic Guild' },
    });

    expect(guild.name).toEqual('Epic Guild');
  });
  
  it('delete guild, delete guild from guilds', () => {
    const guild = addGuild();
    
    service.updateGuild({
      guildId: guild.id,
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
    const everyoneRoleId = guild.roles[0].id;
    const user = AccordMock.user();
    userService.add(user);

    const member = AccordMock.member(guild.id, everyoneRoleId, { userId: user.id });
    await service.addMember({ guildId: guild.id, member });
    
    return member;
  }
});
