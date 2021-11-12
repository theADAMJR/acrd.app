import { getChannel, getChannelByName } from '../store/channels';
import { getGuildUsers } from '../store/guilds';
import { getUser, getUserByTag } from '../store/users';
import patterns from '../types/patterns';

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
      role: /<&(\d{18})>/gm,
      user: /<@(\d{18})>/gm,
    },
    original: {
      channel: /#([A-Za-z\-\d]{2,32})/gm,
      role: /@((.*){2,32})/gm,
      user: /@([A-Za-z\d\-\_ ]{2,32}#\d{4})/gm,
    },
    tag: /<mention type="(user|everyone|someone|here)" id="(\d{18})" \/>/,
  };

  constructor(private state: Store.AppState) {}

  public formatOriginal(content: string) {    
    return content
      // .replace(this.patterns.original.role, (_, tag) => {        
      //   const user = getUserByTag(tag)(this.state);
      //   return `<@${user.id}>`;
      // })
      .replace(this.patterns.original.user, (_, tag) => {        
        const user = getUserByTag(tag)(this.state);
        return (user) ? `<@${user.id}>` : '';
      })
      .replace(this.patterns.original.channel, (_, name) => {        
        const channel = getChannelByName(this.state.ui.activeGuild!.id, name)(this.state);
        return (channel) ? `<#${channel?.id}>` : '';
      });
  }
  // public stripFormat(content: string) {
  //   return content
  //     .replace(this.patterns.formatted.user, `<mention type="user" id="$1" />`)
  // }
  // public tagsToHTML(content: string) {
  //   return content.replace(this.patterns., (_, type, id) => {
  //     const tag = {
  //       user: {
  //         onClick: `events.emit('openUserProfile', '${id}')`,
  //         text: `@${this.getUserTag(id)}`,
  //       }
  //     };

  //     return `<a
  //       data-id="${id}"
  //       class="font-extrabold cursor-pointer"
  //       onclick="${tag[type].onClick}">${tag[type].text}</a>`;
  //   });
  // }

  private getUserTag(userId: string) {
    const user = getUser(userId)(this.state);
    return this.tag(user);
  }

  private tag(user: Entity.User) {
    const tag = (user.discriminator || 0)
      .toString()
      .padStart(4, '0');
    return `${user.username ?? 'Unknown'}#${tag}`;
  }
}