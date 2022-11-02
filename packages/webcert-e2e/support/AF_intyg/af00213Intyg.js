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
  skrivUt,
  skickaTillFk,
  fornya,
  raderaUtkast,
  makuleraIntyg,
  makuleraUtkast,
  komplettera,
  signeraSkicka,
  makulera,
  ersatta,
  kopieraUtkast,
} from './../FK_intyg/fk_helpers'

export function verifieraMeddelande() {
  cy.get('.iu-pt-400').within((texter) => {
    cy.contains('Utkastet saknar uppgifter i följande avsnitt:').should('exist')
    cy.contains('Funktionsnedsättning').should('exist')
    cy.contains('Utredning och behandling').should('exist')
    cy.contains('Arbetets påverkan på sjukdom/skada').should('exist')
  })
}
