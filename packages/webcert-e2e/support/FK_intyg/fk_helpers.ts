/**
 * Denna fil innehåller FK-gemensamma funktioner för att reducera mängden duplicerad kod
 */

export function besökÖnskadUrl(önskadUrl, vPersonal, vEnhet, utkastId): void {
  cy.visit(önskadUrl)
  //cy.get('.intygs-id').should('be.visible');
  // Om vi dirigeras till sidan som säger att 'Intygsutkastet är raderat'
  // så försöker vi igen eftersom det antagligen gick för snabbt.
  cy.get('body').then(($body) => {
    if ($body.text().includes('Intygsutkastet är raderat och kan därför inte längre visas.')) {
      cy.log("Kom till 'Intygetsutkastet är raderat', antagligen gick det för snabbt. Provar igen.")
      cy.loggaInVårdpersonalIntegrerat(vPersonal, vEnhet) // Vi behöver logga in igen
      cy.visit(önskadUrl)
    }
  })
  cy.url().should('include', utkastId)
}

export function loggaUtLoggaIn(vPersonal, vEnhet): void {
  // Lite specialvariant av logga ut/logga in för att sedan öppna intyget på nytt med en ny session
  cy.clearCookies()
  cy.visit('/logout')
  cy.loggaInVårdpersonalIntegrerat(vPersonal, vEnhet)
}

export function loggaUt(): void {
  // loggar ut
  cy.clearCookies()
  cy.visit('/logout')
}

export function sektionÖvrigt(övrigt): void {
  cy.get('#ovrigt').type(övrigt.text)
}

export function sektionKontakt(kontakt): void {
  if (kontakt.ja) {
    cy.get('#kontaktMedFk').check()

    if (kontakt.text) {
      cy.get('#anledningTillKontakt').type(kontakt.text)
    }
  }
}

export function signeraSkicka(): void {
  cy.contains('Klart att signera')
  cy.contains('Obligatoriska uppgifter saknas').should('not.exist')
  cy.contains('Utkastet sparas').should('not.exist')
  cy.get('button')
    .contains('Signera och skicka')
    .click()
}

export function skickaFraga(amne): void {
  cy.contains('Administrativa frågor').click()
  cy.get('select').select(amne)
  cy.get('.ic-textarea').type('skickar en fråga angående ' + amne)
  cy.contains('Utkast sparat')
  cy.get('button')
    .contains('Skicka')
    .click()
  cy.contains('skickar en fråga angående ' + amne).should('exist')
  cy.contains('Hanterad').click()
}

export function signera(): void {
  cy.contains('Klart att signera')
  cy.contains('Obligatoriska uppgifter saknas').should('not.exist')
  cy.contains('Utkastet sparas').should('not.exist')

  cy.get('button')
    .contains('Signera intyget')
    .click()
  cy.contains('Intyget är tillgängligt för patienten').should('exist')
}

export function skickaTillFk(): void {
  cy.get('button')
    .contains('Skicka till Försäkringskassan')
    .click()

  cy.get('.ic-modal').within(() => {
    cy.get('button')
      .contains('Skicka till Försäkringskassan')
      .click()
  })
}

export function skrivUtUtkast(): void {
  cy.get('button')
    .contains('Skriv ut')
    .click()
}

// Generell utskriftsfunktion. Gäller inte för t.ex. LISJP
export function skrivUt(typAvUtskrift: string, intygsId: string, intygsTyp: string): void {
  const theUrl = 'moduleapi/intyg/' + intygsTyp + '/' + intygsId + '/pdf' + typAvUtskrift
  switch (typAvUtskrift) {
    case 'utkast':
    case 'fullständigt':
      cy.request({
        method: 'GET',
        url: 'moduleapi/intyg/' + intygsTyp + '/' + intygsId + '/pdf',
      })
      cy.log(theUrl)
      cy.log('Skriver ut ett ' + typAvUtskrift + ' intyg (via cy.request, ej grafiskt)')
      break
    default:
      cy.log('Ingen korrekt typ av utskrift vald')
  }
}

export function ersatta(): void {
  cy.get('[data-tip="Skapar en kopia av detta intyg som du kan redigera."] > .ic-button')
    .should('be.visible')
    .contains('Ersätt')
    .click()
  cy.get('.ic-modal').then((ele) => {
    if (
      ele
        .text()
        .includes(
          'Ett intyg kan ersättas om det innehåller felaktiga uppgifter eller om ny information tillkommit efter att intyget utfärdades'
        )
    ) {
      cy.get('.ic-button-group')
        .contains('Ersätt')
        .click()
    }
  })
}

export function fornya(): void {
  cy.get('button')
    .contains('Förnya')
    .click()
  //cy.get('#fornyaBtn').click();
  //cy.get('.iu-pb-400').then

  cy.get('.ic-modal').then((ele) => {
    if (ele.text().includes('Förnya intyg kan användas vid förlängning av en sjukskrivning')) {
      //cy.get('.ic-button-group > :nth-child(1) > .ic-button')
      cy.get('.ic-button-group')
        .contains('Förnya')
        .click()
      //cy.get('#button1fornya-dialog').click();
    }
  })
}

export function kopieraUtkast(): void {
  cy.contains('Kopiera')
    .click()
    .then(() => {
      cy.get('.ic-modal').then((ele) => {
        if (ele.text().includes('Kopiera låst utkast')) {
          cy.get('.ic-modal').within(() => {
            cy.get('button')
              .contains('Kopiera')
              .click()
          })
        }
      })
    })
}

export function svaraPåÄrende(typAvFråga, meddelande): void {
  cy.get('.ic-card').within(() => {
    cy.contains(typAvFråga).should('exist')
    cy.contains('Svara').click()
    cy.get('.ic-textarea')
      .should('be.visible')
      .type(meddelande)
    cy.contains('Skicka').click()
  })
}

export function svaraPaKomplettering(alternativ, meddelandeText): void {
  switch (alternativ) {
    case 'nyttIntyg':
      // cy.get('.ic-modal').within((modal)=>
      //{
      cy.contains('Komplettera').click()
      // });
      break
    case 'meddelande':
      cy.contains('Kan ej komplettera').click()
      cy.get('.ic-modal').within(() => {
        cy.contains('Ingen på vårdenheten kan ansvara för det medicinska innehållet i intyget')
          .should('be.visible')
          .click()
        cy.get('.ic-textarea').type(meddelandeText)
        cy.contains('Skicka svar').click()
      })
      cy.log('Svarar med meddelande')
      break
    case 'textIntyg':
      cy.contains('Kan ej komplettera')
        .should('be.visible')
        .click()
      cy.get('.ic-modal').within(() => {
        cy.contains('Ingen ytterligare medicinsk information kan anges.')
          .should('be.visible')
          .click()
        cy.get('.ic-textarea').type(meddelandeText)
        cy.contains('Skicka svar').click()
      })
      cy.log('Svarar med text')

      break
    default:
      cy.log('Inget bra alternativ valt')
  }
}

export function raderaUtkast(): void {
  cy.get('[data-testid="remove-certificate-button"]').should('be.visible')
  cy.contains('Radera').click()
  cy.get('.ic-modal').within(() => {
    cy.get('button')
      .contains('Radera')
      .click()
  })
}

export function makulera(): void {
  cy.contains('Makulera').click()
  cy.contains('Intyget har utfärdats på fel patient').click()

  cy.get('.ic-radio-group-vertical > :nth-child(2) > .undefined').type('Intyget har utfärdats på fel patient')
  cy.get('.ic-modal').within(() => {
    cy.get('button')
      .contains('Makulera')
      .click()
  })
}

export function makuleraUtkast(): void {
  cy.contains('Makulera')
    .should('be.visible')
    .click()
  cy.get('.ic-modal').within(() => {
    cy.contains('Utkastet har skapats på fel patient').click()
    cy.get('.ic-radio-group-vertical > :nth-child(2) > .undefined').type('Utkastet har skapats på fel patient')
    cy.get('button')
      .contains('Makulera')
      .click()
  })
}

export function verifieraLastIntyg(): void {
  cy.contains('Utkastet är låst').click()
  cy.get('.ic-modal').within(() => {
    cy.get('button')
      .contains('Stäng')
      .click()
  })
}

export function makuleraIntyg(arg): void {
  cy.get('#makuleraBtn').click()
  if (arg === 'Annat allvarligt fel') {
    cy.get('#reason-ANNAT_ALLVARLIGT_FEL').check()
    cy.get('#clarification-ANNAT_ALLVARLIGT_FEL').type('Testanledning')
    cy.get('#button1makulera-dialog').click()
  } else {
    cy.get('#reason-FEL_PATIENT').check()
    cy.get('#button1makulera-dialog').click()
  }
}

export function komplettera(): void {
  cy.get('#showallstatusesLink > span').click()
  cy.get('body').then(($body) => {
    if ($body.text().includes('Det finns redan en påbörjad komplettering')) {
      cy.get('#confirmationOkButton').click()
      cy.log('Är och kompletterar på det redan skapade')
      cy.get('#komplettera-open-utkast').click()
    } else {
      cy.get('#confirmationOkButton').click()
      cy.log('Är och kompletterar på det första')
      cy.get('#komplettera-intyg').click()
    }
  })
}

export function vidarebefordra(): void {
  cy.get('#ta-bort-utkast').click()
  cy.get('#confirm-draft-delete-button').click()
}

export function skapaAdmFraga(): void {
  cy.contains('Intyget är skickat till Försäkringskassan')
  cy.contains('Obligatoriska uppgifter saknas').should('not.exist')
  cy.contains('Utkastet sparas').should('not.exist')
  cy.get('#arende-filter-administrativafragor').click()
  cy.get('#new-question-topic-selected-item-label').click()
  cy.get('#new-question-topic-AVSTMN').click()

  cy.get('#arendeNewModelText')
    .type('SKAPAR ADM FRÅGA')
    .type('{enter}')
  cy.get('#sendArendeBtn').click()
}

export function hanteraFraga(): void {
  cy.get('.checkbox-inline').click()
}
