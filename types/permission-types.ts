export namespace PermissionTypes {
  export enum General {
    VIEW_CHANNELS = 1024,
    MANAGE_NICKNAMES = 512,
    CHANGE_NICKNAME = 256,
    CREATE_INVITE = 128,
    KICK_MEMBERS = 64,
    BAN_MEMBERS = 32,
    MANAGE_CHANNELS = 16,
    MANAGE_ROLES = 8,
    MANAGE_GUILD = 4,
    VIEW_AUDIT_LOG = 2,
    ADMINISTRATOR = 1
  }
  export enum Text {
    ADD_REACTIONS = 2048 * 16,
    MENTION_EVERYONE = 2048 * 8,
    READ_MESSAGES = 2048 * 4,
    MANAGE_MESSAGES = 2048 * 2,
    SEND_MESSAGES = 2048
  }
  export enum Voice {
    MOVE_MEMBERS = 32768 * 8,
    MUTE_MEMBERS = 32768 * 4,
    SPEAK = 32768 * 2,
    CONNECT = 32768
  }
  export const All = {
    ...General,
    ...Text,
    ...Voice,
  }
  export type Permission = General | Text | Voice;
  export type PermissionString = keyof typeof All;
  
  export const defaultPermissions =
    PermissionTypes.General.VIEW_CHANNELS
    | PermissionTypes.General.CREATE_INVITE
    | PermissionTypes.Text.SEND_MESSAGES
    | PermissionTypes.Text.READ_MESSAGES
    | PermissionTypes.Text.ADD_REACTIONS
    | PermissionTypes.Voice.CONNECT
    | PermissionTypes.Voice.SPEAK;
}