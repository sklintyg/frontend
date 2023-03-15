/* eslint-disable promise/always-return */
/* eslint-disable promise/catch-or-return */
import { getDoctor } from '../../../../fixtures/getDoctor'
import { getUnit } from '../../../../fixtures/getUnit'
import { createCertificate } from '../../../../helpers/createCertificate'
import { fakeLogin } from '../../../../helpers/fakeLogin'
import { getCertificateInfo } from '../../../../helpers/getCertificateInfo'
import { printCertificate } from '../../../../helpers/printCertificate'

const { name, internalType, versions } = getCertificateInfo('db')

describe(`Signerat ${name} intyg`, () => {
  const unit = getUnit('AlfaVC')
  const doctor = getDoctor('Alja')
  let certificateId: string

  beforeEach(() => {
    createCertificate({
      certificateType: internalType,
      certificateTypeVersion: versions.at(-1),
      status: 'SIGNED',
      fillType: 'MINIMAL',
      patientId: '192504289253', // Charlie Olsson
      personId: doctor.hsaId,
      unitId: unit.enhetId,
    }).then((data) => {
      certificateId = data.body.certificateId
      fakeLogin(doctor, unit)
      cy.visit(`/certificate/${certificateId}`)
    })
  })

  it(`Ersätt ett signerat DB`, () => {
    cy.contains('Ersätt').click()
    cy.get('.ic-modal')
      .contains('button', 'Ersätt')
      .click()
    cy.get('[type="checkbox"]').check({ force: true })
    cy.contains('Gå vidare').click()
    cy.contains('Signera och skicka').click()
  })

  it(`Skriv ut ett signerat DB`, () => {
    printCertificate(certificateId, internalType)
  })

  it(`Makulera ett signerat DB`, () => {
    cy.contains('Makulera').click()
    cy.get('.ic-modal')
      .contains('button', 'Makulera')
      .click()
    cy.contains('Intyget är makulerat').should('exist')
  })
})
