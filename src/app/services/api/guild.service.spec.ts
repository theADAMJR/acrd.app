import { TestBed } from '@angular/core/testing';
import { GuildService } from './guild.service';
import { AppModule } from '../../app.module';
import { AccordMock } from 'src/tests/accord-mock';
import { Lean } from 'src/app/types/entity-types';

describe('GuildService', () => {
  let guild: Lean.Guild;
  let service: GuildService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AppModule]
    });
    service = TestBed.inject(GuildService);

    guild = AccordMock.guild();
    guild.roles.push(AccordMock.role(guild.id));
    guild.roles.push(AccordMock.role(guild.id));
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('reorder, no change, returns', () => {
    const event = {
      previousIndex: 1,
      currentIndex: 1,
    } as any;
    const result = service.reorder(guild, 'roles', event);
    
    expect(result).toBe(undefined);
  });

  it('reorder, is changed, item is moved', () => {
    const prevItem = guild.roles[1];
    const event = {
      previousIndex: 1,
      currentIndex: 2,
    } as any;
    service.reorder(guild, 'roles', event);

    expect(prevItem).toEqual(guild.roles[2]);
  });
});
