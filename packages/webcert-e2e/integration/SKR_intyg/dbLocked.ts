/// <reference types="Cypress" />
import * as db from '../../support/SKR_intyg/dbIntygHelpers'

describe('Testa låst DB-utkast', function() {
  before(function() {
    cy.fixture('SKR_intyg/dbData').as('intygsdata')
    cy.fixture('vEnheter/alfaVC').as('vårdenhet')
    cy.fixture('vPatienter/charlieOlsson').as('vårdtagare')
    cy.fixture('vPersonal/ajlaDoktor').as('vårdpersonal')
  })

  beforeEach(function() {
    //UNSIGNED DB LOCKED
    db.rensaIntyg(this.vårdtagare.personnummer, this.vårdtagare.personnummerKompakt)
    cy.skapaIntygViaApi(this, 2, 3, false).then((utkastId) => {
      cy.wrap(utkastId).as('utkastId')
      cy.log('DB-utkast med id ' + utkastId + ' skapat och används i testfallet')
    })
  })
  describe('Funktioner på ett låst DB utkast', () => {
    it('Ett låst DB går ej att signera', function() {
      cy.loggaInVårdpersonalIntegrerat(this.vårdpersonal, this.vårdenhet, this.utkastId)

      const önskadUrl = '/certificate/' + this.utkastId
      cy.visit(önskadUrl)
      cy.contains('Utkastet är låst').should('be.visible')
    })

    it('Skriva ut ett låst DB', function() {
      cy.loggaInVårdpersonalIntegrerat(this.vårdpersonal, this.vårdenhet, this.utkastId)
      const önskadUrl = '/certificate/' + this.utkastId
      cy.visit(önskadUrl)
      db.skrivUt('utkast', this.utkastId, 'db') //skriver ut via request
    })

    it('Makulera ett låst DB', function() {
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
