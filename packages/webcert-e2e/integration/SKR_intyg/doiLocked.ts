/// <reference types="Cypress" />
import * as db from '../../support/SKR_intyg/dbIntygHelpers'

describe('Testa låst DOI-utkast', function() {
  before(function() {
    cy.fixture('SKR_intyg/dbData').as('intygsdata')
    cy.fixture('vEnheter/alfaVC').as('vårdenhet')
    cy.fixture('vPatienter/charlieOlsson').as('vårdtagare')
    cy.fixture('vPersonal/ajlaDoktor').as('vårdpersonal')
  })

  beforeEach(function() {
    //UNSIGNED DOI LOCKED
    db.rensaIntyg(this.vårdtagare.personnummer, this.vårdtagare.personnummerKompakt)
    cy.skapaIntygViaApi(this, 2, 4, false).then((utkastId) => {
      cy.wrap(utkastId).as('utkastId')
      cy.log('DOI-utkast med id ' + utkastId + ' skapat och används i testfallet')
    })
  })
  describe('Funktioner på ett låst DOI utkast', () => {
    it('Ett låst DOI går ej att signera', function() {
      cy.loggaInVårdpersonalIntegrerat(this.vårdpersonal, this.vårdenhet, this.utkastId)

      const önskadUrl = '/certificate/' + this.utkastId
      cy.visit(önskadUrl)
      cy.contains('Utkastet är låst').should('be.visible')
    })

    it('Skriva ut ett låst DOI', function() {
      cy.loggaInVårdpersonalIntegrerat(this.vårdpersonal, this.vårdenhet, this.utkastId)
      const önskadUrl = '/certificate/' + this.utkastId
      cy.visit(önskadUrl)
      db.skrivUt('utkast', this.utkastId, 'db') //skriver ut via request
    })

    it('Makulera ett låst DOI', function() {
      cy.loggaInVårdpersonalIntegrerat(this.vårdpersonal, this.vårdenhet, this.utkastId)

      const önskadUrl = '/certificate/' + this.utkastId
      cy.visit(önskadUrl)
      cy.contains('Makulera').click()
      cy.get('.ic-modal')
        .contains('button', 'Makulera')
        .click()
      cy.contains('Utkastet är makulerat').should('exist')
    })
  })
})
