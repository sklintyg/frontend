import { getDoctor } from '../../../../fixtures/getDoctor'
import { getUnit } from '../../../../fixtures/getUnit'
import { createCertificate } from '../../../../helpers/createCertificate'
import { deleteCertificate } from '../../../../helpers/deleteCertificate'
import { deleteCertificateEvents } from '../../../../helpers/deleteCertificateEvents'
import { fakeLogin } from '../../../../helpers/fakeLogin'
import { getCertificateInfo } from '../../../../helpers/getCertificateInfo'
import { printCertificate } from '../../../../helpers/printCertificate'

const { name, internalType, versions, type } = getCertificateInfo('ag7804')

describe(`Tomt ${name} intyg`, () => {
  const unit = getUnit('AlfaVC')
  const doctor = getDoctor('Alja')
  const patientId = '194011306125' // Athena React Andersson
  let certificateId: string

  beforeEach(() => {
    createCertificate({
      certificateType: internalType,
      certificateTypeVersion: versions.at(-1),
      status: 'LOCKED',
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

  afterEach(() => {
    deleteCertificate(certificateId)
    deleteCertificateEvents(certificateId)
  })

  it(`Skriva ut ett låst ${type} utkast`, () => {
    printCertificate(certificateId, internalType)
  })

  it(`Makulerar ett låst ${type} utkast`, () => {
    cy.voidCertificateDraft()
    expect(cy.contains('Utkastet är makulerat'))
  })

  it(`Kopiera ett låst ${type} utkast så att det går att signera`, () => {
    cy.copyCertificateDraft()
    cy.contains(certificateId).should('not.exist')
    cy.signCertificate()
  })

  it(`Ett ${type} låst utkast ska  inte kunna editeras`, () => {
    cy.get('[data-testid="textarea-25"]').should('be.disabled')
    cy.contains('Utkastet är låst').should('exist')
  })
})
