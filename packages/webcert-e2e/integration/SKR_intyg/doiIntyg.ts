/// <reference types="Cypress" />
import * as db from '../../support/SKR_intyg/dbIntygHelpers'

describe('Testa DOI-intyg', () => {
  before(() => {
    cy.fixture('SKR_intyg/dbData').as('intygsdata')
    cy.fixture('vEnheter/alfaVC').as('vårdenhet')
    cy.fixture('vPatienter/charlieOlsson').as('vårdtagare')
    cy.fixture('vPersonal/ajlaDoktor').as('vårdpersonal')
  })

  beforeEach(() => {
    // SIGNED DOI MIN
    db.rensaIntyg(this.vårdtagare.personnummer, this.vårdtagare.personnummerKompakt)
    cy.skapaIntygViaApi(this, 0, 4, true, true).then((intygsId) => {
      cy.wrap(intygsId).as('intygsId')
      cy.log(`DOI-intyg med id ${intygsId} skapat och används i testfallet`)
    })
  })
  describe('Funktioner på ett signerat DOI', () => {
    it('Ersätt ett signerat intyg', () => {
      cy.loggaInVårdpersonalIntegrerat(this.vårdpersonal, this.vårdenhet, this.intygsId)

      const önskadUrl = `/certificate/${this.intygsId}`
      cy.visit(önskadUrl)

      cy.contains('Ersätt').click()
      cy.get('.ic-modal')
        .contains('button', 'Ersätt')
        .click()

      // Kontrollera namn och personnummer modal
      cy.contains('Signera och skicka').click()
    })

    it('Skriv ut ett signerat DOI', () => {
      cy.loggaInVårdpersonalIntegrerat(this.vårdpersonal, this.vårdenhet, this.intygsId)
      const önskadUrl = `/certificate/${this.intygsId}`
      cy.visit(önskadUrl)
      db.skrivUt('fullständigt', this.intygsId, 'db') // skriver ut via request
    })

    it('Makulera ett signerat DOI', () => {
      cy.loggaInVårdpersonalIntegrerat(this.vårdpersonal, this.vårdenhet, this.intygsId)

      const önskadUrl = `/certificate/${this.intygsId}`
      cy.visit(önskadUrl)

      cy.contains('Makulera').click()
      cy.get('.ic-modal')
        .contains('button', 'Makulera')
        .click()

      cy.contains('Intyget är makulerat').should('exist')
    })
  })
})
