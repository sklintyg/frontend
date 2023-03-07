/// <reference types="Cypress" />

import * as intyg from '../../support/FK_intyg/lisjpIntyg'

// LISJP = Läkarintyg för sjukpenning, FK 7804
describe('LISJP-intyg låst utkast', { tags: '@react' }, () => {
  before(() => {
    cy.fixture('AF_intyg/maxAF00213Data').as('intygsdata')
    cy.fixture('vEnheter/alfaVC').as('vårdenhet')
    cy.fixture('vPatienter/tolvanTolvansson').as('vårdtagare')
    cy.fixture('vPersonal/ajlaDoktor').as('vårdpersonal')
  })

  context('Användare har möjlighet att uföra följande med låst LISJP Utkast ', () => {
    beforeEach(() => {
      cy.skapaIntygViaApi(this, 2, 1, true).then((utkastId) => {
        cy.wrap(utkastId).as('utkastId')
        cy.log(`LISJP-låst utkast med id ${utkastId} skapat och används i testfallet`)
      })
    })
    describe('Funktioner på ett låst LISJP utkast', { tags: '@react' }, () => {
      it('Skriva ut ett låst LISJP utkast', () => {
        cy.loggaInVårdpersonalIntegrerat(this.vårdpersonal, this.vårdenhet, this.utkastId)
        const önskadUrl = `/certificate/${this.utkastId}`
        cy.visit(önskadUrl)
        intyg.verifieraLastIntyg()
        intyg.skrivUt('utkast', this.utkastId, 'lisjp') // skriver ut via request
      })

      it('Makulerar ett låst LISJP utkast', () => {
        cy.loggaInVårdpersonalIntegrerat(this.vårdpersonal, this.vårdenhet, this.utkastId)

        const önskadUrl = `/certificate/${this.utkastId}`
        cy.visit(önskadUrl)
        intyg.verifieraLastIntyg()

        intyg.makuleraUtkast()
        expect(cy.contains('Utkastet är makulerat'))
      })
      it('Kopiera ett låst LISJP utkast så att det går att signera och skicka', () => {
        cy.loggaInVårdpersonalIntegrerat(this.vårdpersonal, this.vårdenhet, this.utkastId)

        const önskadUrl = `/certificate/${this.utkastId}`
        cy.visit(önskadUrl)

        intyg.verifieraLastIntyg()

        intyg.kopieraUtkast()
        cy.contains(this.utkastId).should('not.exist')
        intyg.signera()
        intyg.skickaTillFk()
      })
      it('Ett LISJP  låst utkast ska  inte kunna editeras', () => {
        cy.loggaInVårdpersonalIntegrerat(this.vårdpersonal, this.vårdenhet, this.utkastId)
        const önskadUrl = `/certificate/${this.utkastId}`
        cy.visit(önskadUrl)
        intyg.verifieraLastIntyg()
        cy.get('.ic-textarea').should('be.disabled')
        cy.contains('Utkastet är låst').should('exist')
      })
    })
  })
})
