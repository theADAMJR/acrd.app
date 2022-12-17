import { defineConfig } from 'cypress'

export default defineConfig({
  env: {
    baseUrl: 'http://localhost:4200',
  },
  fixturesFolder: 'e2e/fixtures',
  screenshotsFolder: 'e2e/screenshots',
  videosFolder: 'e2e/videos',
  downloadsFolder: 'e2e/downloads',
  e2e: {
    // We've imported your old cypress plugins here.
    // You may want to clean this up later by importing these.
    setupNodeEvents(on, config) {
      return require('./e2e/plugins/index.ts').default(on, config)
    },
    specPattern: 'e2e/integration/**/*.cy.{js,jsx,ts,tsx}',
    supportFile: 'e2e/support/index.ts',
  },
})
