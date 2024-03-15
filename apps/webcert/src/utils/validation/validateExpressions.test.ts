import { fakeCategoryElement, fakeRadioBooleanElement, fakeTextAreaElement } from '../../faker'
import { CertificateDataValidationType } from '../../types'
import { validateExpressions } from './validateExpressions'

const categoryElement = fakeCategoryElement({
  id: 'categoryElementID',
  validation: [
    {
      type: CertificateDataValidationType.SHOW_VALIDATION,
      questionId: 'updatedElementID',
      expression: 'updatedElementValueID',
    },
  ],
}).categoryElementID

const booleanElement = fakeRadioBooleanElement({
  id: 'booleanElementID',
  value: {
    id: 'booleanElementValueID',
    selected: false,
  },
  validation: [
    {
      type: CertificateDataValidationType.SHOW_VALIDATION,
      questionId: 'updatedElementID',
      expression: 'updatedElementValueID',
    },
  ],
}).booleanElementID

const textElement = fakeTextAreaElement({
  id: 'textElementID',
  validation: [
    {
      type: CertificateDataValidationType.SHOW_VALIDATION,
      questionId: 'booleanElementID',
      expression: 'booleanElementValueID',
    },
    {
      type: CertificateDataValidationType.SHOW_VALIDATION,
      questionId: 'updatedElementID',
      expression: 'updatedElementValueID',
    },
  ],
}).textElementID

it('Should validate as false if both show rules are false', () => {
  const updatedElement = fakeRadioBooleanElement({
    id: 'updatedElementID',
    value: {
      id: 'updatedElementValueID',
      selected: null,
    },
  }).updatedElementID

  const validationResults = validateExpressions(
    {
      [updatedElement.id]: updatedElement,
      [categoryElement.id]: categoryElement,
      [booleanElement.id]: booleanElement,
      [textElement.id]: textElement,
    },
    updatedElement
  )

  expect(validationResults.map(({ result }) => result)).toMatchObject([false, false, false])
})

it('Should validate as true if one show rule is true and the other false', () => {
  const updatedElement = fakeRadioBooleanElement({
    id: 'updatedElementID',
    value: {
      id: 'updatedElementValueID',
      selected: true,
    },
  }).updatedElementID

  const validationResults = validateExpressions(
    {
      [updatedElement.id]: updatedElement,
      [categoryElement.id]: categoryElement,
      [booleanElement.id]: booleanElement,
      [textElement.id]: textElement,
    },
    updatedElement
  )

  expect(validationResults.map(({ result }) => result)).toMatchObject([true, true, true])
})

it('Should validate as true if both show rules are true', () => {
  const updatedElement = fakeRadioBooleanElement({
    id: 'updatedElementID',
    value: {
      id: 'updatedElementValueID',
      selected: true,
    },
  }).updatedElementID

  const validationResults = validateExpressions(
    {
      [updatedElement.id]: updatedElement,
      [categoryElement.id]: categoryElement,
      ...fakeRadioBooleanElement({
        id: 'booleanElementID',
        value: {
          id: 'booleanElementValueID',
          selected: true,
        },
        validation: [
          {
            type: CertificateDataValidationType.SHOW_VALIDATION,
            questionId: 'updatedElementID',
            expression: 'updatedElementValueID',
          },
        ],
      }),
      [textElement.id]: textElement,
    },
    updatedElement
  )

  expect(validationResults.map(({ result }) => result)).toMatchObject([true, true, true])
})
