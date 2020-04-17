# Bot

## Deps
- dependencies used throughout the project
- dependencies are built at the start
+ provides loose coupling
+ easier to unit test

---

## Saving Data
- mongoose is used for linking the database to save documents

### Models

#### Command
- saves command metadata for displaying on the webapp
- each command is upserted in the `CommandHandler` on each bot start
- publically accessible via the API

#### Guild
- saves guild config data to allow users to customize their guilds via the dashboard
- represents a discord.js `Guild`
- publically accessible via the API

#### Log
- saves audit log data when a manager edits their guild configs via the dashboard
- publically accessible via the API

#### Member
- local guild member data which is used for storing XP data and warnings
- represets a discord.js `GuildMember`
- publically accessible via the API

#### User
- global user data which is used for storing XP card customization and votes
- represents a discord.js `User`
- publically accessible via the API

### Data

`DBWrapper<InputType, OutputDocument>`
- base class for getting and setting mongoose documents

#### Guilds
- gets or creates a `GuildDocument`

#### Logs
- gets or creates a `LogsDocument`

#### Members
- gets or creates a `MemberDocument`

#### Users
- gets or creates a `UserDocument`

---

## Commands
- commands can be automatically added by just copy and pasting a class
```
export default class TestCommand implements Command {
	// ...implementation
}
```

**Name**: the text that identifies the command; what is typed after the command prefix (e.g. /name)
**Cooldown**: delay added after execution that stops commands from being executed
