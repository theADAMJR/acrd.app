> Welcome to the main README.

**This repo consists of 3 projects.**

## Branches

- `ap` - Alpha prototype
- `bp` - Beta prototype
- `v1p` - Final prototype
- `v1` - Version number

### Accord Essential

> v1 - v6

- The core features of Discord.

### Accord Full

> v6 - v12

- In development.

---

## API

- The backend of the website.
- Includes the WebSocket and REST API.

## Types

- Ambient types for both project intellisense.

## Website

- The UI.
- Cool but useless without the API running in the background.

---

# Setup

`api/.env`

```
API_PORT=3000
API_PREFIX="/api/v1"
JWT_SECRET_KEY="something secret"
MONGO_URI="mongodb://localhost/Accord-essential"
WEBSITE_PORT=4200
```
