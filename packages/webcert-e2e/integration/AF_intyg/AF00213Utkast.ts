/// <reference types="Cypress" />
import * as intyg from '../../support/AF_intyg/af00213Intyg'

/**
 * AF00213 = Arbetsförmedlingens medicinska utlåtande, AF 00213
 */

describe('AF00213-intyg', { tags: '@react' }, () => {
  before(() => {
    cy.fixture('AF_intyg/maxAF00213Data').as('intygsdata')
    cy.fixture('vEnheter/alfaVC').as('vårdenhet')
    cy.fixture('vPatienter/tolvanTolvansson').as('vårdtagare')
    cy.fixture('vPersonal/ajlaDoktor').as('vårdpersonal')
  })

  context('Användare har möjlighet att uföra följande med utkast ', () => {
    beforeEach(() => {
      // UNSIGNED AF00213 FILLED
      cy.skapaIntygViaApi(this, 1, 0, true).then((utkastId) => {
        cy.wrap(utkastId).as('utkastId')
        cy.log(`AF00213-utkast med id ${utkastId} skapat och används i testfallet`)
      })
    })

    describe('Funktioner på ett AF20013 utkast', { tags: '@react' }, () => {
      it('Skapar en minimalt ifylld AF00213 och skickar den till AF', () => {
        cy.loggaInVårdpersonalIntegrerat(this.vårdpersonal, this.vårdenhet, this.utkastId)

        const önskadUrl = `/certificate/${this.utkastId}`
        cy.visit(önskadUrl)
        intyg.signeraSkicka()

        cy.contains('Intyget är skickat till Arbetsförmedlingen')
        cy.contains('Intyget är tillgängligt för patienten')
      })

      it('Raderar ett ifylld AF00213', () => {
        cy.loggaInVårdpersonalIntegrerat(this.vårdpersonal, this.vårdenhet, this.utkastId)
        const önskadUrl = `/certificate/${this.utkastId}`
        cy.visit(önskadUrl)
        intyg.raderaUtkast()
        cy.contains(this.utkastId).should('not.exist')
      })

      it('Skriva ut ett AF00213 utkast', () => {
        cy.loggaInVårdpersonalIntegrerat(this.vårdpersonal, this.vårdenhet, this.utkastId)
        const önskadUrl = `/certificate/${this.utkastId}`
        cy.visit(önskadUrl)
        intyg.skrivUt('utkast', this.utkastId, 'af00213')
      })
    })
  })
})
