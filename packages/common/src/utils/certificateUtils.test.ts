import { CertificateDataValueType, ValueDateRange } from './../types/certificate'
import { getCertificate } from './test/certificateTestUtil'
import { ValueBoolean, ValueText } from '../types/certificate'
import { getCertificateToSave } from './certificateUtils'

describe('Clean certificate before saving', () => {
  const certificate = getCertificate()

  it('Should clear boolean value for element that is not visible', () => {
    const booleanValue = certificate.data['1.1'].value as ValueBoolean
    booleanValue.selected = true
    certificate.data['1.1'].visible = false

    const clearedCertificate = getCertificateToSave(certificate)

    expect(clearedCertificate.data['1.1'].value).toBeNull()
  })

  it('Should not clear boolean value for element that is visible', () => {
    const booleanValue = certificate.data['1.1'].value as ValueBoolean
    booleanValue.selected = true
    certificate.data['1.1'].visible = true

    const clearedCertificate = getCertificateToSave(certificate)

    expect((clearedCertificate.data['1.1'].value as ValueBoolean).selected).toEqual(true)
  })

  it('Clean text value for element that is not visible', () => {
    const textValue = certificate.data['1.2'].value as ValueText
    textValue.text = 'Has text value'
    certificate.data['1.2'].visible = false

    const clearedCertificate = getCertificateToSave(certificate)

    expect(clearedCertificate.data['1.2'].value).toBeNull()
  })

  it('Clean text value for element that is not visible', () => {
    const textValue = certificate.data['1.2'].value as ValueText
    textValue.text = 'Has text value'
    certificate.data['1.2'].visible = true

    const clearedCertificate = getCertificateToSave(certificate)

    expect((clearedCertificate.data['1.2'].value as ValueText).text).toEqual('Has text value')
  })
})
