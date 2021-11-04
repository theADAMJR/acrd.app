import { Chance } from 'chance';
const chance = new Chance();

describe('testing', () => {
  beforeEach(() => {
    cy.viewport(1920, 1080);
  });

  const email = chance.email();
  const username = chance.name();
  const password = chance.string({ length: 16 });

  it('register user, redirects to app', () => {
    cy.visit('http://localhost:4200');

    cy.get('a[href*="/login"]')
      .first()
      .should('be.visible')
      .click();
    cy.contains('Register')
      .should('be.visible')
      .click();

    cy.get('input[name=email]')
      .should('be.visible')
      .type(email);
    cy.get('input[name=username]')
      .should('be.visible')
      .type(username);
    cy.get('input[name=password]')
      .should('be.visible')
      .type(password);
    cy.get('button').click();

    cy.wait(2000).as('register');

    cy.location()
      .its('href')
      .should('equal', 'http://localhost:4200/channels/@me');
  });

  it('logout user, redirects to home page', () => {
    cy.get('#userSettingsButton').click();
    cy.contains('Logout')
      .should('be.visible')
      .click();
  });
});