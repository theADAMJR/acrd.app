export declare namespace PermissionTypes {
    enum General {
        VIEW_CHANNELS = 1024,
        MANAGE_INVITES = 256,
        CREATE_INVITE = 128,
        KICK_MEMBERS = 64,
        MANAGE_CHANNELS = 16,
        MANAGE_ROLES = 8,
        MANAGE_GUILD = 4,
        ADMINISTRATOR = 1
    }
    enum Text {
        READ_MESSAGES = 8192,
        MANAGE_MESSAGES = 4096,
        SEND_MESSAGES = 2048
    }
    enum Voice {
        MOVE_MEMBERS = 262144,
        MUTE_MEMBERS = 131072,
        SPEAK = 65536,
        CONNECT = 32768
    }
    const All: {
        [x: number]: string;
        MOVE_MEMBERS: Voice;
        MUTE_MEMBERS: Voice;
        SPEAK: Voice;
        CONNECT: Voice;
        READ_MESSAGES: Text;
        MANAGE_MESSAGES: Text;
        SEND_MESSAGES: Text;
        VIEW_CHANNELS: General.VIEW_CHANNELS;
        MANAGE_INVITES: General.MANAGE_INVITES;
        CREATE_INVITE: General.CREATE_INVITE;
        KICK_MEMBERS: General.KICK_MEMBERS;
        MANAGE_CHANNELS: General.MANAGE_CHANNELS;
        MANAGE_ROLES: General.MANAGE_ROLES;
        MANAGE_GUILD: General.MANAGE_GUILD;
        ADMINISTRATOR: General.ADMINISTRATOR;
    };
    type Permission = General | Text | Voice;
    type PermissionString = keyof typeof All;
    const defaultPermissions: number;
}
export declare function getPermString(integer: number | string): string;
