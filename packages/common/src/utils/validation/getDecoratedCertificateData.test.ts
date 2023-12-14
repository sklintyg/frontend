import {
  fakeCategoryElement,
  fakeCertificateConfig,
  fakeCertificateMetaData,
  fakeCertificateValue,
  fakeCheckboxMultipleCodeElement,
  fakeDisableSubElementValidation,
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
  ValueCodeList,
  ValueText,
} from '../../types'
import { getDecoratedCertificateData } from './getDecoratedCertificateData'

describe('mandatory', () => {
  it('Should set mandatory to true on boolean element if empty', () => {
    const { data, metadata, links } = getCertificate()

    expect(getDecoratedCertificateData(data, metadata, links)['1.1'].mandatory).toBe(true)
  })

  it('Should set mandatory to true on boolean element if undefined', () => {
    const { data, metadata, links } = getCertificate()
    const booleanValue: ValueBoolean = data['1.1'].value as ValueBoolean

    booleanValue.selected = undefined

    expect(getDecoratedCertificateData(data, metadata, links)['1.1'].mandatory).toBe(true)
  })

  it('Should set mandatory to false on boolean element if it is true', () => {
    const { data, metadata, links } = getCertificate()
    const booleanValue: ValueBoolean = data['1.1'].value as ValueBoolean
    booleanValue.selected = true

    expect(getDecoratedCertificateData(data, metadata, links)['1.1'].mandatory).toBe(false)
  })

  it('Should set mandatory to false on boolean element if it is false', () => {
    const { data, metadata, links } = getCertificate()
    const booleanValue: ValueBoolean = data['1.1'].value as ValueBoolean
    booleanValue.selected = false

    expect(getDecoratedCertificateData(data, metadata, links)['1.1'].mandatory).toBe(false)
  })
})

describe('visibility', () => {
  it('Should set visible to false on boolean element if empty', () => {
    const { data, metadata, links } = getCertificate()

    expect(getDecoratedCertificateData(data, metadata, links)['1.2'].visible).toBe(false)
  })

  it('Should set visible to false on boolean element if undefined', () => {
    const { data, metadata, links } = getCertificate()
    const booleanValue: ValueBoolean = data['1.1'].value as ValueBoolean
    // Test when selected is undefined when arriving from backend.
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    booleanValue.selected = undefined

    expect(getDecoratedCertificateData(data, metadata, links)['1.2'].visible).toBe(false)
  })

  it('Should set visible to true on boolean element if it is true', () => {
    const { data, metadata, links } = getCertificate()
    const booleanValue: ValueBoolean = data['1.1'].value as ValueBoolean
    booleanValue.selected = true

    expect(getDecoratedCertificateData(data, metadata, links)['1.2'].visible).toBe(true)
  })

  it('Should set visible to false on boolean element if it is false', () => {
    const { data, metadata, links } = getCertificate()
    const booleanValue: ValueBoolean = data['1.1'].value as ValueBoolean
    booleanValue.selected = false

    expect(getDecoratedCertificateData(data, metadata, links)['1.2'].visible).toBe(false)
  })

  it('Should set visible to false if show rule not valid, even if hide rule is not valid', () => {
    const { data, metadata, links } = getCertificate()
    const booleanValue: ValueBoolean = data['1.1'].value as ValueBoolean
    booleanValue.selected = false

    expect(getDecoratedCertificateData(data, metadata, links)['1.3'].visible).toBe(false)
  })

  it('Should set visible to true if show rule valid, even if hide rule is not valid', () => {
    const { data, metadata, links } = getCertificate()
    const booleanValue: ValueBoolean = data['1.1'].value as ValueBoolean
    booleanValue.selected = false

    data['1.2'].visible = true // Set it visible as default
    data['1.2'].validation = [] // Clear the validations so they don't affect this test.
    const textValue: ValueText = data['1.2'].value as ValueText
    textValue.text = 'A little text'

    expect(getDecoratedCertificateData(data, metadata, links)['1.3'].visible).toBe(true)
  })

  it('Should set visible to false if hide rule valid, even if show rule is valid', () => {
    const { data, metadata, links } = getCertificate()
    const booleanValue: ValueBoolean = data['1.1'].value as ValueBoolean
    booleanValue.selected = true

    const textValue: ValueText = data['1.2'].value as ValueText
    textValue.text = 'A little text'

    expect(getDecoratedCertificateData(data, metadata, links)['1.3'].visible).toBe(false)
  })
})

it('Should set highlight if validation is true', () => {
  const { data, metadata, links } = getCertificate()
  const booleanValue: ValueBoolean = data['1.1'].value as ValueBoolean
  booleanValue.selected = true

  expect(getDecoratedCertificateData(data, metadata, links)['1.1'].style).toBe(CertificateDataElementStyleEnum.HIGHLIGHTED)
})

it('Should unstyle element if validation is false', () => {
  const { data, metadata, links } = getCertificate()
  const booleanValue: ValueBoolean = data['1.1'].value as ValueBoolean
  booleanValue.selected = false

  expect(getDecoratedCertificateData(data, metadata, links)['1.1'].style).toBe(CertificateDataElementStyleEnum.NORMAL)
})

describe('Intialize values for autoFill validation', () => {
  const { data, metadata, links } = getCertificate()

  it('Should autoFill value if validation is true', () => {
    const booleanValue: ValueBoolean = data['1.1'].value as ValueBoolean
    booleanValue.selected = true

    expect((getDecoratedCertificateData(data, metadata, links)['1.2'].value as ValueText).text).toBe('Detta är autoifyllt!')
  })

  it('Should not autoFill value if validation is false', () => {
    const booleanValue: ValueBoolean = data['1.1'].value as ValueBoolean
    booleanValue.selected = true

    expect((getDecoratedCertificateData(data, metadata, links)['1.3'].value as ValueText).text).toBe(null)
  })
})

describe('Intialize values when certificate is not UNSIGNED', () => {
  const { data, metadata, links } = getCertificate()

  it('Should set all data elements as disabled when certificate is LOCKED but still validate rules', () => {
    const booleanValue: ValueBoolean = data['1.1'].value as ValueBoolean
    booleanValue.selected = true

    metadata.status = CertificateStatus.LOCKED
    const result = getDecoratedCertificateData(data, metadata, links)

    expect(result['1.1'].disabled).toBe(true)
    expect(result['1.1'].visible).toBe(true)
    expect(result['1.2'].disabled).toBe(true)
    expect(result['1.2'].visible).toBe(true)
    expect(result['1.3'].disabled).toBe(true)
    expect(result['1.3'].visible).toBe(false)
  })

  it('Should set all data elements as disabled when certificate is LOCKED_REVOKED but still validate rules', () => {
    const result = getDecoratedCertificateData(
      {
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
      fakeCertificateMetaData({ status: CertificateStatus.LOCKED_REVOKED }),
      []
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
      {
        ...fakeRadioBooleanElement({ id: '1.1', readOnly: false, visible: undefined }),
        ...fakeTextFieldElement({ id: '1.2', readOnly: false, visible: true }),
      },
      fakeCertificateMetaData({ status: CertificateStatus.SIGNED }),
      []
    )

    expect(result['1.1'].readOnly).toBe(true)
    expect(result['1.2'].readOnly).toBe(true)
    expect(result['1.1'].visible).toBe(true)
    expect(result['1.2'].visible).toBe(true)
  })

  it('Should set all data elements as readOnly when certificate is REVOKED', () => {
    const result = getDecoratedCertificateData(
      {
        ...fakeRadioBooleanElement({ id: '1.1', readOnly: false, visible: undefined }),
        ...fakeTextFieldElement({ id: '1.2', readOnly: false, visible: true }),
      },
      fakeCertificateMetaData({ status: CertificateStatus.REVOKED }),
      []
    )

    expect(result['1.1'].readOnly).toBe(true)
    expect(result['1.2'].readOnly).toBe(true)
    expect(result['1.1'].visible).toBe(true)
    expect(result['1.2'].visible).toBe(true)
  })
})

it('Should disable categories if no edit link', () => {
  const result = getDecoratedCertificateData(
    {
      ...fakeCategoryElement({ id: 'categoryId', disabled: false }),
    },
    fakeCertificateMetaData(),
    []
  )

  expect(result.categoryId.disabled).toBe(true)
})

it('Should not disable category if there is an edit link', () => {
  const result = getDecoratedCertificateData(
    {
      ...fakeCategoryElement({ id: 'categoryId', disabled: false }),
    },
    fakeCertificateMetaData(),
    [
      fakeResourceLink({
        type: ResourceLinkType.EDIT_CERTIFICATE,
        enabled: false,
      }),
    ]
  )

  expect(result.categoryId.disabled).toBe(false)
})

describe('getDisabledSubElements', () => {
  const validation = [
    fakeDisableSubElementValidation({
      questionId: '40',
      expression: 'exists(ARBETSTRANING) || exists(ARBETSANPASSNING)',
      id: ['EJ_AKTUELLT'],
    }),
    fakeDisableSubElementValidation({
      questionId: '40',
      expression: 'exists(EJ_AKTUELLT)',
      id: ['ARBETSTRANING', 'ARBETSANPASSNING'],
    }),
  ]

  const config = fakeCertificateConfig.checkboxMultipleCodes({
    list: [
      {
        id: 'EJ_AKTUELLT',
        disabled: false,
      },
      {
        id: 'ARBETSTRANING',
        disabled: false,
      },
      {
        id: 'ARBETSANPASSNING',
        disabled: false,
      },
    ],
  })

  it('Should disable EJ_AKTUELLT when value has ARBETSANPASSNING', () => {
    const result = getDecoratedCertificateData(
      fakeCheckboxMultipleCodeElement({
        id: '40',
        validation,
        config,
        value: { list: [fakeCertificateValue.code({ id: 'ARBETSANPASSNING', code: 'ARBETSANPASSNING' })] },
      }),
      fakeCertificateMetaData(),
      []
    )
    expect((result['40'].config as ConfigUeCheckboxMultipleCodes).list.at(0)).toMatchObject({ disabled: true })
    expect((result['40'].config as ConfigUeCheckboxMultipleCodes).list.at(1)).toMatchObject({ disabled: false })
    expect((result['40'].config as ConfigUeCheckboxMultipleCodes).list.at(2)).toMatchObject({ disabled: false })
    expect((result['40'].value as ValueCodeList).list.length).toBe(1)
  })

  it('Should disable ARBETSTRANING and ARBETSANPASSNING when value has EJ_AKTUELLT', () => {
    const result = getDecoratedCertificateData(
      fakeCheckboxMultipleCodeElement({
        id: '40',
        validation,
        config,
        value: { list: [fakeCertificateValue.code({ id: 'EJ_AKTUELLT', code: 'EJ_AKTUELLT' })] },
      }),
      fakeCertificateMetaData(),
      []
    )
    expect((result['40'].config as ConfigUeCheckboxMultipleCodes).list.at(0)).toMatchObject({ disabled: false })
    expect((result['40'].config as ConfigUeCheckboxMultipleCodes).list.at(1)).toMatchObject({ disabled: true })
    expect((result['40'].config as ConfigUeCheckboxMultipleCodes).list.at(2)).toMatchObject({ disabled: true })
    expect((result['40'].value as ValueCodeList).list.length).toBe(1)
  })

  it('Should remove conflicting values', () => {
    const result = getDecoratedCertificateData(
      fakeCheckboxMultipleCodeElement({
        id: '40',
        validation,
        config,
        value: {
          list: [
            fakeCertificateValue.code({ id: 'EJ_AKTUELLT', code: 'EJ_AKTUELLT' }),
            fakeCertificateValue.code({ id: 'ARBETSANPASSNING', code: 'ARBETSANPASSNING' }),
          ],
        },
      }),
      fakeCertificateMetaData(),
      []
    )
    expect((result['40'].value as ValueCodeList).list.length).toBe(0)
  })
})
