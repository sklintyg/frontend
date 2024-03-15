import { fakeRadioBooleanElement, fakeShowValidation } from '../../faker'
import { getValidationResults } from './getValidationResults'

it('Should return validation result from element', () => {
  const element = fakeRadioBooleanElement({ id: 'elementId', value: { id: 'valueId' }, validation: [fakeShowValidation()] })

  const result = getValidationResults(element, element.elementId)

  expect(result).toMatchObject([
    {
      element: {
        id: 'elementId',
        value: {
          id: 'valueId',
        },
      },
      validation: {
        type: 'SHOW_VALIDATION',
      },
    },
  ])
})

it('Should return empty array from missing element', () => {
  const element = fakeRadioBooleanElement({ id: 'elementId', value: { id: 'valueId' }, validation: [] })

  const result = getValidationResults(element, element.otherID)

  expect(result).toMatchObject([])
})
