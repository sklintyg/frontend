/// <reference types="Cypress" />
import * as intyg from '../../support/FK_intyg/lisjpIntyg'

/**
 * LISJP = Läkarintyg för sjukpenning, FK 7804
 */
describe('LISJP-intyg tomt', { tags: '@react' }, () => {
  before(() => {
    cy.fixture('FK_intyg/minLisjpData').as('intygsdata')
    cy.fixture('vEnheter/alfaVC').as('vårdenhet')
    cy.fixture('vPatienter/athenaAndersson').as('vårdtagare')
    cy.fixture('vPersonal/ajlaDoktor').as('vårdpersonal')
  })

  context('Användare har möjlighet att uföra följande med ett tomt utkast ', () => {
    beforeEach(() => {
      // UNSIGNED LISJP EMPTY
      cy.skapaIntygViaApi(this, 1, 1, false).then((utkastId) => {
        cy.wrap(utkastId).as('utkastId')
        cy.log(`LISJP-utkast med id ${utkastId} skapat och används i testfallet`)
      })
    })
    describe('Funktioner på ett tomt LISJP utkast', { tags: '@react' }, () => {
      it('Ett icke ifylld LISJP går ej att signera och skicka till FK', () => {
        cy.loggaInVårdpersonalIntegrerat(this.vårdpersonal, this.vårdenhet, this.utkastId)

        const önskadUrl = `/certificate/${this.utkastId}`
        cy.visit(önskadUrl)
        cy.contains('Obligatoriska uppgifter saknas').should('exist')
        cy.contains('Signera intyget').click()
        intyg.verifieraMeddelande()
        cy.get('button')
          .contains('Skicka till Försäkringskassan')
          .should('not.exist')
      })
      it('Det är möjligt att raderar ett icke ifyllt LISJP', () => {
        cy.loggaInVårdpersonalIntegrerat(this.vårdpersonal, this.vårdenhet, this.utkastId)

        const önskadUrl = `/certificate/${this.utkastId}`
        cy.visit(önskadUrl)
        intyg.raderaUtkast()
        cy.contains(this.utkastId).should('not.exist')
      })
      it('Skriva ut ett icke ifyllt LISJP', () => {
        cy.loggaInVårdpersonalIntegrerat(this.vårdpersonal, this.vårdenhet, this.utkastId)
        const önskadUrl = `/certificate/${this.utkastId}`
        cy.visit(önskadUrl)
        intyg.skrivUt('utkast', this.utkastId, 'lisjp') // skriver ut via request
      })
    })
  })
})
