import { MentionService } from './mention-service';
import { test, given } from 'sazerac';

describe('mention-service', () => {
  let service: MentionService;
  let state: Store.AppState;
  
  const fn = <K extends keyof typeof service>(key: K): (typeof service)[K] => {
    state = {
      ui: {
        activeGuild: { id: '246688207148279429' },
      },
      entities: {
        channels: [{ id: '246688207138279430', name: 'general', guildId: '246688207148279429' }],
        users: [{ id: '246688207138279428', username: 'Adam', discriminator: 1 }],
      }
    } as any;
    service = new MentionService(state);

    return (service[key] as any).bind(service);
  };

  test(fn('formatOriginal'), () => {
    given('hi @Adam#0001').expect('hi <@246688207138279428>');
    given('let\'s talk in #general').expect('let\'s talk in <#246688207138279430>');
  });
  
  
});

export {}