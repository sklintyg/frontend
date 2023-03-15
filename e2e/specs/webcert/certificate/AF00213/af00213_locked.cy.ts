/* eslint-disable promise/always-return */
/* eslint-disable promise/catch-or-return */
import { getDoctor } from '../../../../fixtures/getDoctor'
import { getUnit } from '../../../../fixtures/getUnit'
import { createCertificate } from '../../../../helpers/createCertificate'
import { fakeLogin } from '../../../../helpers/fakeLogin'
import { getCertificateInfo } from '../../../../helpers/getCertificateInfo'
import { printCertificate } from '../../../../helpers/printCertificate'

const { name, internalType, versions, type } = getCertificateInfo('af00213')

describe(`Locked ${name} intyg`, () => {
  const unit = getUnit('AlfaVC')
  const doctor = getDoctor('Alja')
  let certificateId: string

  beforeEach(() => {
    createCertificate({
      certificateType: internalType,
      certificateTypeVersion: versions.at(-1),
      status: 'LOCKED',
      fillType: 'MINIMAL',
      patientId: '191212121212',
      personId: doctor.hsaId,
      unitId: unit.enhetId,
    }).then((data) => {
      certificateId = data.body.certificateId
      fakeLogin(doctor, unit)
      cy.visit(`/certificate/${certificateId}`)
    })
  })

  it(`Skriva ut ett låst ${type} utkast`, () => {
    printCertificate(certificateId, internalType)
  })

  it(`Makulerar ett låst ${type} utkast`, () => {
    cy.voidCertificateDraft()
    expect(cy.contains('Utkastet är makulerat'))
  })

  it(`Kopiera ett låst ${type} utkast så att det går att signera och skicka`, () => {
    cy.copyCertificateDraft()
    cy.contains(certificateId).should('not.exist')
    cy.signAndSendCertificate()
  })

  it(`Ett ${type} låst utkast ska  inte kunna editeras`, () => {
    cy.get('.ic-textarea').should('be.disabled')
    cy.contains('Utkastet är låst').should('exist')
  })
})
