/// <reference types="cypress" />

Cypress.Commands.add('removeCertificate', () => {
  cy.get('[data-testid="remove-certificate-button"]').should('be.visible')
  cy.contains('Radera').click()
  cy.get('.ic-modal').within(() => {
    cy.get('button')
      .contains('Radera')
      .click()
  })
})
