import { Entity } from '@accord/types';
import { getChannel, getChannelByName } from '../store/channels';
import { getTag, getUser, getUserByTag } from '../store/users';

export class MentionService {
  public readonly tags = ['@245538070684827648', '#\d{18}'];

  private readonly patterns = {
    formatted: {
      channel: /<#(\d{18})>/gm,
      user: /<@(\d{18})>/gm,
    },
    original: {
      channel: /#([A-Za-z\-\d]{2,32})/gm,
      user: /@([A-Za-z\d\-\_ ]{2,32}#\d{4})/gm,
    },
  };

  constructor(private state: Store.AppState) {}

  // messageBox.onInput -> formatted mentions appear fancy in message box 
  public formatOriginal(content: string) {    
    const guildId = this.state.ui.activeGuild!.id;
    return content
      .replace(this.patterns.original.channel, (og, name) => {        
        const channel = getChannelByName(guildId, name)(this.state);
        return (channel) ? `<#${channel?.id}>` : og;
      })
      .replace(this.patterns.original.user, (og, tag) => {        
        const user = getUserByTag(tag)(this.state);
        return (user) ? `<@${user.id}>` : og;
      });
  }

  public toHTML(content: string) {
    return content
      .replace(this.patterns.formatted.channel, (_, id) => this.mentionAnchorTag('channel', id))
      .replace(this.patterns.formatted.user, (_, id) => this.mentionAnchorTag('user', id));
  }

  private mentionAnchorTag(type: 'channel' | 'user', id: string) {
    const selfUserId = this.state.auth.user!.id;
    const guildId = this.state.ui.activeGuild!.id;
    const tag = {
      channel: {
        onClick: `window.location.href = '/channels/${guildId}/${id}'`,
        text: `#${getChannel(id)(this.state)?.name}`,
      },
      user: {
        onClick: `events.emit('openUserProfile', '${id}')`,
        text: `@${getTag(getUser(id)(this.state))}`,
      },
    };

    const mentioned = (id === selfUserId) ? 'bg-tertiary rounded px-1' : '';
    return `<a
      data-id="${id}"
      class="font-extrabold cursor-pointer hover:underline ${mentioned}"
      onclick="${tag[type].onClick}">${tag[type].text}</a>`;
  }
}