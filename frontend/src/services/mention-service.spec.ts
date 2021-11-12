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
        roles: [{ id: '246688207138279435', name: '@everyone', guildId: '246688207148279429' }],
        users: [{ id: '246688207138279428', username: 'Adam', discriminator: 1 }],
      }
    } as any;
    service = new MentionService(state);

    return (service[key] as any).bind(service);
  };

  test(fn('formatOriginal'), () => {
    given('@Adam#0001').expect('<@246688207138279428>');
    given('@nobody#0000').expect('@nobody#0000');
    given('hi @Adam#0001').expect('hi <@246688207138279428>');
    given('@Adam#0001 @Adam#0001').expect('<@246688207138279428> <@246688207138279428>');
    given('@Adam#0001@Adam#0001').expect('<@246688207138279428><@246688207138279428>');
    given('#general').expect('<#246688207138279430>');
    given('#non-existent-channel').expect('#non-existent-channel');
    given('let\'s talk in #general').expect('let\'s talk in <#246688207138279430>');
    given('#general #general').expect('<#246688207138279430> <#246688207138279430>');
    given('#general#general').expect('<#246688207138279430><#246688207138279430>');
  });
});

export {}