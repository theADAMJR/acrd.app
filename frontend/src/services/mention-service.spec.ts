import { MentionService } from './mention-service';
import { test, given } from '@accord/ion';

describe.skip('mention-service', () => {
  let service: MentionService;
  let state: Store.AppState;
  
  const fn = <K extends keyof typeof service>(key: K): (typeof service)[K] => {
    const channel = { id: '246688207138279430', name: 'general', guildId: '246688207148279429' };
    const guild = { id: '246688207148279429' };
    const role = { id: '246688207138279435', name: '@everyone', guildId: '246688207148279429' };
    const user = { id: '246688207138279428', username: 'Adam', discriminator: 1 };
    
    state = {
      auth: { user },
      ui: { activeGuild: guild },
      entities: {
        channels: [channel],
        guilds: [guild],
        roles: [role],
        users: [user],
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

  test(fn('toHTML'), () => {
    given('<@246688207138279428>').assert('', (val) => expect(val).toContainHTML('data-id="246688207138279428"'));
    given('<#246688207138279430>').assert('', (val) => expect(val).toContain('data-id="246688207138279430"'));
  });
});

export {}