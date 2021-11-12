import { getChannel, getChannelByName } from '../store/channels';
import { getRole, getRoleByName } from '../store/roles';
import { getUser, getUserByTag } from '../store/users';

export class MentionService {
  public readonly tags = ['mention'];

  /**
   * @adam123#0001          :   <@1298172981211212>
   * #general               :   <#1212129018921892>    
   * @everyone              :   <@12121821821121212>    
   */
  private readonly patterns = {
    formatted: {
      channel: /<#(\d{18})>/gm,
      user: /<@(\d{18})>/gm,
    },
    original: {
      channel: /#([A-Za-z\-\d]{2,32})/gm,
      user: /@([A-Za-z\d\-\_ ]{2,32}#\d{4})/gm,
    },
    tag: /<mention type="(channel|role|user)" id="(\d{18})" \/>/,
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
      })
  }
  public stripFormat(content: string) {
    return content
      .replace(this.patterns.formatted.channel, `<mention type="channel" id="$1" />`)
      .replace(this.patterns.formatted.user, `<mention type="user" id="$1" />`);
  }

  public tagsToHTML(content: string) {
    return content.replace(this.patterns.tag, (_, type, id) => {
      const guildId = this.state.ui.activeGuild!.id;
      const tag = {
        channel: {
          onClick: `window.location.href = '/channels/${guildId}/${id}'`,
          text: `#${getChannel(id)(this.state)?.name}`,
        },
        user: {
          onClick: `events.emit('openUserProfile', '${id}')`,
          text: `@${this.tag(getUser(id)(this.state))}`,
        },
      };

      return `<a
        data-id="${id}"
        class="font-extrabold cursor-pointer hover:underline"
        onclick="${tag[type].onClick}">${tag[type].text}</a>`;
    });
  }

  private tag(user: Entity.User) {
    const tag = (user.discriminator || 0)
      .toString()
      .padStart(4, '0');
    return `${user.username ?? 'Unknown'}#${tag}`;
  }
}