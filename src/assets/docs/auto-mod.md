# Auto Mod
Let 3PG filter explicit content, spam and more!

---

## Auto Delete Messages `true`
Whether to automatically delete messages that are filtered.

## Auto Warn Users `false`
Whether to automatically warn users, that type a filtered message.

## Ban Links
Single characters, or parts of a word, that trigger the `Links` filter.

## Ban Words
Single words that trigger the `Words` filter.

## Filters
Filter message content, based on specific conditions.

| Filter             | Trigger Example                          | Condition
|:-------------------|:-----------------------------------------|:-------------------------------------------|
| Bad Links          | [saved bad link address]                         | Message contains custom bad link
| Bad Words          | [listed bad word]                                      | Any words equal custom bad word

## Ignored Roles
Roles that are not affected by auto-mod.
A use case for this may be an Admin role, where Admins could `SPAM CAPS IN CHAT` and watch other members suffer trying to do the same thing.