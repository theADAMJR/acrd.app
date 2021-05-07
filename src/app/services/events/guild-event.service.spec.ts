import { TestBed } from '@angular/core/testing';
import { AppModule } from 'src/app/app.module';
import { AccordMock } from 'src/tests/accord-mock';
import { GuildService } from '../guild.service';

import { GuildEventService } from './guild-event.service';

// 16:45 - 17:00
describe('GuildEventService', () => {
  let service: GuildEventService;
  let guildService: GuildService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AppModule],
    }).compileComponents();
    service = TestBed.inject(GuildEventService);
    guildService = TestBed.inject(GuildService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
  
  it('create role, adds role to guild', () => {
    const guild = AccordMock.guild();
    guildService.add(guild);

    service.createRole({
      guildId: guild._id,
      role: AccordMock.role(guild._id),
    });
    
    expect(guild.roles.length).toBe(2);
  });
});
