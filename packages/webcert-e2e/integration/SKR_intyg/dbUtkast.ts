/// <reference types="Cypress" />
import * as db from '../../support/SKR_intyg/dbIntygHelpers'

describe('Testa DB-utkast', function() {
  before(function() {
    cy.fixture('SKR_intyg/dbData').as('intygsdata')
    cy.fixture('vEnheter/alfaVC').as('vårdenhet')
    cy.fixture('vPatienter/charlieOlsson').as('vårdtagare')
    cy.fixture('vPersonal/ajlaDoktor').as('vårdpersonal')
  })

  beforeEach(function() {
    //UNSIGNED DB EMPTY
    db.rensaIntyg(this.vårdtagare.personnummer, this.vårdtagare.personnummerKompakt)
    cy.skapaIntygViaApi(this, 1, 3, false).then((utkastId) => {
      cy.wrap(utkastId).as('utkastId')
      cy.log('DB-utkast med id ' + utkastId + ' skapat och används i testfallet')
    })
  })
  describe('Funktioner på ett tomt DB utkast', () => {
    it('Ett icke ifylld DB går ej att signera', function() {
      cy.loggaInVårdpersonalIntegrerat(this.vårdpersonal, this.vårdenhet, this.utkastId)

      const önskadUrl = '/certificate/' + this.utkastId
      cy.visit(önskadUrl)

      //Kontrollera namn och personnummer modal
      db.accepteraDbModal()
      cy.contains('Signera och skicka').click()
      db.verifieraMeddelande()
    })

    it('Skriva ut ett icke ifyllt DB', function() {
      cy.loggaInVårdpersonalIntegrerat(this.vårdpersonal, this.vårdenhet, this.utkastId)
      const önskadUrl = '/certificate/' + this.utkastId
      cy.visit(önskadUrl)
      //Kontrollera namn och personnummer modal
      db.accepteraDbModal()
      db.skrivUt('utkast', this.utkastId, 'db') //skriver ut via request
    })

    it('Radera ett icke ifyllt DB', function() {
      cy.loggaInVårdpersonalIntegrerat(this.vårdpersonal, this.vårdenhet, this.utkastId)

      const önskadUrl = '/certificate/' + this.utkastId
      cy.visit(önskadUrl)
      //Kontrollera namn och personnummer modal
      db.accepteraDbModal()
      db.raderaUtkast()
      cy.contains(this.utkastId).should('not.exist')
    })

    it('Fyll i och signera ett DB', function() {
      cy.loggaInVårdpersonalIntegrerat(this.vårdpersonal, this.vårdenhet, this.utkastId)

      const önskadUrl = '/certificate/' + this.utkastId
      cy.visit(önskadUrl)

      //Kontrollera namn och personnummer modal
      db.accepteraDbModal()

      cy.get('[name="identitetStyrkt"]').type(this.intygsdata.kompletterandePatientuppgifter.identietenStyrktGenom.text)
      cy.get('[id="dodsdatumSakerttrue"]').check({ force: true })
      cy.get('input[placeholder=åååå-mm-dd]').type(this.intygsdata.dödsdatumOchDödsplats.datum)
      cy.get('[class="TextInput___StyledInput-i4d6wy-0  ic-textfield undefined"]').type(this.intygsdata.dödsdatumOchDödsplats.Kommun)
      cy.get('[id="SJUKHUS"]').check({ force: true })
      cy.get('[id="barnfalse"]').should('be.checked')
      cy.get('#explosivImplantatfalse').check({ force: true })
      cy.get('#JA').check({ force: true })
      cy.get('#polisanmalanfalse').check({ force: true })

      cy.contains('Utkastet är sparat').should('be.visible')
      cy.contains('Klart att signera').should('be.visible')
      cy.contains('Signera och skicka').click()
      cy.contains('Intyget är skickat till Skatteverket').should('be.visible')
      cy.contains('Intyget är tillgängligt för patienten').should('be.visible')
    })
  })
})
