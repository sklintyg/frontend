/// <reference types="Cypress" />
import * as intyg from '../../support/SKR_intyg/AG7804Intyg'

/**
 * AG7804 = Läkarintyg om arbetsförmåga – arbetsgivaren, AG 7804
 */

describe('AG7804-intyg låst utkast', { tags: '@react' }, function() {
  before(function() {
    cy.fixture('AF_intyg/maxAF00213Data').as('intygsdata')
    cy.fixture('vEnheter/alfaVC').as('vårdenhet')
    cy.fixture('vPatienter/tolvanTolvansson').as('vårdtagare')
    cy.fixture('vPersonal/ajlaDoktor').as('vårdpersonal')
  })

  context('Användare har möjlighet att uföra följande med låst LISJP Utkast ', function() {
    beforeEach(function() {
      cy.skapaIntygViaApi(this, 2, 2, true).then((utkastId) => {
        cy.wrap(utkastId).as('utkastId')
        cy.log('LISJP-låst utkast med id ' + utkastId + ' skapat och används i testfallet')
      })
    })

    describe('Funktioner på ett låst AG7804 utkast', { tags: '@react' }, () => {
      it('Skriva ut ett låst AG7804 utkast', function() {
        cy.loggaInVårdpersonalIntegrerat(this.vårdpersonal, this.vårdenhet, this.utkastId)
        const önskadUrl = '/certificate/' + this.utkastId
        cy.visit(önskadUrl)
        intyg.skrivUt('utkast', this.utkastId, 'ag7804') //skriver ut via request
      })

      it('Makulerar ett låst AG7804 utkast', function() {
        cy.loggaInVårdpersonalIntegrerat(this.vårdpersonal, this.vårdenhet, this.utkastId)
        const önskadUrl = '/certificate/' + this.utkastId
        cy.visit(önskadUrl)
        intyg.makuleraUtkast()
        expect(cy.contains('Utkastet är makulerat'))
      })

      it('Kopiera ett låst AG7804 utkast så att det går att signera', function() {
        cy.loggaInVårdpersonalIntegrerat(this.vårdpersonal, this.vårdenhet, this.utkastId)
        const önskadUrl = '/certificate/' + this.utkastId
        cy.visit(önskadUrl)
        intyg.kopieraUtkast()
        cy.contains(this.utkastId).should('not.exist')
        intyg.signera()
      })

      it('Ett AG7804  låst utkast ska  inte kunna editeras', function() {
        cy.loggaInVårdpersonalIntegrerat(this.vårdpersonal, this.vårdenhet, this.utkastId)
        const önskadUrl = '/certificate/' + this.utkastId
        cy.visit(önskadUrl)
        cy.get('.iu-pt-200 > #ovrigt').should('be.disabled')
        cy.contains('Utkastet är låst').should('exist')
      })
    })
  })
})
