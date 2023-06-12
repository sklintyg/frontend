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
      fillType: 'EMPTY',
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

  it(`Ett icke ifylld ${type} går ej att signera och skicka till FK`, () => {
    cy.contains('Obligatoriska uppgifter saknas').should('exist')
    cy.contains('Signera intyget').click()

    cy.contains('Utkastet saknar uppgifter i följande avsnitt:').should('exist') // Nedan också
    cy.contains('Grund för medicinskt underlag').should('exist')
    cy.contains('Sysselsättning').should('exist')
    cy.contains('Diagnos').should('exist')
    cy.contains('Sjukdomens konsekvenser för patienten').should('exist')
    cy.contains('Bedömning').should('exist')
    cy.contains('Åtgärder').should('exist')

    cy.get('button').contains('Skicka till Försäkringskassan').should('not.exist')
  })

  it(`Det är möjligt att raderar ett icke ifyllt ${type}`, () => {
    cy.removeCertificateDraft()
    cy.contains(certificateId).should('not.exist')
  })

  it(`Skriva ut ett icke ifyllt ${type}`, () => {
    printCertificate(certificateId, internalType)
  })
})
