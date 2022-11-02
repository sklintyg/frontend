/// <reference types="Cypress" />

/**
 * LISJP = Läkarintyg för sjukpenning, FK 7804
 */

describe('LISJP-intyg tomt', function() {
  before(function() {
    cy.fixture('FK_intyg/minLisjpData').as('intygsdata')
    cy.fixture('vEnheter/betaVC').as('vårdenhet')
    cy.fixture('vPatienter/athenaAndersson').as('vårdtagare')
    cy.fixture('vPersonal/beataDoktor').as('vårdpersonal')
  })

  context('Använadare har möjlighet att uföra följande med ett tomt utkast ', function() {
    beforeEach(function() {
      //UNSIGNED LISJP EMPTY
      cy.skapaIntygViaApi(this, 1, 1, false).then((utkastId) => {
        cy.wrap(utkastId).as('utkastId')
        cy.log('LISJP-utkast med id ' + utkastId + ' skapat och används i testfallet')
      })
    })

    describe('Funktioner på ett tomt LISJP utkast (ignore)', () => {
      it('Ett icke ifylld LISJP går ej att signera och skicka till FK', function() {
        const webcertUrl = Cypress.env('webcertUrl')
        Cypress.config('baseUrl', webcertUrl)
        cy.loggaInVårdpersonalIntegrerat(this.vårdpersonal, this.vårdenhet, this.utkastId, true)
        const önskadUrl = '/visa/intyg/' + this.utkastId + '?enhet=' + this.vårdenhet.id

        cy.visit(önskadUrl)
        cy.contains('Obligatoriska uppgifter saknas').should('exist')
        cy.contains('Signera intyget').click()
        cy.get('.ic-page-header').should('not.exist')
      })
    })
  })
})
