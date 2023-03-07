/// <reference types="Cypress" />
import * as db from '../../support/SKR_intyg/dbIntygHelpers'

describe('Testa DOI-utkast', () => {
  before(() => {
    cy.fixture('SKR_intyg/dbData').as('intygsdata')
    cy.fixture('vEnheter/alfaVC').as('vårdenhet')
    cy.fixture('vPatienter/charlieOlsson').as('vårdtagare')
    cy.fixture('vPersonal/ajlaDoktor').as('vårdpersonal')
  })

  beforeEach(() => {
    // UNSIGNED DOI EMPTY
    db.rensaIntyg(this.vårdtagare.personnummer, this.vårdtagare.personnummerKompakt)
    cy.skapaIntygViaApi(this, 1, 4, false).then((utkastId) => {
      cy.wrap(utkastId).as('utkastId')
      cy.log(`DOI-utkast med id ${utkastId} skapat och används i testfallet`)
    })
  })
  describe('Funktioner på ett tomt DOI utkast', () => {
    it('Ett icke ifylld DOI går ej att signera', () => {
      cy.loggaInVårdpersonalIntegrerat(this.vårdpersonal, this.vårdenhet, this.utkastId)

      const önskadUrl = `/certificate/${this.utkastId}`
      cy.visit(önskadUrl)
      cy.contains('Signera och skicka').click()
      db.verifieraDoiMeddelande()
      cy.contains('Utkastet är sparat').should('exist')
    })

    it('Skriva ut ett icke ifyllt DOI', () => {
      cy.loggaInVårdpersonalIntegrerat(this.vårdpersonal, this.vårdenhet, this.utkastId)
      const önskadUrl = `/certificate/${this.utkastId}`
      cy.visit(önskadUrl)
      db.skrivUt('utkast', this.utkastId, 'doi') // skriver ut via request
    })

    it('Radera ett icke ifyllt DOI', () => {
      cy.loggaInVårdpersonalIntegrerat(this.vårdpersonal, this.vårdenhet, this.utkastId)

      const önskadUrl = `/certificate/${this.utkastId}`
      cy.visit(önskadUrl)
      // Kontrollera namn och personnummer modal
      db.raderaUtkast()
      cy.contains(this.utkastId).should('not.exist')
    })

    it('Fyll i och signera ett DOI', () => {
      cy.loggaInVårdpersonalIntegrerat(this.vårdpersonal, this.vårdenhet, this.utkastId)

      const önskadUrl = `/certificate/${this.utkastId}`
      cy.visit(önskadUrl)

      // Kompletterande patientuppgifter
      cy.get('[id="textinput"]')
        .eq(0)
        .type(this.intygsdata.kompletterandePatientuppgifter.identietenStyrktGenom.text)

      // Dödsdatum och dödsplats
      cy.get('[id="dodsdatumSakerttrue"]').check({ force: true })
      cy.get('input[placeholder=åååå-mm-dd]')
        .eq(0)
        .type(this.intygsdata.dödsdatumOchDödsplats.datum)
      cy.get('[class="TextInput___StyledInput-i4d6wy-0  ic-textfield undefined"]').type(this.intygsdata.dödsdatumOchDödsplats.Kommun)
      cy.get('[id="SJUKHUS"]').check({ force: true })

      // Barn som avidit senast 28 dygn efter födelsen
      cy.get('[id="barnfalse"]').should('be.checked')

      // Läkarens utlåtande om dödsorsaken
      cy.get('[id="terminalDodsorsak"]')
        .eq(1)
        .type(this.intygsdata.utlåtandeOmDödsorsaken.beskrivning)
      cy.get('[id="8.2"]').type(this.intygsdata.utlåtandeOmDödsorsaken.datum)
      cy.get('[id="specification_undefined"]')
        .select('Akut')
        .invoke('val')
        .should('eq', 'PLOTSLIG')

      // Operarad inom fyra veckor före döden
      cy.get('[id="NEJ"]').check({ force: true })

      // Skada/Förgiftning
      cy.get('[id="forgiftningfalse"]').check({ force: true })

      // Dödsorsaksuppgifter grundar sig på
      cy.get('[data-testid="13.1UNDERSOKNING_FORE_DODEN"]').check({ force: true })

      // Signera utkast
      cy.contains('Utkastet är sparat').should('be.visible')
      cy.contains('Klart att signera').should('be.visible')
      cy.contains('Signera och skicka').click()
      cy.contains('Intyget är skickat till Socialstyrelsen').should('be.visible')
    })
  })
})
