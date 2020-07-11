# Leveling

---

# How XP Works
Members earn XP through typing a message.
Each time they send a message, `xpPerMessage` is added to their current XP.

**Limiting XP**:
- Max messages per minute
- XP per message

`Precise Level = (-75 + sqrt(75^2 - 300(-150 - xp))) / 150`

`XP For Next Level = (75(level + 1)^2 + 75(level + 1) - 150) - xp`

**Earning XP**:
- Auto mod filtered messages do not earn EXP

## Ranking
Members rank's are based on their total XP. 
There's no secondary ranking system (tiebreakers) - when two users have the same XP.

---

### Ignored Roles
Roles that are exempt from earning XP.
For example, if you had the `@NoXP` role and the role was an ignored role, you would not be able to earn XP. 

### Level Roles
Earn a specific role when reaching a level. 
For example, if `Level 5` had a level role `@Bronze`, and you just reached level 5, you would receive that role.

### Max Messages Per Minute `3`
How many messages, during the same minute, will earn XP.
This helps prevent spam, by limiting the amount of messages that can earn XP within a minute.

If a user sends more message than this value, they will simply not earn EXP with that message, for that minute.
If it is 16:41 and <User> sends 4 messages, they will only earn EXP for 3 messages and can start earning again when the time is 16:42.

### XP Per Message `50`
How much XP is added, each time a user earns XP.
