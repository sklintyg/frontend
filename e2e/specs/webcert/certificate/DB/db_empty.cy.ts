import { getDoctor } from '../../../../fixtures/getDoctor'
import { getUnit } from '../../../../fixtures/getUnit'
import { createCertificate } from '../../../../helpers/createCertificate'
import { deleteAllPatientCertificate } from '../../../../helpers/deleteAllPatientCertificate'
import { deleteAllPatientEvents } from '../../../../helpers/deleteAllPatientEvents'
import { deleteCertificate } from '../../../../helpers/deleteCertificate'
import { deleteCertificateEvents } from '../../../../helpers/deleteCertificateEvents'
import { fakeLogin } from '../../../../helpers/fakeLogin'
import { getCertificateInfo } from '../../../../helpers/getCertificateInfo'
import { printCertificate } from '../../../../helpers/printCertificate'

const { name, internalType, versions } = getCertificateInfo('db')

describe(`Signerat ${name} intyg`, () => {
  const unit = getUnit('AlfaVC')
  const doctor = getDoctor('Alja')
  const patientId = '192504289253' // Charlie Olsson
  let certificateId: string

  before(() => {
    deleteAllPatientEvents(patientId)
    deleteAllPatientCertificate(patientId)
  })

  afterEach(() => {
    deleteCertificate(certificateId)
    deleteCertificateEvents(certificateId)
  })

  beforeEach(() => {
    createCertificate({
      certificateType: internalType,
      certificateTypeVersion: versions.at(-1),
      status: 'UNSIGNED',
      fillType: 'EMPTY',
      patientId,
      personId: doctor.hsaId,
      unitId: unit.enhetId,
    }).then((data) => {
      certificateId = data.body.certificateId
      fakeLogin(doctor, unit)
      cy.visit(`/certificate/${certificateId}`)

      // Accept modal
      // cy.get('[type="checkbox"]').check({ force: true })
      // cy.contains('Gå vidare').click()
    })
  })

  it('Ett icke ifylld DB går ej att signera', () => {
    cy.contains('Signera och skicka').click()
    cy.contains('Obligatoriska uppgifter saknas').should('exist')
    cy.get('[data-testid="certificate-validation"]').within(() => {
      cy.contains('Kompletterande patientuppgifter').should('exist')
      cy.contains('Dödsdatum och dödsplats').should('exist')
      cy.contains('Barn som avlidit senast 28 dygn efter födelsen').should('exist')
      cy.contains('Explosivt implantat').should('exist')
      cy.contains('Yttre undersökning').should('exist')
      cy.contains('Polisanmälan').should('exist')
    })
  })

  it('Skriva ut ett icke ifyllt DB', () => {
    printCertificate(certificateId, internalType)
  })

  it('Radera ett icke ifyllt DB', () => {
    cy.removeCertificateDraft()
    cy.contains(certificateId).should('not.exist')
  })

  it('Fyll i och signera ett DB', () => {
    cy.get('[name="identitetStyrkt"]').type('Körkort')
    cy.get('[id="dodsdatumSakerttrue"]').check({ force: true })
    cy.get('input[placeholder=åååå-mm-dd]').type('2022-11-01')
    cy.get('[data-testid="typeahead-3.1"]').type('Kil')
    cy.get('[id="SJUKHUS"]').check({ force: true })
    cy.get('[id="barnfalse"]').should('be.checked')
    cy.get('#explosivImplantatfalse').check({ force: true })
    cy.get('#JA').check({ force: true })
    cy.get('#polisanmalanfalse').check({ force: true })

    cy.contains('Utkastet är sparat').should('be.visible')
    cy.contains('Klart att signera').should('be.visible')
    cy.contains('Signera och skicka').click()
    cy.contains('Intyget är skickat till Skatteverket').should('be.visible')
  })
})
