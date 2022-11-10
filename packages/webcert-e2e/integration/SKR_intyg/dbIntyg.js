/// <reference types="Cypress" />
import * as db from '../../support/SKR_intyg/dbIntygHelpers'

describe('Testa DB-intyg', function() {
  before(function() {
    cy.fixture('SKR_intyg/dbData').as('intygsdata')
    cy.fixture('vEnheter/alfaVC').as('vårdenhet')
    cy.fixture('vPatienter/charlieOlsson').as('vårdtagare')
    cy.fixture('vPersonal/ajlaDoktor').as('vårdpersonal')
  })

  beforeEach(function() {
    //SIGNED DB MIN
    cy.skapaIntygViaApi(this, 0, 3, true, true).then((intygsId) => {
      cy.wrap(intygsId).as('intygsId')
      cy.log('DB-intyg med id ' + intygsId + ' skapat och används i testfallet')
    })
  })
  describe('Funktioner på ett signerat DB', () => {
    it('Ersätt ett signerat intyg', function() {
      cy.loggaInVårdpersonalIntegrerat(this.vårdpersonal, this.vårdenhet, this.intygsId)

      const önskadUrl = '/certificate/' + this.intygsId
      cy.visit(önskadUrl)

      cy.contains('Ersätt').click()
      cy.get('.ic-modal')
        .contains('button', 'Ersätt')
        .click()

      //Kontrollera namn och personnummer modal
      cy.get('[type="checkbox"]').check({ force: true })
      cy.contains('Gå vidare').click()
      cy.contains('Signera och skicka').click()
    })

    it('Skriv ut ett signerat DB', function() {
      cy.loggaInVårdpersonalIntegrerat(this.vårdpersonal, this.vårdenhet, this.intygsId)
      const önskadUrl = '/certificate/' + this.intygsId
      cy.visit(önskadUrl)
      db.skrivUt('fullständigt', this.intygsId, 'db') //skriver ut via request
    })

    it('Makulera ett signerat DB', function() {
      cy.loggaInVårdpersonalIntegrerat(this.vårdpersonal, this.vårdenhet, this.intygsId)

      const önskadUrl = '/certificate/' + this.intygsId
      cy.visit(önskadUrl)

      cy.contains('Makulera').click()
      cy.get('.ic-modal')
        .contains('button', 'Makulera')
        .click()

      cy.contains('Intyget är makulerat').should('exist')
    })
  })
})
