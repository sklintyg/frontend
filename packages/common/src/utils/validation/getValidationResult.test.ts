import { fakeRadioBooleanElement, fakeShowValidation } from '../faker'
import { getValidationResult } from './getValidationResult'

it('Should return true for passed validation', () => {
  const result = getValidationResult(
    fakeShowValidation({ questionId: 'elementId', expression: 'valueId' }),
    fakeRadioBooleanElement({ id: 'elementId', value: { id: 'valueId', selected: true } })
  )

  expect(result).toBe(true)
})

it('Should return false for missing element', () => {
  const result = getValidationResult(
    fakeShowValidation({ questionId: 'wrongElementId', expression: 'valueId' }),
    fakeRadioBooleanElement({ id: 'elementId', value: { id: 'valueId', selected: true } })
  )

  expect(result).toBe(false)
})

it('Should return false for hidden element', () => {
  const result = getValidationResult(
    fakeShowValidation({ questionId: 'elementId', expression: 'valueId' }),
    fakeRadioBooleanElement({ id: 'elementId', visible: false, value: { id: 'valueId', selected: true } })
  )

  expect(result).toBe(false)
})

it('Should return false for missing expression', () => {
  const result = getValidationResult(
    fakeShowValidation({ questionId: 'elementId', expression: undefined }),
    fakeRadioBooleanElement({ id: 'elementId', value: { id: 'valueId', selected: true } })
  )

  expect(result).toBe(false)
})

it('Should return false for missing value', () => {
  const result = getValidationResult(
    fakeShowValidation({ questionId: 'elementId', expression: 'valueId' }),
    fakeRadioBooleanElement({ id: 'elementId', value: { id: 'valueId', selected: undefined } })
  )

  expect(result).toBe(false)
})

describe('Recursive', () => {
  describe('OR', () => {
    it('Should return result from validation questions', () => {
      const result = getValidationResult(
        fakeShowValidation({
          questions: [
            fakeShowValidation({ questionId: 'elementId', expression: 'valueId' }),
            fakeShowValidation({ questionId: 'elementId', expression: 'someOtherValueId' }),
          ],
          expressionType: 'OR',
        }),
        fakeRadioBooleanElement({ id: 'elementId', value: { id: 'valueId', selected: true } })
      )

      expect(result).toBe(true)
    })

    it('Should still return true when any validation is false', () => {
      const result = getValidationResult(
        fakeShowValidation({
          questions: [
            fakeShowValidation({ questionId: 'elementId', expression: 'valueId' }),
            fakeShowValidation({ questionId: 'anotherElementId', expression: 'valueId' }),
          ],
          expressionType: 'OR',
        }),
        fakeRadioBooleanElement({ id: 'elementId', value: { id: 'valueId', selected: true } })
      )

      expect(result).toBe(true)
    })
  })

  describe('AND', () => {
    it('Should return true when all validations are true', () => {
      const result = getValidationResult(
        fakeShowValidation({
          questions: [
            fakeShowValidation({ questionId: 'elementId', expression: 'valueId' }),
            fakeShowValidation({ questionId: 'elementId', expression: 'valueId' }),
          ],
          expressionType: 'AND',
        }),
        fakeRadioBooleanElement({ id: 'elementId', value: { id: 'valueId', selected: true } })
      )

      expect(result).toBe(true)
    })

    it('Should return false when any validation is false', () => {
      const result = getValidationResult(
        fakeShowValidation({
          questions: [
            fakeShowValidation({ questionId: 'elementId', expression: 'valueId' }),
            fakeShowValidation({ questionId: 'anotherElementId', expression: 'valueId' }),
          ],
          expressionType: 'AND',
        }),
        fakeRadioBooleanElement({ id: 'elementId', value: { id: 'valueId', selected: true } })
      )

      expect(result).toBe(false)
    })
  })
})
