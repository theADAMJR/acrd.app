# 2PG Dashboard

## Config
`api-config.json` example:
```
{
    "bot": {
        "id": "yourBotId",
    },
    "url": "https://2pg.xyz"
}

`config.json` example:
```
{
    "bot": {
        "id": "yourBotId",
    },
    "url": "https://2pg.xyz"
}
```

## Discord Bot Setup
Make sure you have redirects set to the /auth link you will be using.
This will be used in the final step of the OAuth2 login.
  
![Redirects](https://i.ibb.co/5TC6Yn3/redirects.png)

---

## Further Notes
- **Channels and roles are publically available through the API**
  - Used to provide more user-friendly select options
  - This is to also to avoid rate limiting
- **Everything within the /src folder is public**
  - Keep the API, Server, and bot isolated to avoid extra bundle size, or your bot tokens being bundled on the client side (not good)
  - Just avoid associating any tokens or secrets with the webapp itself
  - This also applies to the bot
- **If renaming config files, make sure to .gitignore them**
 - This is done by default, but I've made this mistake many times

---

# Angular

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 9.0.3.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).
