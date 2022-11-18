/// <reference types="Cypress" />
import * as intyg from '../../support/SKR_intyg/AG7804Intyg'

/**
 * AG7804 = Läkarintyg om arbetsförmåga – arbetsgivaren, AG 7804
 */

describe('AG7804-utkast tomt', { tags: '@react' }, function() {
  before(function() {
    cy.fixture('FK_intyg/minLisjpData').as('intygsdata')
    cy.fixture('vEnheter/alfaVC').as('vårdenhet')
    cy.fixture('vPatienter/athenaAndersson').as('vårdtagare')
    cy.fixture('vPersonal/ajlaDoktor').as('vårdpersonal')
  })

  context('Använadare har möjlighet att uföra följande med ett tomt AG7804-utkast ', function() {
    beforeEach(function() {
      //UNSIGNED AG FILLED
      cy.skapaIntygViaApi(this, 1, 2, true).then((utkastId) => {
        cy.wrap(utkastId).as('utkastId')
        cy.log('AG7804-utkast med id ' + utkastId + ' skapat och används i testfallet')
      })
    })

    describe('Funktioner på ett tomt AG7804-utkast', { tags: '@react' }, () => {
      it('Skapar en minimalt ifylld AG7804 och signerar', function() {
        cy.loggaInVårdpersonalIntegrerat(this.vårdpersonal, this.vårdenhet, this.utkastId)
        const önskadUrl = '/certificate/' + this.utkastId
        cy.visit(önskadUrl)
        intyg.signera()
        cy.contains('Intyget är tillgängligt för patienten')
      })

      it('Det är möjligt att raderar ett ifyllt AG7804', function() {
        cy.loggaInVårdpersonalIntegrerat(this.vårdpersonal, this.vårdenhet, this.utkastId)
        const önskadUrl = '/certificate/' + this.utkastId
        cy.visit(önskadUrl)
        intyg.raderaUtkast()
        cy.contains(this.utkastId).should('not.exist')
      })

      it('Skriva ut ett ifyllt AG7804', function() {
        cy.loggaInVårdpersonalIntegrerat(this.vårdpersonal, this.vårdenhet, this.utkastId)
        const önskadUrl = '/certificate/' + this.utkastId
        cy.visit(önskadUrl)
        intyg.skrivUt('utkast', this.utkastId, 'ag7804') //skriver ut via request
      })

      it('Det går inte att signera ett AG7804 utkast som inte innehåller alla obligatoriska fält', function() {
        cy.loggaInVårdpersonalIntegrerat(this.vårdpersonal, this.vårdenhet, this.utkastId)
        const önskadUrl = '/certificate/' + this.utkastId
        cy.visit(önskadUrl)
        cy.contains('Klart att signera').should('exist')
        cy.get('label')
          .contains('100 procent')
          .click()
        cy.contains('Obligatoriska uppgifter saknas', { timeout: 5000 }).should('exist')
        cy.contains('Klart att signera', { timeout: 5000 }).should('not.exist')
      })
    })
  })
})
