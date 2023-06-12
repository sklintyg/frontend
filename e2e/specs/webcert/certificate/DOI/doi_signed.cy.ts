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

const { name, internalType, versions } = getCertificateInfo('doi')

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
      status: 'SIGNED',
      fillType: 'MINIMAL',
      patientId,
      personId: doctor.hsaId,
      unitId: unit.enhetId,
    }).then((data) => {
      certificateId = data.body.certificateId
      fakeLogin(doctor, unit)
      cy.visit(`/certificate/${certificateId}`)
    })
  })

  it('Ersätt ett signerat intyg', () => {
    cy.contains('Ersätt').click()
    cy.get('.ic-modal').contains('button', 'Ersätt').click()

    // Kontrollera namn och personnummer modal
    cy.contains('Signera och skicka').click()
  })

  it('Skriv ut ett signerat DOI', () => {
    printCertificate(certificateId, internalType)
  })

  it('Makulera ett signerat DOI', () => {
    cy.contains('Makulera').click()
    cy.get('.ic-modal').contains('button', 'Makulera').click()

    cy.contains('Intyget är makulerat').should('exist')
  })
})
