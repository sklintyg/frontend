import * as fk from './fk_helpers'

// Intyget är uppdelat på samma sätt som det är uppdelat när det fylls i genom WebCert

// Datumen är inte specifika för något testfall

// De funktioner etc. som är gemensamma för alla FK-intyg kan exporteras direkt
export {
  loggaUt,
  skickaTillFk,
  fornya,
  raderaUtkast,
  komplettera,
  makulera,
  ersatta,
  kopieraUtkast,
  makuleraUtkast,
  svaraPåÄrende,
  verifieraLastIntyg,
} from './fk_helpers'

// -------------------- 'Smittbärarpenning' --------------------
// Ej implementerad än

// -------------------- 'Grund för medicinskt underlag' --------------------
export function sektionGrundFörMedicinsktUnderlag(medUnderlag): void {
  const idagMinus5 = Cypress.moment()
    .subtract(5, 'days')
    .format('YYYY-MM-DD')
  const idagMinus6 = Cypress.moment()
    .subtract(6, 'days')
    .format('YYYY-MM-DD')
  const idagMinus14 = Cypress.moment()
    .subtract(14, 'days')
    .format('YYYY-MM-DD')
  const idagMinus15 = Cypress.moment()
    .subtract(15, 'days')
    .format('YYYY-MM-DD')

  if (medUnderlag.intygetÄrBaseratPå) {
    const intygBaserat = medUnderlag.intygetÄrBaseratPå
    if (intygBaserat.minUndersökning) {
      // TODO: Lägger väldigt lång timeout vid första elementet i intyget eftersom
      // sidan ibland inte har hunnit ladda innan den får timeout.
      // Initial analys är att Jenkins är överbelastad då det verkar fungera bra när
      // man kör lokalt.
      cy.get('#checkbox_undersokningAvPatienten', { timeout: 60000 }).check()
      cy.get('#datepicker_undersokningAvPatienten')
        .clear()
        .type(idagMinus5)
    }

    if (intygBaserat.minTelefonkontakt) {
      cy.get('#checkbox_telefonkontaktMedPatienten').check()
      cy.get('#datepicker_telefonkontaktMedPatienten')
        .clear()
        .type(idagMinus6)
    }

    if (intygBaserat.journaluppgifter) {
      cy.get('#checkbox_journaluppgifter').check()
      cy.get('#datepicker_journaluppgifter')
        .clear()
        .type(idagMinus15)
    }

    if (intygBaserat.annat) {
      cy.get('#checkbox_annatGrundForMU').check()
      cy.get('#datepicker_annatGrundForMU')
        .clear()
        .type(idagMinus14)

      // cy.type() tar bara in text eller nummer (så vi behöver inte verifiera värdet)
      cy.get('#annatGrundForMUBeskrivning').type(intygBaserat.annatText)
    }
  }
}

// -------------------- 'Signera intyget' --------------------
export function signera(): void {
  fk.signera()
}

// -------------------- 'Skriv ut intyget' --------------------
export function skrivUt(typAvUtskrift: string, intygsId: string): void {
  switch (typAvUtskrift) {
    case 'utkast':
    case 'fullständigt':
      cy.request({
        method: 'GET',
        url: `moduleapi/intyg/lisjp/${  intygsId  }/pdf`,
      })
      cy.log(`Skriver ut ett ${  typAvUtskrift  } intyg (via cy.request, ej grafiskt)`)
      break
    case 'minimalt':
      cy.request({
        method: 'GET',
        url: `moduleapi/intyg/lisjp/${  intygsId  }/pdf/arbetsgivarutskrift`,
      })
      cy.log('Skriver ut ett minimalt intyg (via cy.request, ej grafiskt)')
      break
    default:
      cy.log('Ingen korrekt typ av utskrift vald')
  }
}

// --------------------Ställa fråga på intyg till FK------------------
export function stallaFragaTillFK(typAvFraga: string): void {
  switch (typAvFraga) {
    case 'Administrativ':
      cy.get('#arende-filter-administrativafragor').click()
      cy.get('.dropdown-label > .material-icons').click()
      cy.get('#new-question-topic-AVSTMN').click()
      cy.get('#arendeNewModelText')
        .click()
        .type(`Detta är en ${  typAvFraga  } fråga`)
      cy.get('#sendArendeBtn')
        .click()
        .then(() => {
          cy.contains(`Detta är en ${  typAvFraga  } fråga`)
        })
      break
    default:
  }
}

export function verifieraMeddelande(): void {
  cy.contains('Utkastet saknar uppgifter i följande avsnitt:').should('exist')
  cy.contains('Grund för medicinskt underlag').should('exist')
  cy.contains('Sysselsättning').should('exist')
  cy.contains('Diagnos').should('exist')
  cy.contains('Sjukdomens konsekvenser för patienten').should('exist')
  cy.contains('Bedömning').should('exist')
  cy.contains('Åtgärder').should('exist')
}

// -------------------- SRS-specifika funktioner --------------------
export function bytTillSrsPanel(): void {
  cy.get('#tab-link-wc-srs-panel-tab').click()
  // Vänta på att text från SRS-panelen syns
  cy.contains('Patienten samtycker till att delta i SRS pilot').should('be.visible')
}

export function srsPatientenSamtyckerChecked(): void {
  cy.contains('Patienten samtycker till att delta i SRS pilot')
    .parent()
    .within(() => {
      cy.get('[type="checkbox"]').check()
    })
}

export function srsKlickaBeräkna(): void {
  // Hämta ut elementet som innehåller alla frågor och "Beräkna"-knappen, klicka på "Beräkna".
  cy.get('#questions').within(() => {
    cy.get('button').click()

    // Verifiera att knappen inte går att trycka på.
    cy.get('button').should('be.disabled')
  })
}

export function läkareAngerPatientrisk(nivå: string): void {
  assert.equal(nivå, 'Högre') // Endast "Högre" är implementerad nedan just nu

  if (nivå === 'Högre') {
    cy.get('#risk-opinion-higher').check()
  }
}

// Verifierar att angiven diagnoskod syns under "Råd och åtgärder"
export function verifieraDiagnosUnderRådOchÅtgärder(diagnoskod: string): void {
  cy.contains('Råd och åtgärder').click()
  cy.get('#atgarder').contains(diagnoskod)
}

// Verifierar att angiven diagnoskod syns under "Tidigare Riskbedömning"
export function verifieraDiagnosUnderTidigareRiskbedömning(diagnoskod: string): void {
  cy.contains('Tidigare riskbedömning').click()
  cy.get('#riskDiagram').contains(diagnoskod)
}

// Verifierar att angiven diagnoskod syns under "Statistik"
export function verifieraDiagnosUnderStatistik(diagnoskod: string): void {
  cy.contains('Statistik').click()
  cy.get('#nationalStatisticsHeader').contains(diagnoskod)
}

export function kompletteraLisjp(): void {
  fk.komplettera()
}

export function skapaAdmFragaLisjp(): void {
  fk.skapaAdmFraga()
}

export function hanteraFragaLisjp(): void {
  fk.hanteraFraga()
}
