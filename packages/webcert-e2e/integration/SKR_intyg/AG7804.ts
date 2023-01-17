/// <reference types="Cypress" />
import * as intyg from '../../support/SKR_intyg/AG7804Intyg'

/**
 * AG7804 = Läkarintyg om arbetsförmåga – arbetsgivaren, AG 7804
 */

describe('AG7804-intyg tomt', { tags: '@react' }, function() {
  before(function() {
    cy.fixture('FK_intyg/minLisjpData').as('intygsdata')
    cy.fixture('vEnheter/alfaVC').as('vårdenhet')
    cy.fixture('vPatienter/athenaAndersson').as('vårdtagare')
    cy.fixture('vPersonal/ajlaDoktor').as('vårdpersonal')
  })

  context('Användare har möjlighet att uföra följande med ett tomt utkast ', function() {
    beforeEach(function() {
      //UNSIGNED AG EMPTY
      cy.skapaIntygViaApi(this, 1, 2, false).then((utkastId) => {
        cy.wrap(utkastId).as('utkastId')
        cy.log('LISJP-utkast med id ' + utkastId + ' skapat och används i testfallet')
      })
    })

    describe('Funktioner på ett tomt AG7804 utkast', { tags: '@react' }, () => {
      it('Ett icke ifylld AG7804 går ej att signera och skicka till FK', function() {
        cy.loggaInVårdpersonalIntegrerat(this.vårdpersonal, this.vårdenhet, this.utkastId)

        const önskadUrl = '/certificate/' + this.utkastId
        cy.visit(önskadUrl)
        cy.contains('Obligatoriska uppgifter saknas').should('exist')
        cy.contains('Signera intyget').click()
        intyg.verifieraMeddelande()
        cy.get('button')
          .contains('Skicka till Försäkringskassan')
          .should('not.exist')
      })

      it('Det är möjligt att raderar ett icke ifyllt AG7804', function() {
        cy.loggaInVårdpersonalIntegrerat(this.vårdpersonal, this.vårdenhet, this.utkastId)

        const önskadUrl = '/certificate/' + this.utkastId
        cy.visit(önskadUrl)
        intyg.raderaUtkast()
        cy.contains(this.utkastId).should('not.exist')
      })

      it('Skriva ut ett icke ifyllt AG7804', function() {
        cy.loggaInVårdpersonalIntegrerat(this.vårdpersonal, this.vårdenhet, this.utkastId)
        const önskadUrl = '/certificate/' + this.utkastId
        cy.visit(önskadUrl)
        intyg.skrivUt('utkast', this.utkastId, 'ag7804') //skriver ut via request
      })
    })
  })
})
