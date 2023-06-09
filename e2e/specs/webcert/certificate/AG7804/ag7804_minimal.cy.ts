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
      status: 'UNSIGNED',
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

  it(`Makulerar ett signerat ${type}-intyg`, () => {
    cy.signCertificate()
    cy.voidCertificate()
    cy.contains(certificateId).should('not.exist')
  })

  it(`Skicka ett signerat ${type}-intyg`, () => {
    cy.signCertificate()
    cy.contains('Intyget är tillgängligt för patienten').should('exist')
  })

  it(`Skriva ut ett signerat ${type}-intyg`, () => {
    cy.signCertificate()
    printCertificate(certificateId, internalType)
  })

  it(`Förnya ett ${type}-intyg`, () => {
    cy.signCertificate()
    cy.renewCertificate()
    cy.get('button').contains('Intyget är tillgängligt för patienten').should('not.exist')
    cy.contains(certificateId).should('not.exist')
  })

  it(`Ersätta ett ${type}-intyg`, () => {
    cy.signCertificate()
    cy.replaceCertificate()
    cy.contains(certificateId).should('not.exist')
  })

  it(`Det är möjligt att raderar ett ifyllt ${type}`, () => {
    cy.removeCertificate()
    cy.contains(certificateId).should('not.exist')
  })

  it(`Det går inte att signera ett ${type} utkast som inte innehåller alla obligatoriska fält`, () => {
    cy.contains('Klart att signera').should('exist')
    cy.get('label').contains('100 procent').click()
    cy.contains('Obligatoriska uppgifter saknas', { timeout: 5000 }).should('exist')
    cy.contains('Klart att signera', { timeout: 5000 }).should('not.exist')
  })
})
