import Chance from 'chance';
const chance = new Chance();

describe('guild-settings', () => {
  before(() => {
    cy['register']();
    cy['createGuild']();

    cy.get('#sidebarHeader').click();
    cy.contains('Guild settings').click();
  });
  after(() => cy['logout']());  

  describe('overview', () => {
    it('changing name, opens save changes', () => {
      cy.get('input[name=name]').type(chance.tv());
      cy.contains('Careful — you have unsaved changes!').should('be.visible');
    });
  });
});

export {};