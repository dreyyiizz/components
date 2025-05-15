
/// <reference types="cypress" />

const { defineConfig } = require('cypress');

module.exports = defineConfig({
  e2e: {
    baseUrl: 'http://localhost:5173',
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
    experimentalFetchPolyfill: true, // 👈 required to intercept fetch

  },
});
