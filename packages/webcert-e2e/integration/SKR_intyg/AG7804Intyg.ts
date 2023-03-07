/// <reference types="Cypress" />
import * as intyg from '../../support/SKR_intyg/AG7804Intyg'

/**
 * AG7804 = Läkarintyg om arbetsförmåga – arbetsgivaren, AG 7804
 */

describe('AG7804-intyg minimalt ifyllt', { tags: '@react' }, () => {
  before(() => {
    cy.fixture('FK_intyg/maxLisjpData').as('intygsdata')
    cy.fixture('vEnheter/alfaVC').as('vårdenhet')
    cy.fixture('vPatienter/athenaAndersson').as('vårdtagare')
    cy.fixture('vPersonal/ajlaDoktor').as('vårdpersonal')
  })

  context('Användare har möjlighet att uföra följande med FK7804 Intyg ', () => {
    beforeEach(() => {
      // UNSIGNED AG FILLED
      cy.skapaIntygViaApi(this, 1, 2, true).then((utkastId) => {
        cy.wrap(utkastId).as('utkastId')
        cy.log(`Lisjp-utkast med id ${utkastId} skapat och används i testfallet`)
      })
    })
    describe('Funktioner på ett AG7804-intyg', { tags: '@react' }, () => {
      it('Makulerar ett signerat AG7804-intyg', () => {
        cy.loggaInVårdpersonalIntegrerat(this.vårdpersonal, this.vårdenhet, this.utkastId)
        const önskadUrl = `/certificate/${this.utkastId}`
        cy.visit(önskadUrl)
        intyg.signera()
        intyg.makulera()
        cy.contains(this.utkastId).should('not.exist')
      })

      it('Skicka ett signerat AG7804-intyg', () => {
        cy.loggaInVårdpersonalIntegrerat(this.vårdpersonal, this.vårdenhet, this.utkastId)
        const önskadUrl = `/certificate/${this.utkastId}`
        cy.visit(önskadUrl)
        intyg.signera()
        cy.contains('Intyget är tillgängligt för patienten').should('exist')
      })

      it('Skriva ut ett signerat AG7804-intyg', () => {
        cy.loggaInVårdpersonalIntegrerat(this.vårdpersonal, this.vårdenhet, this.utkastId)
        const önskadUrl = `/certificate/${this.utkastId}`
        cy.visit(önskadUrl)
        intyg.signera()
        intyg.skrivUt('utkast', this.utkastId, 'ag7804') // skriver ut via request
      })

      it('Förnya ett AG7804-intyg', () => {
        cy.loggaInVårdpersonalIntegrerat(this.vårdpersonal, this.vårdenhet, this.utkastId)
        const önskadUrl = `/certificate/${this.utkastId}`
        cy.visit(önskadUrl)
        intyg.signera()
        intyg.fornya()
        cy.get('button')
          .contains('Intyget är tillgängligt för patienten')
          .should('not.exist')
        cy.contains(this.utkastId).should('not.exist')
      })

      it('Ersätta ett AG7804-intyg', () => {
        cy.loggaInVårdpersonalIntegrerat(this.vårdpersonal, this.vårdenhet, this.utkastId)
        const önskadUrl = `/certificate/${this.utkastId}`
        cy.visit(önskadUrl)
        intyg.signera()
        intyg.ersatta()
        cy.contains(this.utkastId).should('not.exist')
      })
    })
  })
})
