import { getDoctor } from '../../../../fixtures/getDoctor'
import { getUnit } from '../../../../fixtures/getUnit'
import { createCertificate } from '../../../../helpers/createCertificate'
import { createCertificateIssue } from '../../../../helpers/createCertificateIssue'
import { deleteCertificate } from '../../../../helpers/deleteCertificate'
import { deleteCertificateEvents } from '../../../../helpers/deleteCertificateEvents'
import { fakeLogin } from '../../../../helpers/fakeLogin'
import { getCertificateInfo } from '../../../../helpers/getCertificateInfo'

const { name, internalType, versions, type } = getCertificateInfo('lisjp')

describe(`${name} questions`, () => {
  const unit = getUnit('AlfaMC')
  const doctor = getDoctor('Alja')
  const patientId = '194011306125' // Athena React Andersson
  let certificateId: string

  beforeEach(() => {
    createCertificate({
      certificateType: internalType,
      certificateTypeVersion: versions.at(-1),
      status: 'SIGNED',
      fillType: 'MINIMAL',
      patientId,
      personId: doctor.hsaId,
      unitId: unit.enhetId,
      sent: true,
    }).then((data) => {
      certificateId = data.body.certificateId
      fakeLogin(doctor, unit)
      cy.visit(`/certificate/${certificateId}`)
    })
  })

  afterEach(() => {
    deleteCertificate(certificateId)
    deleteCertificateEvents(certificateId)
  })

  it(`Skicka fråga gällande Avstämningsmöte på ett ${type} intyg`, () => {
    cy.sendCertificateQuestion('Avstämningsmöte')
  })

  it(`Skicka fråga gällande Kontakt på ett ${type} intyg`, () => {
    cy.sendCertificateQuestion('Kontakt')
  })

  it(`Skicka fråga gällande Övrigt på ett ${type} intyg`, () => {
    cy.sendCertificateQuestion('Övrigt')
  })

  it(`Svara på fråga gällande Komplettering med nytt Intyg på ett ${type} intyg`, () => {
    createCertificateIssue(certificateId, 'COMPLEMENT', 'Nu vill jag ha en komplettering skapad')
    cy.answerCertificateSupplement('nyttIntyg')
    cy.signAndSendCertificate()
    cy.contains(certificateId).should('not.exist')
  })

  it(`Svara på fråga gällande Komplettering med meddelande på ett ${type} intyg`, () => {
    const message = 'Det är ingen som vill svara så jag svarar med meddelande'
    createCertificateIssue(certificateId, 'COMPLEMENT', 'Nu vill jag ha en komplettering skapad')
    cy.reload()
    cy.answerCertificateSupplement('meddelande', message)
    cy.contains(message)
  })

  it(`Svara på fråga gällande Komplettering  med text och nytt Intyg på ett ${type} intyg`, () => {
    const message = 'Det är ingen som vill svara'
    createCertificateIssue(certificateId, 'COMPLEMENT', 'Nu vill jag ha en komplettering skapad')
    cy.reload()
    cy.answerCertificateSupplement('textIntyg', message)
    cy.signAndSendCertificate()
    cy.contains(certificateId).should('not.exist')
    cy.contains(message)
  })

  it(`Markera fråga gällande Komplettering på ett ${type} intyg som hanterad`, () => {
    createCertificateIssue(certificateId, 'COMPLEMENT', 'Nu vill jag ha en komplettering skapad')
    cy.reload()
    cy.contains('Hanterad').click()
    cy.get('.ic-modal').within(() => {
      cy.get('button').contains('Markera som hanterad').click()
    })
    cy.contains('Komplettera').should('not.exist')
  })

  it(`Markera fråga gällande Övrigt på ett ${type} intyg som hanterad och avmarkera den sedan`, () => {
    createCertificateIssue(certificateId, 'OTHER', 'Detta är en övrigt fråga från FK', false)
    cy.reload()
    cy.contains('Administrativa frågor').click()
    cy.contains('Hanterad').click()
    cy.contains('Svara').should('not.exist')
    cy.contains('Hanterad').click()
    cy.contains('Svara').should('exist')
  })

  it(`Svara på fråga gällande Kontakt på ett ${type} intyg som har en påminnelse.`, () => {
    createCertificateIssue(certificateId, 'CONTACT', 'Detta är en Kontakt fråga från FK', true)
    cy.reload()
    cy.contains('Administrativa frågor').click()
    cy.contains('Svara').should('exist')
    cy.contains('Påminnelse').should('exist')
    cy.answerCertificateIssue('Kontakt', 'this is an answer')
    cy.contains('Påminnelse').should('not.exist')
    cy.contains('Svara').should('not.exist')
  })

  it(`Svara på fråga gällande Avstämningsmöte på ett ${type} intyg som har en påminnelse.`, () => {
    createCertificateIssue(certificateId, 'COORDINATION', 'Detta är en Avstämningsmötes fråga från FK', true)
    cy.reload()
    cy.contains('Administrativa frågor').click()
    cy.contains('Svara').should('exist')
    cy.contains('Påminnelse').should('exist')
    cy.answerCertificateIssue('Avstämningsmöte', 'this is an answer')
    cy.contains('Påminnelse').should('not.exist')
    cy.contains('Svara').should('not.exist')
  })

  it(`Svara på fråga gällande Övrigt på ett ${type} intyg som har en påminnelse.`, () => {
    createCertificateIssue(certificateId, 'OTHER', 'Detta är en övrigt fråga från FK', true)
    cy.reload()
    cy.contains('Administrativa frågor').click()
    cy.contains('Svara').should('exist')
    cy.contains('Påminnelse').should('exist')
    cy.answerCertificateIssue('Övrigt', 'this is an answer')
    cy.contains('Påminnelse').should('not.exist')
    cy.contains('Svara').should('not.exist')
  })
})
