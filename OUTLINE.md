# TODO

[3] public servers (don't require login to view)
> no server list
> view as guest (disabled by default)
> acrd.app/guilds/:name
> https://acrd.app/channels/:uniqueGuildName/:uniqueChannelName
[3] theme page
> https://acrd.app/theme/:themeId
[4] show more things no channels exist
> show member list bar
> inform user that there are no channels

# FIXME

[1] send files: members can send files without permission
[1] guild invite settings: page does not load, after fetching invites
> TypeError: Cannot read properties of undefined (reading 'id')
> invite may be created by a user that left the guild
[2] themes do not work on live build

# VERIFY

[3] member status: members sometimes remain online, after going offline
> disconnected event may not be called