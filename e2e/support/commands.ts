/// <reference types="cypress" />

Cypress.Commands.add('removeCertificate', () => {
  cy.get('[data-testid="remove-certificate-button"]').should('be.visible')
  cy.contains('Radera').click()
  cy.get('.ic-modal').within(() => {
    cy.get('button').contains('Radera').click()
  })
})

Cypress.Commands.add('signAndSendCertificate', () => {
  cy.contains('Klart att signera')
  cy.contains('Obligatoriska uppgifter saknas').should('not.exist')
  cy.contains('Utkastet sparas').should('not.exist')
  cy.get('button').contains('Signera och skicka').click()
})

Cypress.Commands.add('signCertificate', () => {
  cy.contains('Klart att signera')
  cy.contains('Obligatoriska uppgifter saknas').should('not.exist')
  cy.contains('Utkastet sparas').should('not.exist')

  cy.get('button').contains('Signera intyget').click()
  cy.contains('Intyget är tillgängligt för patienten').should('exist')
})

Cypress.Commands.add('logout', () => {
  cy.clearCookies()
  cy.visit('/logout')
})

Cypress.Commands.add('sendCertificateQuestion', (subject: string) => {
  cy.contains('Administrativa frågor').click()
  cy.get('select').select(subject)
  cy.get('.ic-textarea').type(`skickar en fråga angående ${subject}`)
  cy.contains('Utkast sparat')
  cy.get('button').contains('Skicka').click()
  cy.contains(`skickar en fråga angående ${subject}`).should('exist')
  cy.contains('Hanterad').click()
})

Cypress.Commands.add('sendCertificateToFK', () => {
  cy.get('button').contains('Skicka till Försäkringskassan').click()

  cy.get('.ic-modal').within(() => {
    cy.get('button').contains('Skicka till Försäkringskassan').click()
  })
})

Cypress.Commands.add('printCertificateDraft', () => {
  cy.get('button').contains('Skriv ut').click()
})

Cypress.Commands.add('replaceCertificate', () => {
  cy.get('[data-tip="Skapar en kopia av detta intyg som du kan redigera."] > .ic-button').should('be.visible').contains('Ersätt').click()
  cy.get('.ic-modal').then((ele) => {
    if (
      ele
        .text()
        .includes(
          'Ett intyg kan ersättas om det innehåller felaktiga uppgifter eller om ny information tillkommit efter att intyget utfärdades'
        )
    ) {
      cy.get('.ic-button-group').contains('Ersätt').click()
    }
  })
})

Cypress.Commands.add('renewCertificate', () => {
  cy.get('button').contains('Förnya').click()
  // cy.get('#fornyaBtn').click();
  // cy.get('.iu-pb-400').then

  cy.get('.ic-modal').then((ele) => {
    if (ele.text().includes('Förnya intyg kan användas vid förlängning av en sjukskrivning')) {
      // cy.get('.ic-button-group > :nth-child(1) > .ic-button')
      cy.get('.ic-button-group').contains('Förnya').click()
      // cy.get('#button1fornya-dialog').click();
    }
  })
})

Cypress.Commands.add('copyCertificateDraft', () => {
  // eslint-disable-next-line cypress/unsafe-to-chain-command
  cy.contains('Kopiera')
    .click()
    .then(() => {
      cy.get('.ic-modal').then((ele) => {
        if (ele.text().includes('Kopiera låst utkast')) {
          cy.get('.ic-modal').within(() => {
            cy.get('button').contains('Kopiera').click()
          })
        }
      })
    })
})

Cypress.Commands.add('answerCertificateIssue', (questionType: string, message: string) => {
  cy.get('.ic-card').within(() => {
    cy.contains(questionType).should('exist')
    cy.contains('Svara').click()
    cy.get('.ic-textarea').should('be.visible').type(message)
    cy.contains('Skicka').click()
  })
})

Cypress.Commands.add('answerCertificateSupplement', (alternativ: 'nyttIntyg' | 'meddelande' | 'textIntyg', message = '') => {
  switch (alternativ) {
    case 'nyttIntyg':
      cy.contains('Komplettera').click()
      break
    case 'meddelande':
      cy.contains('Kan ej komplettera').click()
      cy.get('.ic-modal').within(() => {
        cy.contains('Ingen på vårdenheten kan ansvara för det medicinska innehållet i intyget').should('be.visible').click()
        cy.get('[data-testid="question-answer-textarea"]').type(message)
        cy.contains('Skicka svar').click()
      })
      cy.log('Svarar med meddelande')
      break
    case 'textIntyg':
      cy.contains('Kan ej komplettera').should('be.visible').click()
      cy.get('.ic-modal').within(() => {
        cy.contains('Ingen ytterligare medicinsk information kan anges.').should('be.visible').click()
        cy.get('[data-testid="question-answer-textarea"]').type(message)
        cy.contains('Skicka svar').click()
      })
      cy.log('Svarar med text')

      break
    default:
      cy.log('Inget bra alternativ valt')
  }
})

Cypress.Commands.add('removeCertificateDraft', () => {
  cy.get('[data-testid="remove-certificate-button"]').should('be.visible')
  cy.contains('Radera').click()
  cy.get('.ic-modal').within(() => {
    cy.get('button').contains('Radera').click()
  })
})

Cypress.Commands.add('voidCertificate', () => {
  cy.contains('Makulera').click()
  cy.contains('Intyget har utfärdats på fel patient').click()

  cy.get('.ic-radio-group-vertical > :nth-child(2) > .undefined').type('Intyget har utfärdats på fel patient')
  cy.get('.ic-modal').within(() => {
    cy.get('button').contains('Makulera').click()
  })
})

Cypress.Commands.add('voidCertificateDraft', () => {
  cy.contains('Makulera').should('be.visible').click()
  cy.get('.ic-modal').within(() => {
    cy.contains('Utkastet har skapats på fel patient').click()
    cy.get('.ic-radio-group-vertical > :nth-child(2) > .undefined').type('Utkastet har skapats på fel patient')
    cy.get('button').contains('Makulera').click()
  })
})

Cypress.Commands.add('verifyLastCertificate', () => {
  cy.contains('Utkastet är låst').click()
  cy.get('.ic-modal').within(() => {
    cy.get('button').contains('Stäng').click()
  })
})

Cypress.Commands.add('complementCertificate', () => {
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
})

Cypress.Commands.add('forwardCertificate', () => {
  cy.get('#ta-bort-utkast').click()
  cy.get('#confirm-draft-delete-button').click()
})

Cypress.Commands.add('createAdministratorQuestion', () => {
  cy.contains('Intyget är skickat till Försäkringskassan')
  cy.contains('Obligatoriska uppgifter saknas').should('not.exist')
  cy.contains('Utkastet sparas').should('not.exist')
  cy.get('#arende-filter-administrativafragor').click()
  cy.get('#new-question-topic-selected-item-label').click()
  cy.get('#new-question-topic-AVSTMN').click()

  cy.get('#arendeNewModelText').type('SKAPAR ADM FRÅGA')
  cy.get('#arendeNewModelText').type('{enter}')
  cy.get('#sendArendeBtn').click()
})

Cypress.Commands.add('handleQuestion', () => {
  cy.get('.checkbox-inline').click()
})
