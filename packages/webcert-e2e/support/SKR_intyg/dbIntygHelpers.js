import * as fk from '../FK_intyg/fk_helpers'

// Intyget är uppdelat på samma sätt som det är uppdelat när det fylls i genom WebCert

// Datumen är inte specifika för något testfall

// De funktioner etc. som är gemensamma för alla FK-intyg kan exporteras direkt
export {
  besökÖnskadUrl,
  loggaUtLoggaIn,
  sektionÖvrigt,
  sektionKontakt,
  loggaUt,
  kopiera,
  skickaTillFk,
  fornya,
  raderaUtkast,
  makuleraIntyg,
  komplettera,
  makulera,
  ersatta,
  kopieraUtkast,
  makuleraUtkast,
  svaraPåÄrende,
} from '../FK_intyg/fk_helpers'

// -------------------- 'Vårdenhetens adress' --------------------
// Ej implementerad

// -------------------- 'Signera intyget' --------------------
export function signera() {
  fk.signera()
}

// -------------------- 'Skriv ut intyget' --------------------
export function skrivUt(typAvUtskrift, intygsId) {
  switch (typAvUtskrift) {
    case 'utkast':
    case 'fullständigt':
      cy.request({
        method: 'GET',
        url: 'moduleapi/intyg/db/' + intygsId + '/pdf',
      })
      cy.log('Skriver ut ett ' + typAvUtskrift + ' intyg (via cy.request, ej grafiskt)')
      break
    case 'minimalt':
      cy.request({
        method: 'GET',
        url: 'moduleapi/intyg/db/' + intygsId + '/pdf/arbetsgivarutskrift',
      })
      cy.log('Skriver ut ett minimalt intyg (via cy.request, ej grafiskt)')
      break
    default:
      cy.log('Ingen korrekt typ av utskrift vald')
  }
}

export function verifieraMeddelande() {
  cy.contains('Obligatoriska uppgifter saknas').should('exist')
  cy.get('.iu-pt-400').within(() => {
    cy.contains('Utkastet saknar uppgifter i följande avsnitt:').should('exist')
    cy.contains('Kompletterande patientuppgifter').should('exist')
    cy.contains('Dödsdatum och dödsplats').should('exist')
    cy.contains('Explosivt implantat').should('exist')
    cy.contains('Yttre undersökning').should('exist')
    cy.contains('Polisanmälan').should('exist')
  })
}

//Ersätt med DB
export function kompletteraLisjp() {
  fk.komplettera()
}

export function rensaIntyg(personnummer, personnummerKompakt) {
  cy.exec('curl -X DELETE https://webcert-devtest.intyg.nordicmedtest.se/testability/intyg/handelser/patient/' + personnummerKompakt)
  cy.exec('curl -X DELETE https://webcert-devtest.intyg.nordicmedtest.se/testability/intyg/patient/' + personnummer)
  cy.exec(
    'curl -X DELETE https://intygstjanst-devtest.intyg.nordicmedtest.se/inera-certificate/resources/certificate/citizen/' + personnummer
  )
}

export function accepteraDbModal() {
  cy.get('[type="checkbox"]').check({ force: true })
  cy.contains('Gå vidare').click()
}
