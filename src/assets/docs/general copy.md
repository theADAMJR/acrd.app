# General

---

### Auto Roles `[]`
Roles automatically given to a member upon joining the server.
For example, if `@Member` and `@Special Snowflake` was an auto role, then the member would automatically be given both roles.

[!] Avoid giving an auto role administrator permissions, otherwise new members could cause a lot of damage.

### Ignored Channels `[]`
The channels where command execution is ignored.
For example, if `#general` was ignored, `/ping` would not work in that `#general`.

### Prefix `.`
The characters preceding a command.
For example, `/ping` -> prefix is `/` as it precedes the command name.

---

## Reaction Roles `[]`
React to messages, to get roles.

### How does it work?
When a user reacts to a message they get a role.
When they remove the reaction, they lose assigned role.

---

### Channel `''`
The channel containing the reaction role message.
This is used for getting the message within the channel.

### Emote `''`
The emote itself used for the reaction message.
For example, if `🤔` was the emote, then `🤔` will give the assigned role.

### Message ID `''`
The ID of the reaction role message.
This is used for identifying the message, and all reaction role operations.

### Role `''`
The role given after reacting to the reaction role message.