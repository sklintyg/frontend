/* eslint-disable promise/always-return */
/* eslint-disable promise/catch-or-return */
import { getDoctor } from '../../../../fixtures/getDoctor'
import { getUnit } from '../../../../fixtures/getUnit'
import { createCertificate } from '../../../../helpers/createCertificate'
import { fakeLogin } from '../../../../helpers/fakeLogin'
import { getCertificateInfo } from '../../../../helpers/getCertificateInfo'
import { printCertificate } from '../../../../helpers/printCertificate'

const { name, internalType, versions, type } = getCertificateInfo('af00213')

describe(`Minimalt ${name} intyg`, () => {
  const unit = getUnit('AlfaVC')
  const doctor = getDoctor('Alja')
  let certificateId: string

  beforeEach(() => {
    createCertificate({
      certificateType: internalType,
      certificateTypeVersion: versions.at(-1),
      status: 'UNSIGNED',
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

  it(`Skapar en minimalt ifylld ${type} och skickar den till AF`, () => {
    cy.signAndSendCertificate()
    cy.contains('Intyget är skickat till Arbetsförmedlingen')
    cy.contains('Intyget är tillgängligt för patienten')
  })

  it(`Raderar ett ifylld ${type}`, () => {
    cy.removeCertificateDraft()
    cy.contains(certificateId).should('not.exist')
  })

  it('Skriva ut ett signerat AF20013 intyg', () => {
    cy.signAndSendCertificate()
    printCertificate(certificateId, internalType)
  })

  it(`Ersätta ett ${type} intyg`, () => {
    cy.signAndSendCertificate()
    cy.replaceCertificate()
    cy.contains(certificateId).should('not.exist')
  })

  it(`Makulerar ett ifyllt ${type} intyg`, () => {
    cy.signAndSendCertificate()
    cy.voidCertificate()
    cy.contains(certificateId).should('not.exist')
  })
})
