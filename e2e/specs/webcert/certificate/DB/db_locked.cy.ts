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
      status: 'LOCKED',
      fillType: 'EMPTY',
      patientId: '192504289253', // Charlie Olsson
      personId: doctor.hsaId,
      unitId: unit.enhetId,
    }).then((data) => {
      certificateId = data.body.certificateId
      fakeLogin(doctor, unit)
      cy.visit(`/certificate/${certificateId}`)
    })
  })

  it(`Ett låst DB går ej att signera`, () => {
    cy.contains('Utkastet är låst').should('be.visible')
  })

  it(`Skriva ut ett låst DB`, () => {
    printCertificate(certificateId, internalType)
  })

  it(`Makulera ett låst DB`, () => {
    cy.contains('Makulera').click()
    cy.get('.ic-modal')
      .contains('button', 'Makulera')
      .click()
    cy.contains('Utkastet är makulerat').should('exist')
  })
})
