# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]
Bug fixes and stability updates to make accord a more smooth experience.

### Added
- Recaptcha to prevent API abuse to registration and login form.

### Fixed
- Invite page now loads invite when not in guild.

## [Winter 0.5.0-alpha] - 2023/01/17

### Added
- Mentions: Mention channels, and users which selectively highlights associated users/channels.

![](https://i.ibb.co/ZM4SNLw/image.png)

### Fixed
- Message formatting does not work.
- Message dates no longer show 2 days ago as 'Yesterday'.

## [Winter 0.4.2-alpha] - 2023/01/03

### Added
- Theme Page: Easily share themes by their codes.

### Changed
- Sidebar: Improved guild icon tooltips.
- Themes: Replaced theme code with URL.

### Removed
- Voice channels (until further notice).

## [Winter 0.4.1-alpha] - 2023/01/01

### Added
- Create Invite: Copy full invite URL.

![](https://i.ibb.co/VSLgSwd/image.png)

### Changed
- Moved advanced user settings to 'Advanced' tab.
- Moved advanced guild settings to 'Advanced' tab.

### Fixed
- Emails, and passwords salts/hashes are now forgotten when deleting user is deleted.
- User now redirects correctly when needed to login.
- Themes now apply correctly on built app.

## [Winter 0.4.0-alpha] - 2022/12/17

### Added

- Customizable Themes: Create, share, and customize UI themes.

![](https://i.ibb.co/K0Bv04y/image.png)

- Send Files Permission: Control who can send files/images in a text channel.

![](https://i.ibb.co/BL4kYcK/image.png)

- Invite Page: Join a server through `acrd.app/join/<code>`.

![](https://i.ibb.co/TKPvY68/image.png)

- Advanced Invite Management: View who created roles, and how many uses they have had.

![](https://i.ibb.co/rxd6Q4K/image.png)

- Profanity Filter: Text channel option to filter explicit words (disabled by default).

![](https://i.ibb.co/9WTgp4v/image.png)

- Family Friendly Usernames: No profanity in usernames please.

![](https://i.ibb.co/KyWBgTn/image.png)

### Changed 
- New font: Switched from copying Discord's font to using Inter.
- Added cool snow particles.