import { Chance } from 'chance';
const chance = new Chance();

describe('testing', () => {
  const email = chance.email();
  const password = chance.string({ length: 16 });

  beforeEach(() => {
    cy.visit('http://localhost:4200');
  });

  it('', () => {
    
  });
});