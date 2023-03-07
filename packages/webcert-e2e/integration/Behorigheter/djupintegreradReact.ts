/// <reference types="Cypress" />

/**
 * LISJP = Läkarintyg för sjukpenning, FK 7804
 */

describe('LISJP-intyg tomt', { tags: '@angular' }, () => {
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
    describe('Funktioner på ett tomt LISJP utkast', { tags: '@angular' }, () => {
      it('Ett icke ifylld LISJP går ej att signera och skicka till FK', () => {
        cy.loggaInVårdpersonalIntegrerat(this.vårdpersonal, this.vårdenhet, this.utkastId, true)
        const önskadUrl = `/visa/intyg/${this.utkastId}?enhet=${this.vårdenhet.id}`
        cy.visit(önskadUrl)
        cy.contains('Obligatoriska uppgifter saknas').should('exist')
        cy.contains('Signera intyget').click()
        cy.get('.ic-page-header').should('exist')
      })
    })
  })
})
