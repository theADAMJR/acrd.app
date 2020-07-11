# Commands

---

## Cooldowns
Some commands have cooldowns which limit spam.
When a command is in cooldown, its execution is ignored.

---

## Configs `[]`
Customize existing commands, to your own preferences.

---

### Name `''`
The name of the command.

### Whitelisted Roles `[]`
The roles that can execute the command.
When a user does not have a whitelisted role, they cannot execute the command.
Leave blank to ignore roles in command execution.

### Whitelisted Channels `[]`
The channels that the command can be executed in.
For example, if `#general` is a whitelisted channel, then that command can only be executed in `#general`
Leave blank for the command to be executable in all channels.

### Enabled `true`
Whether the command can be executed.
When a command is disabled, 3PG will respond with an error message.`