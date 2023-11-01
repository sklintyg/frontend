import {
  fakeCategoryElement,
  fakeCertificate,
  fakeCertificateMetaData,
  fakeRadioBooleanElement,
  fakeResourceLink,
  fakeTextFieldElement,
  getCertificate,
} from '..'
import {
  CertificateDataElementStyleEnum,
  CertificateDataValidationType,
  CertificateStatus,
  ConfigUeCheckboxMultipleCodes,
  ResourceLinkType,
  ValueBoolean,
  ValueText,
} from '../../types'
import { getDecoratedCertificateData } from './getDecoratedCertificateData'

it('Should set mandatory to true on boolean element if empty', () => {
  const certificate = getCertificate()

  expect(getDecoratedCertificateData(certificate)['1.1'].mandatory).toBe(true)
})

it('Should set mandatory to true on boolean element if undefined', () => {
  const certificate = getCertificate()
  const booleanValue: ValueBoolean = certificate.data['1.1'].value as ValueBoolean

  booleanValue.selected = undefined

  expect(getDecoratedCertificateData(certificate)['1.1'].mandatory).toBe(true)
})

it('Should set mandatory to false on boolean element if it is true', () => {
  const certificate = getCertificate()
  const booleanValue: ValueBoolean = certificate.data['1.1'].value as ValueBoolean
  booleanValue.selected = true

  expect(getDecoratedCertificateData(certificate)['1.1'].mandatory).toBe(false)
})

it('Should set mandatory to false on boolean element if it is false', () => {
  const certificate = getCertificate()
  const booleanValue: ValueBoolean = certificate.data['1.1'].value as ValueBoolean
  booleanValue.selected = false

  expect(getDecoratedCertificateData(certificate)['1.1'].mandatory).toBe(false)
})

it('Should set visible to false on boolean element if empty', () => {
  const certificate = getCertificate()

  expect(getDecoratedCertificateData(certificate)['1.2'].visible).toBe(false)
})

it('Should set visible to false on boolean element if undefined', () => {
  const certificate = getCertificate()
  const booleanValue: ValueBoolean = certificate.data['1.1'].value as ValueBoolean
  // Test when selected is undefined when arriving from backend.
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  booleanValue.selected = undefined

  expect(getDecoratedCertificateData(certificate)['1.2'].visible).toBe(false)
})

it('Should set visible to true on boolean element if it is true', () => {
  const certificate = getCertificate()
  const booleanValue: ValueBoolean = certificate.data['1.1'].value as ValueBoolean
  booleanValue.selected = true

  expect(getDecoratedCertificateData(certificate)['1.2'].visible).toBe(true)
})

it('Should set visible to false on boolean element if it is false', () => {
  const certificate = getCertificate()
  const booleanValue: ValueBoolean = certificate.data['1.1'].value as ValueBoolean
  booleanValue.selected = false

  expect(getDecoratedCertificateData(certificate)['1.2'].visible).toBe(false)
})

it('Should set visible to false if show rule not valid, even if hide rule is not valid', () => {
  const certificate = getCertificate()
  const booleanValue: ValueBoolean = certificate.data['1.1'].value as ValueBoolean
  booleanValue.selected = false

  expect(getDecoratedCertificateData(certificate)['1.3'].visible).toBe(false)
})

it('Should set visible to true if show rule valid, even if hide rule is not valid', () => {
  const certificate = getCertificate()
  const booleanValue: ValueBoolean = certificate.data['1.1'].value as ValueBoolean
  booleanValue.selected = false

  certificate.data['1.2'].visible = true // Set it visible as default
  certificate.data['1.2'].validation = [] // Clear the validations so they don't affect this test.
  const textValue: ValueText = certificate.data['1.2'].value as ValueText
  textValue.text = 'A little text'

  expect(getDecoratedCertificateData(certificate)['1.3'].visible).toBe(true)
})

it('Should set visible to false if hide rule valid, even if show rule is valid', () => {
  const certificate = getCertificate()
  const booleanValue: ValueBoolean = certificate.data['1.1'].value as ValueBoolean
  booleanValue.selected = true

  const textValue: ValueText = certificate.data['1.2'].value as ValueText
  textValue.text = 'A little text'

  expect(getDecoratedCertificateData(certificate)['1.3'].visible).toBe(false)
})

it('Should set highlight if validation is true', () => {
  const certificate = getCertificate()
  const booleanValue: ValueBoolean = certificate.data['1.1'].value as ValueBoolean
  booleanValue.selected = true

  expect(getDecoratedCertificateData(certificate)['1.1'].style).toBe(CertificateDataElementStyleEnum.HIGHLIGHTED)
})

it('Should unstyle element if validation is false', () => {
  const certificate = getCertificate()
  const booleanValue: ValueBoolean = certificate.data['1.1'].value as ValueBoolean
  booleanValue.selected = false

  expect(getDecoratedCertificateData(certificate)['1.1'].style).toBe(CertificateDataElementStyleEnum.NORMAL)
})

it('Should disable child element if validation is true', () => {
  const certificate = getCertificate()

  expect((getDecoratedCertificateData(certificate)['28'].config as ConfigUeCheckboxMultipleCodes).list[1].disabled).toBeTruthy()
})

it('Should enable child element if validation is false', () => {
  const certificate = getCertificate()
  expect((getDecoratedCertificateData(certificate)['28'].config as ConfigUeCheckboxMultipleCodes).list[0].disabled).toBeFalsy()
})

describe('Intialize values for autoFill validation', () => {
  const cert = getCertificate()

  it('Should autoFill value if validation is true', () => {
    const booleanValue: ValueBoolean = cert.data['1.1'].value as ValueBoolean
    booleanValue.selected = true

    expect((getDecoratedCertificateData(cert)['1.2'].value as ValueText).text).toBe('Detta är autoifyllt!')
  })

  it('Should not autoFill value if validation is false', () => {
    const booleanValue: ValueBoolean = cert.data['1.1'].value as ValueBoolean
    booleanValue.selected = true

    expect((getDecoratedCertificateData(cert)['1.3'].value as ValueText).text).toBe(null)
  })
})

describe('Intialize values when certificate is not UNSIGNED', () => {
  const cert = getCertificate()

  it('Should set all data elements as disabled when certificate is LOCKED but still validate rules', () => {
    const booleanValue: ValueBoolean = cert.data['1.1'].value as ValueBoolean
    booleanValue.selected = true

    cert.metadata.status = CertificateStatus.LOCKED
    const result = getDecoratedCertificateData(cert)

    expect(result['1.1'].disabled).toBe(true)
    expect(result['1.1'].visible).toBe(true)
    expect(result['1.2'].disabled).toBe(true)
    expect(result['1.2'].visible).toBe(true)
    expect(result['1.3'].disabled).toBe(true)
    expect(result['1.3'].visible).toBe(false)
  })

  it('Should set all data elements as disabled when certificate is LOCKED_REVOKED but still validate rules', () => {
    const result = getDecoratedCertificateData(
      fakeCertificate({
        metadata: fakeCertificateMetaData({ status: CertificateStatus.LOCKED_REVOKED }),
        data: {
          ...fakeRadioBooleanElement({ id: '1.1', value: { selected: true, id: 'firstVal' }, visible: undefined }),
          ...fakeTextFieldElement({ id: '1.2', value: { id: 'secondVal' }, visible: true }),
          ...fakeTextFieldElement({
            id: '1.3',
            visible: true,
            validation: [
              {
                type: CertificateDataValidationType.SHOW_VALIDATION,
                questionId: '1.2',
                expression: '$secondVal',
              },
              {
                type: CertificateDataValidationType.HIDE_VALIDATION,
                questionId: '1.1',
                expression: '$firstVal',
              },
            ],
          }),
        },
      })
    )

    expect(result['1.1'].disabled).toBe(true)
    expect(result['1.1'].visible).toBe(true)
    expect(result['1.2'].disabled).toBe(true)
    expect(result['1.2'].visible).toBe(true)
    expect(result['1.3'].disabled).toBe(true)
    expect(result['1.3'].visible).toBe(false)
  })

  it('Should set all data elements as readOnly when certificate is SIGNED', () => {
    const result = getDecoratedCertificateData(
      fakeCertificate({
        metadata: fakeCertificateMetaData({ status: CertificateStatus.SIGNED }),
        data: {
          ...fakeRadioBooleanElement({ id: '1.1', readOnly: false, visible: undefined }),
          ...fakeTextFieldElement({ id: '1.2', readOnly: false, visible: true }),
        },
      })
    )

    expect(result['1.1'].readOnly).toBe(true)
    expect(result['1.2'].readOnly).toBe(true)
    expect(result['1.1'].visible).toBe(true)
    expect(result['1.2'].visible).toBe(true)
  })

  it('Should set all data elements as readOnly when certificate is REVOKED', () => {
    const result = getDecoratedCertificateData(
      fakeCertificate({
        metadata: fakeCertificateMetaData({ status: CertificateStatus.REVOKED }),
        data: {
          ...fakeRadioBooleanElement({ id: '1.1', readOnly: false, visible: undefined }),
          ...fakeTextFieldElement({ id: '1.2', readOnly: false, visible: true }),
        },
      })
    )

    expect(result['1.1'].readOnly).toBe(true)
    expect(result['1.2'].readOnly).toBe(true)
    expect(result['1.1'].visible).toBe(true)
    expect(result['1.2'].visible).toBe(true)
  })
})

it('Should disable categories if no edit link', () => {
  const result = getDecoratedCertificateData(
    fakeCertificate({
      data: {
        ...fakeCategoryElement({ id: 'categoryId', disabled: false }),
      },
      links: [],
    })
  )

  expect(result.categoryId.disabled).toBe(true)
})

it('Should not disable category if there is an edit link', () => {
  const result = getDecoratedCertificateData(
    fakeCertificate({
      data: {
        ...fakeCategoryElement({ id: 'categoryId', disabled: false }),
      },
      links: [
        fakeResourceLink({
          type: ResourceLinkType.EDIT_CERTIFICATE,
          enabled: false,
        }),
      ],
    })
  )

  expect(result.categoryId.disabled).toBe(false)
})
