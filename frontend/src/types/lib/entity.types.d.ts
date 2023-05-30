export declare namespace Entity {
    interface App {
        id: string;
        createdAt: Date;
        description: string;
        name: string;
        ownerId: string;
        userId: string;
        token: string | never;
    }
    interface Channel {
        id: string;
        createdAt: Date;
        guildId: string;
        name: string;
        summary?: string;
        lastMessageId?: null | string;
        type: ChannelTypes.Type;
        overrides?: ChannelTypes.Override[];
        position: number;
    }
    interface Guild {
        id: string;
        name: string;
        createdAt: Date;
        iconURL?: string;
        ownerId: string;
        systemChannelId?: string;
    }
    interface GuildMember {
        /** @deprecated Not the same as user ID. */
        id: string;
        createdAt: Date;
        guildId: string;
        userId: string;
        roleIds: string[];
    }
    interface Invite {
        id: string;
        createdAt: Date;
        options?: InviteTypes.Options;
        inviterId: string;
        guildId: string;
        uses: number;
    }
    interface Message {
        id: string;
        attachmentURLs?: string[];
        authorId: string;
        channelId: string;
        content?: string;
        createdAt: Date;
        embed?: MessageTypes.Embed;
        type?: MessageTypes.Type;
        updatedAt?: Date;
        system?: boolean;
    }
    interface Role {
        id: string;
        color?: string;
        createdAt: Date;
        guildId: string;
        hoisted: boolean;
        mentionable: boolean;
        name: string;
        permissions: number;
        position: number;
    }
    interface Theme {
        id: string;
        code: string;
        createdAt: Date;
        creatorId: string;
        iconURL?: string;
        styles: string;
        name: string;
        updatedAt?: Date;
        isFeatured?: boolean;
    }
    interface User {
        id: string;
        avatarURL: string;
        badges: UserTypes.Badge[];
        bot: boolean;
        createdAt: Date;
        discriminator: number;
        guildIds: string[];
        premium: boolean;
        status: UserTypes.StatusType;
        username: string;
        voice: UserTypes.VoiceState;
    }
}
export declare namespace ChannelTypes {
    type Type = 'TEXT' | 'VOICE' | 'DM';
    interface DM extends Entity.Channel {
        type: 'DM';
        userIds: string[];
    }
    interface Text extends Entity.Channel {
        type: 'TEXT';
    }
    interface Voice extends Entity.Channel {
        type: 'VOICE';
        userIds: string[];
    }
    interface Override {
        roleId: string;
        allow: number;
        deny: number;
    }
    interface VoiceConnection {
        userId: string;
        blob?: any;
    }
}
export declare namespace GeneralTypes {
    interface SnowflakeEntity {
        id: string;
    }
}
export declare namespace InviteTypes {
    interface Options {
        expiresAt?: Date;
        maxUses?: number;
    }
}
export declare namespace MessageTypes {
    interface Attachment {
        id: string;
        name: string;
        size: number;
        url: string;
    }
    interface Embed {
        description: string;
        imageURL: string;
        title: string;
        url: string;
    }
    type Type = undefined | 'GUILD_MEMBER_JOIN' | 'GUILD_MEMBER_LEAVE';
}
export declare namespace UserTypes {
    type Badge = 'BUG_1' | 'BUG_2' | 'BUG_3' | 'PREMIUM' | 'OG' | 'VIEWER' | 'STAFF';
    interface Ignored {
        channelIds: string[];
        guildIds: string[];
        userIds: string[];
    }
    type StatusType = 'ONLINE' | 'OFFLINE';
    interface Self extends Entity.User {
        activeThemeId: string;
        email: string;
        ignored?: {
            channelIds: string[];
            guildIds: string[];
            userIds: string[];
        };
        lastReadMessageIds: {
            [k: string]: string;
        };
        locked: boolean;
        premiumExpiration: Date;
        unlockedThemeIds: string[];
        verified: true;
    }
    interface VoiceState {
        channelId?: string;
    }
}
