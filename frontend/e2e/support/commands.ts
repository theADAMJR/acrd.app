import { Chance } from 'chance';
const chance = new Chance();

const url = Cypress.env('baseUrl');;
let token: string;

Cypress.Commands.add('register', (email = chance.email(), password = chance.string()) => {
  cy.visit(url);
  cy.get('a[href*="/login"]').first().click();
  cy.contains('Register').click();
  cy.get('input[name=email]').type(email);
  cy.get('input[name=username]').type(chance.name());
  cy.get('input[name=password]').type(password);
  cy.contains('Register').click();
  cy.wait(2000);

  cy.url()
    .should('equal', `${url}/channels/@me`)
    .then(() => token = localStorage.getItem('token')!);
});

Cypress.Commands.add('createGuild', () => {
  cy.visit(url + '/channels/@me');
  cy.get('#createGuildButton').click();
  cy.get('input[name=name]').type(chance.tv());
  cy.get('button').contains('Create').click();
  cy.wait(1000);
});

Cypress.Commands.add('logout', () => cy.visit(url + '/logout'));


export {}