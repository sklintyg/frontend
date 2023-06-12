import { getDoctor } from '../../../../fixtures/getDoctor'
import { getUnit } from '../../../../fixtures/getUnit'
import { createCertificate } from '../../../../helpers/createCertificate'
import { deleteCertificate } from '../../../../helpers/deleteCertificate'
import { deleteCertificateEvents } from '../../../../helpers/deleteCertificateEvents'
import { fakeLogin } from '../../../../helpers/fakeLogin'
import { getCertificateInfo } from '../../../../helpers/getCertificateInfo'
import { printCertificate } from '../../../../helpers/printCertificate'

const { name, internalType, versions, type } = getCertificateInfo('af00213')

describe(`Tomt ${name} intyg`, () => {
  const unit = getUnit('AlfaVC')
  const doctor = getDoctor('Alja')
  let certificateId: string

  beforeEach(() => {
    createCertificate({
      certificateType: internalType,
      certificateTypeVersion: versions.at(-1),
      status: 'UNSIGNED',
      fillType: 'EMPTY',
      patientId: '191212121212',
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

  it(`Ett icke ifylld ${type} går ej att signera och skicka till AF`, () => {
    cy.contains('Obligatoriska uppgifter saknas').should('exist')
    cy.get('button').contains('Signera och skicka').click()

    cy.get('[data-testid="certificate-validation"]').within(() => {
      cy.contains('Utkastet saknar uppgifter i följande avsnitt:').should('exist')
      cy.contains('Funktionsnedsättning').should('exist')
      cy.contains('Utredning och behandling').should('exist')
      cy.contains('Arbetets påverkan på sjukdom/skada').should('exist')
    })
  })

  it(`Det är möjligt att radera ett icke ifylld ${type}`, () => {
    cy.removeCertificate()
    cy.contains(certificateId).should('not.exist')
  })

  it(`Skriva ut ett icke ifyllt ${type}`, () => {
    printCertificate(certificateId, internalType)
  })
})
