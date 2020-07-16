import { User, Guild, Message } from "discord.js";

export default class EventVariables {
    constructor(private content: string) {}

    user(user: User) {
        this.content = this.content.replace(/\[USER\]/g, `<@!${user.id}>`);
        return this;
    }

    guild(guild: Guild) {
        this.content = this.content.replace(/\[GUILD\]/g, guild.name);
        return this;
    }

    memberCount(guild: Guild) {
        this.content = this.content.replace(/\[MEMBER_COUNT\]/g, guild.memberCount.toString());
        return this;
    }

    message(msg: Message) {
        this.content = this.content.replace(/\[MESSAGE\]/g, msg.content);
        return this;
    }

    reason(punishment: { user: User, reason: string }) {
        this.content = this.content.replace(/\[REASON\]/g, punishment.reason);
        return this;
    }

    toString() { return this.content; }
}