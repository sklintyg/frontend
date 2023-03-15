/* eslint-disable promise/always-return */
/* eslint-disable promise/catch-or-return */
import { getDoctor } from '../../fixtures/getDoctor'
import { getUnit } from '../../fixtures/getUnit'
import { createCertificate } from '../../helpers/createCertificate'
import { fakeLogin } from '../../helpers/fakeLogin'
import { getCertificateInfo } from '../../helpers/getCertificateInfo'
import { printCertificate } from '../../helpers/printCertificate'

const certificateType = getCertificateInfo('af00213')

describe(`Tomt ${certificateType.name} intyg`, () => {
  const unit = getUnit('AlfaVC')
  const doctor = getDoctor('Alja')
  let certificateId: string

  beforeEach(() => {
    cy.log(JSON.stringify(certificateType))
    createCertificate({
      certificateType: certificateType.internalType,
      certificateTypeVersion: certificateType.versions.at(-1),
      status: 'UNSIGNED',
      fillType: 'EMPTY',
      patientId: '191212121212',
      personId: doctor.hsaId,
      unitId: unit.enhetsId,
    }).then((data) => {
      certificateId = data.body.certificateId
    })
  })

  it('Ett icke ifylld AF00213 går ej att signera och skicka till AF', () => {
    fakeLogin(doctor, unit)
    cy.visit(`/certificate/${certificateId}`)
    cy.contains('Obligatoriska uppgifter saknas').should('exist')
    cy.get('button')
      .contains('Signera och skicka')
      .click()

    cy.get('.iu-pt-400').within(() => {
      cy.contains('Utkastet saknar uppgifter i följande avsnitt:').should('exist')
      cy.contains('Funktionsnedsättning').should('exist')
      cy.contains('Utredning och behandling').should('exist')
      cy.contains('Arbetets påverkan på sjukdom/skada').should('exist')
    })
  })

  it('Det är möjligt att radera ett icke ifylld AF00213', () => {
    fakeLogin(doctor, unit)
    cy.visit(`/certificate/${certificateId}`)
    cy.removeCertificate()
    cy.contains(certificateId).should('not.exist')
  })

  it('Skriva ut ett icke ifyllt AF00213', () => {
    fakeLogin(doctor, unit)
    cy.visit(`/certificate/${certificateId}`)
    printCertificate(certificateId, certificateType.internalType)
  })
})
