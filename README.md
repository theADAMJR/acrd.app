# Accord - Like Discord but cooler.

Custom Frontend and Backend that is similar to Discord.

> Built with React TS, Redux, and Node.js.

<a href="https://ibb.co/kgndDwd"><img src="https://i.ibb.co/N6h4NJ4/Screenshot-from-2021-08-31-16-09-41.png" alt="Screenshot-from-2021-08-31-16-09-41" border="0" /></a>
<a href="https://ibb.co/st2q2B0"><img src="https://i.ibb.co/fQ2H2ch/Screenshot-from-2021-08-30-11-55-01.png" alt="Screenshot-from-2021-08-30-11-55-01" border="0" /></a>
<a href="https://ibb.co/SydPgTY"><img src="https://i.ibb.co/qjWd8Gq/Screenshot-from-2021-08-30-13-30-43.png" alt="Screenshot-from-2021-08-30-13-30-43" border="0" /></a>

---

## Setup

1. Clone the repo.
2. Generate SSH keys.
   From app folder: `mkdir -p backend/keys && ssh-keygen -t rsa -b 2048 -m PEM -f backend/keys/accord.app`
3. Install npm packages.
   From app folder: `cd frontend && npm i && cd ../backend && npm i`

---

## Features

- **Server Channels**
  - Create channels
  - Delete channels
- **Message Management**
  - Server owners can delete any message
  - Message author can delete and edit their own messages
- **Member Management**
  - Kick members as the server owner
  - Easily leave the server by right clicking the server
  - Join servers with an invite code
- **Server Management**
  - Create servers as you would in Discord
  - Edit server name, and icon URL in the server settings
  - Delete your server in the server settings
- **User Management**
  - Manage your account by clicking the settings icon
  - Change your username, and avatar
  - Delete your user and prevent it from being used to login
- **and more** (of course)

> Want a more basic version, that's more like Discord?
> https://github.com/codea-live/dclone
