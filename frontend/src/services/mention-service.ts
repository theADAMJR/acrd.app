import { getChannel, getChannelByName } from '../store/channels';
import { getUser, getUserByTag, getUserByUsername } from '../store/users';

export class MentionService {
  private readonly patterns = {
    formatted: {
      channel: /<#(\d{18})>/gm,
      user: /<@(\d{18})>/gm,
    },
    original: {
      channel: /#([A-Za-z\-\d]{2,32})/gm,
      user: /@([A-Za-z\d\-\_ ]{2,32}#\d{4})/gm,
      userShorthand: /@([A-Za-z\d\-\_ ]{2,32})/gm,
    },
  };

  constructor(private state: Store.AppState) { }

  public formatOriginal(content: string) {
    const guildId = this.state.ui.activeGuild!.id;
    return content
      .replaceAll(this.patterns.original.channel, (og, name) => {
        const channel = getChannelByName(guildId, name)(this.state);
        return (channel) ? `<#${channel.id}>` : og;
      })
      .replaceAll(this.patterns.original.user, (og, tag) => {
        const user = getUserByTag(tag)(this.state);
        return (user) ? `<@${user.id}>` : og;
      })
      .replaceAll(this.patterns.original.userShorthand, (og, tag) => {
        const user = getUserByUsername(tag)(this.state);
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
    const channelId = this.state.ui.activeChannel?.id;
    const guildId = this.state.ui.activeGuild?.id;

    var channel = getChannel(id)(this.state);
    var user = getUser(id)(this.state);

    const tag = {
      channel: {
        onClick: `window.location.href = '/channels/${guildId}/${id}';`,
        text: `#${channel?.name}`,
      },
      user: {
        onClick: `events.emit('openUserProfile', '${id}')`,
        text: `@${user?.username}`,
      },
    };

    const mentioned = (id === selfUserId || id === channelId)
      ? 'bg-tertiary rounded px-1'
      : 'bg-bg-tertiary rounded px-1';

    return (user || channel)
      ? `<a data-id="${id}"
        class="font-extrabold cursor-pointer hover:underline ${mentioned}"
        onclick="${tag[type].onClick}">${tag[type].text}</a>`
      : `<a>Not Found</a>`;
  }
}