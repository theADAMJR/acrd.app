/// <reference types="cypress" />

import { resolve } from 'path';

// ***********************************************************
// This example plugins/index.js can be used to load plugins
//
// You can change the location of this file or turn off loading
// the plugins file with the 'pluginsFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/plugins-guide
// ***********************************************************

// This function is called when a project is opened or re-opened (e.g. due to
// the project's config changing)

/**
 * @type {Cypress.PluginConfig}
 */
export default (on, config) => {
  on('before:browser:launch', (browser, args) => {
    if (browser?.family === 'chromium') {
      // Ubuntu 20.04 (Linux)
      // args.push('--load-extension=~/.config/google-chrome/Default/Extensions/lmhkpmbekcpmknklioeibfkpmmfibljd/2.17.2_0');

      // Windows 11
      const user = 'adamj';
      const extensionFolder = `C:\\Users\\${user}\\AppData\\Local\\Google\\Chrome\\User Data\\Default\\Extensions\\lmhkpmbekcpmknklioeibfkpmmfibljd\\2.17.2_0`;      
      args.push(`--load-extension=${extensionFolder}`);

      return args;
    }
    return null;
  });
}
