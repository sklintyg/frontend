import { getDoctor } from '../../../../fixtures/getDoctor'
import { getUnit } from '../../../../fixtures/getUnit'
import { createCertificate } from '../../../../helpers/createCertificate'
import { deleteCertificate } from '../../../../helpers/deleteCertificate'
import { deleteCertificateEvents } from '../../../../helpers/deleteCertificateEvents'
import { fakeLogin } from '../../../../helpers/fakeLogin'
import { getCertificateInfo } from '../../../../helpers/getCertificateInfo'
import { printCertificate } from '../../../../helpers/printCertificate'

const { name, internalType, versions, type } = getCertificateInfo('lisjp')

describe(`Minimal ${name} intyg`, () => {
  const unit = getUnit('AlfaVC')
  const doctor = getDoctor('Alja')
  let certificateId: string

  beforeEach(() => {
    createCertificate({
      certificateType: internalType,
      certificateTypeVersion: versions.at(-1),
      status: 'UNSIGNED',
      fillType: 'MINIMAL',
      patientId: '194011306125', // Athena React Andersson
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

  it(`Makulerar ett signerat ${type} intyg`, () => {
    cy.signCertificate()
    cy.voidCertificate()
    cy.contains(certificateId).should('not.exist')
  })

  it(`Skicka ett signerat ${type} intyg`, () => {
    cy.signCertificate()
    cy.get('button').contains('Skicka till Försäkringskassan').click()
    cy.get('.ic-button-group > :nth-child(1) > .ic-button').click() // detta behöver jag hjälp med

    cy.contains('Intyget är tillgängligt för patienten').should('exist')
  })

  it(`Skriva ut ett signerat ${type} intyg`, () => {
    cy.signCertificate()
    printCertificate(certificateId, internalType)
  })

  it(`Förnya ett ${type} intyg`, () => {
    cy.signCertificate()
    cy.renewCertificate()
    cy.get('button').contains('Skicka till Försäkringskassan').should('not.exist')
    cy.contains(certificateId).should('not.exist')
  })

  it(`Ersätta ett ${type} intyg`, () => {
    cy.signCertificate()
    cy.replaceCertificate()
    cy.get('button').contains('Skicka till Försäkringskassan').should('not.exist')
    cy.contains(certificateId).should('not.exist')
  })

  it('Skapar en minimalt ifylld FK7804 och skickar den till FK', () => {
    cy.signCertificate()
    cy.sendCertificateToFK()
    cy.contains('Intyget är skickat till Försäkringskassan')
    cy.contains('Intyget är tillgängligt för patienten')
  })

  it(`Det är möjligt att radera ett ifyllt ${type}`, () => {
    cy.removeCertificate()
    cy.contains(certificateId).should('not.exist')
  })

  it(`Det går inte att signera ett ${type} utkast som inte innehåller alla obligatoriska fält`, () => {
    cy.contains('Klart att signera').should('exist')
    cy.get('label').contains('100 procent').click()
    cy.contains('Obligatoriska uppgifter saknas').should('exist')
    cy.contains('Klart att signera').should('not.exist')
  })
})
