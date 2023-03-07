/// <reference types="Cypress" />
import * as intyg from '../../support/FK_intyg/fk_helpers'

//

/**
 * LISJP = Läkarintyg för sjukpenning, FK 7804
 *
 * Some of these testcases are failing due to an open issue:
 * https://inera.atlassian.net/browse/INTYGFV-14823
 */
describe('FK7804-intyg Ärende kommunikation', { tags: '@react' }, () => {
  before(() => {
    cy.fixture('FK_intyg/maxLisjpData').as('intygsdata')
    cy.fixture('vEnheter/alfaMC').as('vårdenhet')
    cy.fixture('vPatienter/athenaAndersson').as('vårdtagare')
    cy.fixture('vPersonal/ajlaDoktor').as('vårdpersonal')
  })

  context('Användare har möjlighet skicka ärendekommunikation på ett Lisjp intyg ', () => {
    beforeEach(() => {
      cy.skapaIntygViaApi(this, 0, 1, true, true).then((utkastId) => {
        cy.wrap(utkastId).as('utkastId')
        cy.log(`Lisjp-utkast med id ${utkastId} skapat och används i testfallet`)
      })
    })
    describe('Funktioner kring ärendekommunikation på ett Lisjp intyg', { tags: '@react' }, () => {
      it('Skicka fråga gällande Avstämningsmöte på ett Lisjp intyg', () => {
        cy.loggaInVårdpersonalIntegrerat(this.vårdpersonal, this.vårdenhet, this.utkastId)

        const önskadUrl = `/certificate/${this.utkastId}`
        cy.visit(önskadUrl)
        intyg.skickaFraga('Avstämningsmöte')
      })

      it('Skicka fråga gällande Kontakt på ett Lisjp intyg', () => {
        cy.loggaInVårdpersonalIntegrerat(this.vårdpersonal, this.vårdenhet, this.utkastId)

        const önskadUrl = `/certificate/${this.utkastId}`
        cy.visit(önskadUrl)
        intyg.skickaFraga('Kontakt')
      })

      it('Skicka fråga gällande Övrigt på ett Lisjp intyg', () => {
        cy.loggaInVårdpersonalIntegrerat(this.vårdpersonal, this.vårdenhet, this.utkastId)

        const önskadUrl = `/certificate/${this.utkastId}`
        cy.visit(önskadUrl)
        intyg.skickaFraga('Övrigt')
      })

      it('Svara på fråga gällande Komplettering  med nytt Intyg på ett Lisjp intyg', () => {
        cy.loggaInVårdpersonalIntegrerat(this.vårdpersonal, this.vårdenhet, this.utkastId)
        const önskadUrl = `/certificate/${this.utkastId}`
        cy.skapaÄrende(this.utkastId, 'COMPLEMENT', 'Nu vill jag ha en komplettering skapad')
        cy.visit(önskadUrl)
        intyg.svaraPaKomplettering('nyttIntyg')
        intyg.signeraSkicka()
        cy.contains(this.utkastId).should('not.exist')
      })

      it('Svara på fråga gällande Komplettering  med meddelande på ett Lisjp intyg', () => {
        cy.loggaInVårdpersonalIntegrerat(this.vårdpersonal, this.vårdenhet, this.utkastId)
        const medText = 'Det är ingen som vill svara så jag svarar med meddelande'
        const önskadUrl = `/certificate/${this.utkastId}`
        cy.visit(önskadUrl)
        cy.skapaÄrende(this.utkastId, 'COMPLEMENT', 'Nu vill jag ha en komplettering skapad')
        cy.reload()
        intyg.svaraPaKomplettering('meddelande', medText)
        cy.contains(medText)
      })

      it('Svara på fråga gällande Komplettering  med text och nytt Intyg på ett Lisjp intyg', () => {
        cy.loggaInVårdpersonalIntegrerat(this.vårdpersonal, this.vårdenhet, this.utkastId)
        const medText = 'Det är ingen som vill svara'
        const önskadUrl = `/certificate/${this.utkastId}`
        cy.visit(önskadUrl)
        cy.skapaÄrende(this.utkastId, 'COMPLEMENT', 'Nu vill jag ha en komplettering skapad')
        cy.reload()
        intyg.svaraPaKomplettering('textIntyg', medText)
        intyg.signeraSkicka()
        cy.contains(this.utkastId).should('not.exist')
        cy.contains(medText)
      })

      it('Markera fråga gällande Komplettering på ett Lisjp intyg som hanterad', () => {
        cy.loggaInVårdpersonalIntegrerat(this.vårdpersonal, this.vårdenhet, this.utkastId)
        const önskadUrl = `/certificate/${this.utkastId}`
        cy.visit(önskadUrl)
        cy.skapaÄrende(this.utkastId, 'COMPLEMENT', 'Nu vill jag ha en komplettering skapad')
        cy.reload()
        cy.contains('Hanterad').click()
        cy.get('.ic-modal').within(() => {
          cy.get('button')
            .contains('Markera som hanterad')
            .click()
        })
        cy.contains('Komplettera').should('not.exist')
      })

      it('Markera fråga gällande Övrigt på ett Lisjp intyg som hanterad och avmarkera den sedan', () => {
        cy.loggaInVårdpersonalIntegrerat(this.vårdpersonal, this.vårdenhet, this.utkastId)

        const önskadUrl = `/certificate/${this.utkastId}`
        cy.visit(önskadUrl)
        cy.skapaÄrende(this.utkastId, 'OTHER', 'Detta är en övrigt fråga från FK', false)
        cy.reload()
        cy.contains('Administrativa frågor').click()
        cy.contains('Hanterad').click()
        cy.contains('Svara').should('not.exist')
        cy.contains('Hanterad').click()
        cy.contains('Svara').should('exist')
      })

      it('Svara på fråga gällande Kontakt på ett Lisjp intyg som har en påminnelse.', () => {
        cy.loggaInVårdpersonalIntegrerat(this.vårdpersonal, this.vårdenhet, this.utkastId)
        const medText = 'this is an answer'
        const önskadUrl = `/certificate/${this.utkastId}`
        cy.visit(önskadUrl)
        cy.skapaÄrende(this.utkastId, 'CONTACT', 'Detta är en Kontakt fråga från FK', true)
        cy.reload()
        cy.contains('Administrativa frågor').click()
        cy.contains('Svara').should('exist')
        cy.contains('Påminnelse').should('exist')
        intyg.svaraPåÄrende('Kontakt', medText)
        cy.contains('Påminnelse').should('not.exist')
        cy.contains('Svara').should('not.exist')
      })

      it('Svara på fråga gällande Avstämningsmöte på ett Lisjp intyg som har en påminnelse.', () => {
        cy.loggaInVårdpersonalIntegrerat(this.vårdpersonal, this.vårdenhet, this.utkastId)
        const medText = 'this is an answer'
        const önskadUrl = `/certificate/${this.utkastId}`
        cy.visit(önskadUrl)
        cy.skapaÄrende(this.utkastId, 'COORDINATION', 'Detta är en Avstämningsmötes fråga från FK', true)
        cy.reload()
        cy.contains('Administrativa frågor').click()
        cy.contains('Svara').should('exist')
        cy.contains('Påminnelse').should('exist')
        intyg.svaraPåÄrende('Avstämningsmöte', medText)
        cy.contains('Påminnelse').should('not.exist')
        cy.contains('Svara').should('not.exist')
      })

      it('Svara på fråga gällande Övrigt på ett Lisjp intyg som har en påminnelse.', () => {
        cy.loggaInVårdpersonalIntegrerat(this.vårdpersonal, this.vårdenhet, this.utkastId)
        const medText = 'this is an answer'
        const önskadUrl = `/certificate/${this.utkastId}`
        cy.visit(önskadUrl)
        cy.skapaÄrende(this.utkastId, 'OTHER', 'Detta är en övrigt fråga från FK', true)
        cy.reload()
        cy.contains('Administrativa frågor').click()
        cy.contains('Svara').should('exist')
        cy.contains('Påminnelse').should('exist')
        intyg.svaraPåÄrende('Övrigt', medText)
        cy.contains('Påminnelse').should('not.exist')
        cy.contains('Svara').should('not.exist')
      })
    })
  })
})
