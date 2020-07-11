# Announce
Receive messages when something happens.

[i] Ensure <BotUser> has access to the channel to be able to send messages.

---

## Events
Custom responses to specific events.

---

## Types
These types combine both Discord events and 3PG events.

Event               | Description
:-------------------|:----------------------------
Ban                 | User is banned on Discord
Config Update        | Bot config is changed
Level Up             | User reaches a new XP level
Member Join          | User joins the guild
Member Leave         | User leaves the guild
Message Deleted      | User message is deleted
Unban               | User is unbanned on Discord
Warn                | User is warned with the `warn` command
Mute                | User is muted with the `mute` command

---

## Event Variables
Event variables are used in the message and provide more context to a message.

Variable        | Description                           | Example       | Events
:---------------|:--------------------------------------|:--------------|:-----------------------------|
`[GUILD]`         | Guild name                          | Test Guild       | All        
`[INSTIGATOR]`    | User mention of the punisher        | <BotUser>       | WARN        
`[MEMBER_COUNT]`  | Number of members in guild          | 420       | All
`[MESSAGE]`       | Content of a message                | Hello Earth         | MESSAGE_DELETED
`[MODULE]`       | The name of the module that was updated                | General         | CONFIG_UPDATE
`[NEW_LEVEL]`     | The new level of a member           | 2      | LEVEL_UP
`[NEW_VALUE]`     | The new value of the config         | { "prefix": "." }       | CONFIG_UPDATE
`[OLD_LEVEL]`     | The old level of a member           | 1       | LEVEL_UP
`[OLD_VALUE]`     | The old value of the config         | { "prefix": "/" }   | CONFIG_UPDATE
`[REASON]`        | Logged reason for punishment        | Spamming '🤔' continuously       | WARN
`[USER]`          | User mention                        | <User>       | All
`[XP]`            | The current xp of a member          | 69425       | LEVEL_UP
