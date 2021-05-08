import { TestBed } from '@angular/core/testing';
import { AppModule } from 'src/app/app.module';
import { ChannelTypes } from 'src/app/types/entity-types';
import { AccordMock } from 'src/tests/accord-mock';
import { ChannelService } from '../channel.service';
import { GuildService } from '../guild.service';
import { UserService } from '../user.service';
import { MyEventService } from './my-event.service';

describe('MyEventService', () => {
  let service: MyEventService;
  let channelService: ChannelService;
  let guildService: GuildService;
  let userService: UserService;

  beforeEach(() => {
    TestBed
      .configureTestingModule({ imports: [AppModule] })
      .compileComponents();

    service = TestBed.inject(MyEventService);
    channelService = TestBed.inject(ChannelService);
    guildService = TestBed.inject(GuildService);
    userService = TestBed.inject(UserService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('add friends, dm channel added', () => {
    const dmChannel = AccordMock.channel(
      AccordMock.snowflake(),
      { type: 'DM' },
    ) as ChannelTypes.DM;
    
    service.addFriend({
      friend: AccordMock.user(),
      sender: AccordMock.user(),
      dmChannel,
    });

    expect(channelService.channels).toContain(dmChannel);    
  });

  it('update friends, sender and friend updated', () => {
    const friend = AccordMock.user();
    const sender = AccordMock.user();

    service.updateFriends({
      sender: {
        ...sender,
        friendRequestIds: [friend._id],
      },
      friend,
    });

    const updatedSender = userService.getCached(sender._id); 
    expect(updatedSender.friendRequestIds).toContain(friend._id);
  });

  it('join guild, guild added', async () => {
    const guild = AccordMock.guild();

    await service.joinGuild({ guild });

    expect(guildService.guilds).toContain(guild);
  });

  it('update presence, user updated', async () => {
    const user = AccordMock.user();
    userService.add(user);

    service.updatePresence({ userId: user._id, status: 'OFFLINE' });

    expect(user.status).toEqual('OFFLINE');
  });

  it('update presence, user updated', async () => {
    const user = AccordMock.user();
    userService.add(user);

    service.updatePresence({ userId: user._id, status: 'OFFLINE' });

    expect(user.status).toEqual('OFFLINE');
  });

  it('update user, self user updated', async () => {
    userService.self = AccordMock.self();

    service.updateUser({ partialUser: { username: 'epic-user' } });

    expect(userService.self.username).toEqual('epic-user');
  });
});
