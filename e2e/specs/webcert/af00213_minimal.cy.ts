/* eslint-disable promise/always-return */
/* eslint-disable promise/catch-or-return */
import { getDoctor } from '../../fixtures/getDoctor'
import { getUnit } from '../../fixtures/getUnit'
import { createCertificate } from '../../helpers/createCertificate'
import { fakeLogin } from '../../helpers/fakeLogin'
import { getCertificateInfo } from '../../helpers/getCertificateInfo'

const certificateType = getCertificateInfo('af00213')

describe(`Minimalt ${certificateType.name} intyg`, () => {
  const unit = getUnit('AlfaVC')
  const doctor = getDoctor('Alja')
  let certificateId: string

  beforeEach(() => {
    cy.log(JSON.stringify(certificateType))
    createCertificate({
      certificateType: certificateType.internalType,
      certificateTypeVersion: certificateType.versions.at(-1),
      status: 'UNSIGNED',
      fillType: 'MINIMAL',
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
  })
})
