import {
  fakeAutoFillValidation,
  fakeCategoryElement,
  fakeCertificate,
  fakeCertificateConfig,
  fakeCertificateDataElement,
  fakeCertificateMetaData,
  fakeCertificateValue,
  fakeCheckboxMultipleCodeElement,
  fakeDisableSubElementValidation,
  fakeHideValidation,
  fakeHighlightValidation,
  fakeMandatoryValidation,
  fakeRadioBooleanElement,
  fakeRadioMultipleCodeElement,
  fakeResourceLink,
  fakeShowValidation,
  fakeTextAreaElement,
  fakeTextFieldElement,
} from '../../faker'
import type {
  ConfigUeCheckboxMultipleCodes,
  ValueCodeList,
  ValueText} from '../../types';
import {
  CertificateDataValidationType,
  CertificateDataValueType,
  CertificateStatus,
  ResourceLinkType
} from '../../types'
import { getDecoratedCertificateData } from './getDecoratedCertificateData'

describe('mandatory', () => {
  it('Should set mandatory to true on boolean element if empty', () => {
    const { data, metadata, links } = fakeCertificate({
      data: {
        ...fakeRadioBooleanElement({
          id: '1.1',
          value: { id: 'foo', selected: null },
          validation: [
            fakeMandatoryValidation({
              questionId: '1.1',
              expression: 'exists(foo)',
            }),
          ],
        }),
      },
    })

    expect(getDecoratedCertificateData(data, metadata, links)['1.1'].mandatory).toBe(true)
  })

  it('Should set mandatory to true on boolean element if undefined', () => {
    const { data, metadata, links } = fakeCertificate({
      data: {
        ...fakeCertificateDataElement({
          id: '1.1',
          config: fakeCertificateConfig.radioBoolean(),
          value: {
            type: CertificateDataValueType.BOOLEAN,
            id: 'foo',
            selected: undefined,
          },
          validation: [
            fakeMandatoryValidation({
              questionId: '1.1',
              expression: 'exists(foo)',
            }),
          ],
        }),
      },
    })

    expect(getDecoratedCertificateData(data, metadata, links)['1.1'].mandatory).toBe(true)
  })

  it('Should set mandatory to false on boolean element if it is true', () => {
    const { data, metadata, links } = fakeCertificate({
      data: {
        ...fakeRadioBooleanElement({
          id: '1.1',
          value: { id: 'foo', selected: true },
          validation: [
            fakeMandatoryValidation({
              questionId: '1.1',
              expression: 'exists(foo)',
            }),
          ],
        }),
      },
    })

    expect(getDecoratedCertificateData(data, metadata, links)['1.1'].mandatory).toBe(false)
  })

  it('Should set mandatory to false on boolean element if it is false', () => {
    const { data, metadata, links } = fakeCertificate({
      data: {
        ...fakeRadioBooleanElement({
          id: '1.1',
          value: { id: 'foo', selected: false },
          validation: [
            fakeMandatoryValidation({
              questionId: '1.1',
              expression: 'exists(foo)',
            }),
          ],
        }),
      },
    })

    expect(getDecoratedCertificateData(data, metadata, links)['1.1'].mandatory).toBe(false)
  })
})

describe('visibility', () => {
  it('Should set visible to false on boolean element if empty', () => {
    const { data, metadata, links } = fakeCertificate({
      data: {
        ...fakeRadioBooleanElement({
          id: '1.1',
          value: { id: 'harFunktionsnedsattning', selected: null },
        }),
        ...fakeTextAreaElement({
          id: '1.2',
          value: { id: 'funktionsnedsattning' },
          validation: [
            fakeShowValidation({
              questionId: '1.1',
              expression: 'harFunktionsnedsattning',
            }),
          ],
        }),
      },
    })

    expect(getDecoratedCertificateData(data, metadata, links)['1.2'].visible).toBe(false)
  })

  it('Should set visible to false on boolean element if undefined', () => {
    const { data, metadata, links } = fakeCertificate({
      data: {
        ...fakeCertificateDataElement({
          id: '1.1',
          config: fakeCertificateConfig.radioBoolean(),
          value: { type: CertificateDataValueType.BOOLEAN, id: 'harFunktionsnedsattning', selected: undefined },
        }),
        ...fakeTextAreaElement({
          id: '1.2',
          value: { id: 'funktionsnedsattning' },
          validation: [
            fakeShowValidation({
              questionId: '1.1',
              expression: 'harFunktionsnedsattning',
            }),
          ],
        }),
      },
    })

    expect(getDecoratedCertificateData(data, metadata, links)['1.2'].visible).toBe(false)
  })

  it('Should set visible to true on boolean element if it is true', () => {
    const { data, metadata, links } = fakeCertificate({
      data: {
        ...fakeRadioBooleanElement({
          id: '1.1',
          value: { id: 'harFunktionsnedsattning', selected: true },
        }),
        ...fakeTextAreaElement({
          id: '1.2',
          value: { id: 'funktionsnedsattning' },
          validation: [
            fakeShowValidation({
              questionId: '1.1',
              expression: 'harFunktionsnedsattning',
            }),
          ],
        }),
      },
    })

    expect(getDecoratedCertificateData(data, metadata, links)['1.2'].visible).toBe(true)
  })

  it('Should set visible to false on boolean element if it is false', () => {
    const { data, metadata, links } = fakeCertificate({
      data: {
        ...fakeRadioBooleanElement({
          id: '1.1',
          value: { id: 'harFunktionsnedsattning', selected: false },
        }),
        ...fakeTextAreaElement({
          id: '1.2',
          value: { id: 'funktionsnedsattning' },
          validation: [
            fakeShowValidation({
              questionId: '1.1',
              expression: 'harFunktionsnedsattning',
            }),
          ],
        }),
      },
    })

    expect(getDecoratedCertificateData(data, metadata, links)['1.2'].visible).toBe(false)
  })

  it('Should set visible to false if show rule not valid, even if hide rule is not valid', () => {
    const { data, metadata, links } = fakeCertificate({
      data: {
        ...fakeRadioBooleanElement({
          id: '1.1',
          value: { id: 'harFunktionsnedsattning', selected: false },
        }),
        ...fakeTextAreaElement({
          id: '1.2',
          value: { id: 'funktionsnedsattning', text: null },
        }),
        ...fakeTextAreaElement({
          id: '1.3',
          validation: [
            fakeShowValidation({
              questionId: '1.2',
              expression: 'funktionsnedsattning',
            }),
            fakeHideValidation({
              questionId: '1.1',
              expression: 'harFunktionsnedsattning',
            }),
          ],
        }),
      },
    })

    expect(getDecoratedCertificateData(data, metadata, links)['1.3'].visible).toBe(false)
  })

  it('Should set visible to true if show rule valid, even if hide rule is not valid', () => {
    const { data, metadata, links } = fakeCertificate({
      data: {
        ...fakeRadioBooleanElement({
          id: '1.1',
          value: { id: 'harFunktionsnedsattning', selected: false },
        }),
        ...fakeTextAreaElement({
          id: '1.2',
          visible: true,
          value: { id: 'funktionsnedsattning', text: 'Some text' },
        }),
        ...fakeTextAreaElement({
          id: '1.3',
          validation: [
            fakeShowValidation({
              questionId: '1.2',
              expression: 'funktionsnedsattning',
            }),
            fakeHideValidation({
              questionId: '1.1',
              expression: 'harFunktionsnedsattning',
            }),
          ],
        }),
      },
    })

    expect(getDecoratedCertificateData(data, metadata, links)['1.3'].visible).toBe(true)
  })

  it('Should set visible to false if hide rule valid, even if show rule is valid', () => {
    const { data, metadata, links } = fakeCertificate({
      data: {
        ...fakeRadioBooleanElement({
          id: '1.1',
          value: { id: 'harFunktionsnedsattning', selected: true },
        }),
        ...fakeTextAreaElement({
          id: '1.2',
          value: { id: 'funktionsnedsattning', text: 'A little text' },
        }),
        ...fakeTextAreaElement({
          id: '1.3',
          validation: [
            fakeShowValidation({
              questionId: '1.2',
              expression: 'funktionsnedsattning',
            }),
            fakeHideValidation({
              questionId: '1.1',
              expression: 'harFunktionsnedsattning',
            }),
          ],
        }),
      },
    })

    expect(getDecoratedCertificateData(data, metadata, links)['1.3'].visible).toBe(false)
  })

  it('Should pre-validate visibility on elements to make sure depending elements gets updated', () => {
    const { data, metadata, links } = fakeCertificate({
      data: {
        ...fakeRadioBooleanElement({ id: '1', value: fakeCertificateValue.boolean({ selected: true, id: 'radio1' }) }),
        ...fakeRadioBooleanElement({
          id: '2',
          visible: false,
          value: fakeCertificateValue.boolean({ selected: true, id: 'radio2' }),
          validation: [fakeShowValidation({ questionId: '1', expression: 'radio1' })],
        }),
        ...fakeRadioBooleanElement({
          id: '3',
          visible: false,
          value: fakeCertificateValue.boolean(),
          validation: [fakeShowValidation({ questionId: '2', expression: 'radio2' })],
        }),
      },
    })

    const result = getDecoratedCertificateData(data, metadata, links)

    expect(result['1'].visible).toBe(true)
    expect(result['2'].visible).toBe(true)
    expect(result['3'].visible).toBe(true)
  })
})

describe('Intialize values for autoFill validation', () => {
  it('Should autoFill value if validation is true', () => {
    const { data, metadata, links } = fakeCertificate({
      data: {
        ...fakeRadioBooleanElement({
          id: '1.1',
          value: { id: 'harFunktionsnedsattning', selected: true },
        }),
        ...fakeTextAreaElement({
          id: '1.2',
          validation: [
            fakeAutoFillValidation({
              questionId: '1.1',
              expression: 'harFunktionsnedsattning',
              fillValue: fakeCertificateValue.text({
                text: 'Detta är autoifyllt!',
              }),
            }),
          ],
        }),
      },
    })

    expect((getDecoratedCertificateData(data, metadata, links)['1.2'].value as ValueText).text).toBe('Detta är autoifyllt!')
  })

  it('Should not autoFill value if validation is false', () => {
    const { data, metadata, links } = fakeCertificate({
      data: {
        ...fakeRadioBooleanElement({
          id: '1.1',
          value: { id: 'harFunktionsnedsattning', selected: true },
        }),
        ...fakeTextAreaElement({
          id: '1.3',
          validation: [
            fakeAutoFillValidation({
              questionId: '1.1',
              expression: '!harFunktionsnedsattning',
              fillValue: fakeCertificateValue.text({
                text: 'Detta skall inte autoifyllas eftersom villkoret är falskt!',
              }),
            }),
          ],
        }),
      },
    })

    expect((getDecoratedCertificateData(data, metadata, links)['1.3'].value as ValueText).text).toBe(null)
  })
})

describe('Intialize values when certificate is not UNSIGNED', () => {
  it('Should set all data elements as disabled when certificate is LOCKED but still validate rules', () => {
    const result = getDecoratedCertificateData(
      {
        ...fakeRadioBooleanElement({ id: '1.1' }),
        ...fakeTextAreaElement({ id: '1.2' }),
        ...fakeTextAreaElement({ id: '1.3' }),
      },
      fakeCertificateMetaData({
        status: CertificateStatus.LOCKED,
      }),
      []
    )

    expect(result['1.1'].disabled).toBe(true)
    expect(result['1.2'].disabled).toBe(true)
    expect(result['1.3'].disabled).toBe(true)
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

describe('highlight', () => {
  it('Should highlight question when expression is true', () => {
    const result = getDecoratedCertificateData(
      fakeRadioMultipleCodeElement({
        id: '100',
        validation: [fakeHighlightValidation({ questionId: '100', expression: '1' })],
      }),
      fakeCertificateMetaData(),
      []
    )

    expect(result['100'].style).toBe('HIGHLIGHTED')
  })

  it('Should not highlight question when expression is false', () => {
    const result = getDecoratedCertificateData(
      fakeRadioMultipleCodeElement({
        id: '100',
        validation: [fakeHighlightValidation({ questionId: '100', expression: '0' })],
      }),
      fakeCertificateMetaData(),
      []
    )

    expect(result['100'].style).toBe('NORMAL')
  })
})
