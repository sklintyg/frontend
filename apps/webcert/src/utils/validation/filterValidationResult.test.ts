import { fakeShowValidation, fakeTextAreaElement } from '../../faker'
import type { CertificateDataValidation} from '../../types';
import { CertificateDataValidationType } from '../../types'
import { filterValidationResults } from './filterValidationResults'
import type { ValidationResult } from './getValidationResults'

const element = fakeTextAreaElement({
  id: 'id',
}).id

describe('Priority', () => {
  it('HIDE has priority over show when HIDE is true', () => {
    const hideValidation: ValidationResult = {
      element,
      validation: {
        type: CertificateDataValidationType.HIDE_VALIDATION,
        questionId: 'id',
      },
      result: true,
    }

    const showValidation: ValidationResult = {
      element,
      validation: {
        type: CertificateDataValidationType.SHOW_VALIDATION,
        questionId: 'id',
      },
      result: false,
    }

    const result = filterValidationResults([hideValidation, showValidation])

    expect(result).toHaveLength(1)
    expect(result).toMatchObject([hideValidation])
  })

  it('SHOW validation has priority over HIDE when HIDE === false', () => {
    const hideValidation: ValidationResult = {
      element,
      validation: {
        type: CertificateDataValidationType.HIDE_VALIDATION,
        questionId: 'id',
      },
      result: false,
    }

    const showValidation: ValidationResult = {
      element,
      validation: {
        type: CertificateDataValidationType.SHOW_VALIDATION,
        questionId: 'id',
      },
      result: true,
    }

    const result = filterValidationResults([hideValidation, showValidation])

    expect(result).toHaveLength(1)
    expect(result).toMatchObject([showValidation])
  })
})

it.each<CertificateDataValidation>([
  {
    type: CertificateDataValidationType.SHOW_VALIDATION,
    questionId: 'id',
  },
  {
    type: CertificateDataValidationType.HIDE_VALIDATION,
    questionId: 'id',
  },
  {
    type: CertificateDataValidationType.DISABLE_VALIDATION,
    questionId: 'id',
    id: ['123'],
  },
  {
    type: CertificateDataValidationType.DISABLE_SUB_ELEMENT_VALIDATION,
    questionId: 'id',
    id: ['123'],
  },
])('Should merge same $type validation rules', (validation) => {
  const validationResult: ValidationResult = {
    element,
    validation,
    result: true,
  }

  const result = filterValidationResults([validationResult, validationResult, validationResult])

  expect(result).toHaveLength(1)
  expect(result).toMatchObject([validationResult])
})

describe('Same rule override', () => {
  it('Should override rule where validation id was equal', () => {
    const showValidationFirst: ValidationResult = {
      element,
      validation: {
        type: CertificateDataValidationType.SHOW_VALIDATION,
        questionId: 'firstId',
        id: '12345',
      },
      result: true,
    }
    const showValidationSecond: ValidationResult = {
      element,
      validation: {
        type: CertificateDataValidationType.SHOW_VALIDATION,
        questionId: 'secondId',
        id: '12345',
      },
      result: true,
    }

    const result = filterValidationResults([showValidationFirst, showValidationSecond])

    expect(result).toHaveLength(1)
    expect(result).toMatchObject([showValidationSecond])
  })

  it('Should override rule where validation id was equal but different type', () => {
    const showValidationFirst: ValidationResult = {
      element,
      validation: {
        type: CertificateDataValidationType.SHOW_VALIDATION,
        questionId: 'firstId',
        id: ['12345'],
      },
      result: true,
    }
    const showValidationSecond: ValidationResult = {
      element,
      validation: {
        type: CertificateDataValidationType.SHOW_VALIDATION,
        questionId: 'secondId',
        id: '12345',
      },
      result: true,
    }

    const result = filterValidationResults([showValidationFirst, showValidationSecond])

    expect(result).toHaveLength(1)
    expect(result).toMatchObject([showValidationSecond])
  })

  it('Should override rule where validation id was previous undefined', () => {
    const showValidationThird: ValidationResult = {
      element,
      validation: {
        type: CertificateDataValidationType.SHOW_VALIDATION,
        questionId: 'thirdId',
        id: undefined,
      },
      result: true,
    }
    const showValidationFourth: ValidationResult = {
      element,
      validation: {
        type: CertificateDataValidationType.SHOW_VALIDATION,
        questionId: 'fourthId',
        id: '123123',
      },
      result: true,
    }

    const result = filterValidationResults([showValidationThird, showValidationFourth])

    expect(result).toHaveLength(1)
    expect(result).toMatchObject([showValidationFourth])
  })

  it('Same type validations should validate as OR expression', () => {
    const result = filterValidationResults([
      {
        element,
        validation: fakeShowValidation({ id: '123123', questionId: '1' }),
        result: true,
      },
      {
        element,
        validation: fakeShowValidation({ id: '123123', questionId: '1' }),
        result: false,
      },
    ])

    expect(result).toHaveLength(1)
    expect(result).toMatchObject([
      {
        element,
        validation: fakeShowValidation({ id: '123123', questionId: '1' }),
        result: true,
      },
    ])
  })
})
