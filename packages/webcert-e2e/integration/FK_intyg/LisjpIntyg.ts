/// <reference types="Cypress" />
import * as intyg from '../../support/FK_intyg/lisjpIntyg'

/**
 * LISJP = Läkarintyg för sjukpenning, FK 7804
 */
describe('FK7804-intyg minimalt ifyllt', { tags: '@react' }, () => {
  before(() => {
    cy.fixture('FK_intyg/maxLisjpData').as('intygsdata')
    cy.fixture('vEnheter/alfaVC').as('vårdenhet')
    cy.fixture('vPatienter/athenaAndersson').as('vårdtagare')
    cy.fixture('vPersonal/ajlaDoktor').as('vårdpersonal')
  })

  context('Användare har möjlighet att uföra följande med FK7804 Intyg ', () => {
    beforeEach(() => {
      // UNSIGNED LISJP FILLED
      cy.skapaIntygViaApi(this, 1, 1, true).then((utkastId) => {
        cy.wrap(utkastId).as('utkastId')
        cy.log(`Lisjp-utkast med id ${utkastId} skapat och används i testfallet`)
      })
    })
    describe('Funktioner på ett Lisjp intyg', { tags: '@react' }, () => {
      it('Makulerar ett signerat LISJP intyg', () => {
        cy.loggaInVårdpersonalIntegrerat(this.vårdpersonal, this.vårdenhet, this.utkastId)
        const önskadUrl = `/certificate/${this.utkastId}`
        cy.visit(önskadUrl)
        intyg.signera()
        intyg.makulera()
        cy.contains(this.utkastId).should('not.exist')
      })
      it('Skicka ett signerat LISJP intyg', () => {
        cy.loggaInVårdpersonalIntegrerat(this.vårdpersonal, this.vårdenhet, this.utkastId)

        const önskadUrl = `/certificate/${this.utkastId}`
        cy.visit(önskadUrl)
        intyg.signera()

        cy.get('button')
          .contains('Skicka till Försäkringskassan')
          .click()
        cy.get('.ic-button-group > :nth-child(1) > .ic-button').click() // detta behöver jag hjälp med

        cy.contains('Intyget är tillgängligt för patienten').should('exist')
      })
      it('Skriva ut ett signerat LISJP intyg', () => {
        cy.loggaInVårdpersonalIntegrerat(this.vårdpersonal, this.vårdenhet, this.utkastId)
        const önskadUrl = `/certificate/${this.utkastId}`
        cy.visit(önskadUrl)
        intyg.signera()
        intyg.skrivUt('utkast', this.utkastId, 'lisjp') // skriver ut via request
      })
      it('Förnya ett LISJP intyg', () => {
        cy.loggaInVårdpersonalIntegrerat(this.vårdpersonal, this.vårdenhet, this.utkastId)
        const önskadUrl = `/certificate/${this.utkastId}`
        cy.visit(önskadUrl)
        intyg.signera()
        intyg.fornya()

        cy.get('button')
          .contains('Skicka till Försäkringskassan')
          .should('not.exist')
        cy.contains(this.utkastId).should('not.exist')
      })
      it('Ersätta ett LISJP intyg', () => {
        cy.loggaInVårdpersonalIntegrerat(this.vårdpersonal, this.vårdenhet, this.utkastId)
        const önskadUrl = `/certificate/${this.utkastId}`
        cy.visit(önskadUrl)
        intyg.signera()
        intyg.ersatta()
        cy.get('button')
          .contains('Skicka till Försäkringskassan')
          .should('not.exist')
        cy.contains(this.utkastId).should('not.exist')
      })
    })
  })
})
