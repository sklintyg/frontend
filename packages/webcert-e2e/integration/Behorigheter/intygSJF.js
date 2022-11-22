/// <reference types="Cypress" />
import * as intyg from '../../support/FK_intyg/lisjpIntyg'

/**
 * LISJP = Läkarintyg för sjukpenning, FK 7804
 */

describe('LISJP-intyg tomt', { tags: '@angular' }, function() {
  before(function() {
    cy.fixture('FK_intyg/minLisjpData').as('intygsdata')
    cy.fixture('vEnheter/alfaVC').as('vårdenhetNR1')
    cy.fixture('vPatienter/athenaAndersson').as('vårdtagare')
    cy.fixture('vPersonal/ajlaDoktor').as('vårdpersonalNR1')
    cy.fixture('vPersonal/beataDoktor').as('vårdpersonal')
    cy.fixture('vEnheter/betaVC').as('vårdenhet')
  })

  context('Använadare har möjlighet att uföra följande med ett tomt utkast ', function() {
    beforeEach(function() {
      //UNSIGNED LISJP EMPTY
      cy.skapaIntygViaApi(this, 0, 1, true, false).then((utkastId) => {
        cy.wrap(utkastId).as('utkastId')
        cy.log('LISJP-utkast med id ' + utkastId + ' skapat och används i testfallet')
      })
    })
    describe('Funktioner då man loggar in på ett intyg från annan vårdgivare med sammanhållenjournal', { tags: '@angular' }, () => {
      it('Ett LISJP-intyg ska kunna förnyas', function() {
        cy.loggaInVårdpersonalIntegrerat(this.vårdpersonalNR1, this.vårdenhetNR1, this.utkastId, true)
        const önskadUrl = '/visa/intyg/' + this.utkastId + '?enhet=' + this.vårdenhetNR1.id + '&sjf=true'

        cy.visit(önskadUrl)
        cy.contains(this.vårdpersonal.förnamn).should('exist')
        intyg.fornya()
        cy.get('button')
          .contains('Skicka till Försäkringskassan')
          .should('not.exist')
        cy.contains('Signera intyget').click()
        cy.contains('Obligatoriska uppgifter saknas').should('exist')
        cy.contains(this.vårdpersonalNR1.förnamn).should('exist')
        cy.contains(this.vårdpersonal.förnamn).should('not.exist')
      })
      it('Ett LISJP-intyg ska inte kunna makuleras/skickas/Ersättas och skrivas ut när en användare loggar på annan vårdgivare', function() {
        cy.loggaInVårdpersonalIntegrerat(this.vårdpersonalNR1, this.vårdenhetNR1, this.utkastId, true)
        const önskadUrl = '/visa/intyg/' + this.utkastId + '?enhet=' + this.vårdenhetNR1.id + '&sjf=true'

        cy.visit(önskadUrl)
        cy.contains(this.vårdpersonal.förnamn).should('exist')

        // Kollar så att knapparna inte syns/finns
        cy.contains('Makulera').should('not.exist')
        cy.contains('Skicka').should('not.exist')
        cy.contains('Ersätt').should('not.exist')
        cy.contains('Skriv ut').should('not.exist')

        cy.contains(this.vårdpersonalNR1.förnamn).should('exist')
        cy.contains(this.vårdpersonal.förnamn).should('exist')
        cy.contains(this.vårdenhet.namn).should('exist')
      })
    })
  })
})
