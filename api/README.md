### There are 2 main components in this API.

REST refers to the REST API (uses HTTP).
WS refers to the WebSocket API (uses WS).

### Dependency Injection

Due to the nature of the DI used in this project, dependencies cannot be circular:

> rest/server.ts

```ts
import { WS } from '...';
...
Deps.get<WS>(WS);
```

> ws/websocket.ts

```ts
import { REST } from '...';
...
Deps.get<REST>(REST);
```

`Deps.add` -> create dep with custom object.
`Deps.get` -> get dep, or create with no args constructor.

---

# WS

SNAKE_CASE is used as lowercase to avoid possible conflict with socket.io event names.

`utils/temp.ts` is used as a temporary database, before MongoDB.

## Events

| NAME           | DESCRIPTION                        |
| :------------- | :--------------------------------- |
| READY          | When a user connects with browser. |
| MESSAGE_CREATE | When user sends message.           |
| MESSAGE_DELETE | When user deletes message.         |

---

## PORTS

`3000` -> REST API and WS
`4200` -> React website

---

## Different Folders, One Big Repo

-> Branch versions will be used (e.g. v1,v2,...,v12)
