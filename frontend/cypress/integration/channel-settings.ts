describe('channel-settings', () => {
  before(() => {
    cy['register']();
    cy['createGuild']();
  });
  after(() => cy['logout']());  

  describe('perms', () => {
    before(() => {
      cy.get('.sidebar-tabs [data-icon="cog"]').first().click();
      cy.contains('Perms').click();
      cy.contains('Add role...').click();
    });
    
    it('deny send messages in channel, opens save dialog', () => {
      cy.get('[class*="option"]').contains('@everyone').click();
      cy.get('#SEND_MESSAGES').click({ force: true });

      cy.contains('unsaved changes').should('be.visible');
    });

    it('save changes, changes are loaded', () => {
      cy.contains('Save').click();
      cy.contains('Overview').click();
      cy.contains('Perms').click();
      cy.contains('Add role...').click();
      cy.get('[class*="option"]').contains('@everyone').click();

      cy.get('#SEND_MESSAGES[value=off]').should('exist');
    });
  });
});