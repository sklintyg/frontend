import type { FunctionDisabler } from './functionDisablerUtils'
import {
  addFunctionDisabler,
  generateFunctionDisabler,
  isFunctionDisabled,
  removeFunctionDisabler,
  toggleFunctionDisabler,
} from './functionDisablerUtils'

let functionDisablers: FunctionDisabler[]

describe('functionDisablerUtils', () => {
  beforeEach(() => {
    functionDisablers = []
  })

  describe('generateFunctionDisabler', () => {
    it('returns functionDisabler with generated id', () => {
      const functionDisabler = generateFunctionDisabler()

      expect(functionDisabler.id).not.toBeNull()
    })
  })

  describe('addFunctionDisabler', () => {
    it('shall add functionDisabler to array', () => {
      const functionDisabler = generateFunctionDisabler()

      functionDisablers = addFunctionDisabler(functionDisablers, functionDisabler)

      expect(functionDisablers.length).toBe(1)
      expect(functionDisablers[0].id).toBe(functionDisabler.id)
    })
  })

  describe('removeFunctionDisabler', () => {
    it('shall remove functionDisabler from array', () => {
      const functionDisabler = generateFunctionDisabler()
      functionDisablers = addFunctionDisabler(functionDisablers, functionDisabler)

      functionDisablers = removeFunctionDisabler(functionDisablers, functionDisabler)

      expect(functionDisablers.length).toBe(0)
    })

    it('shall remove correct functionDisabler from array if multiple entries', () => {
      const functionDisabler = generateFunctionDisabler()
      const functionDisablerSecond = generateFunctionDisabler()
      functionDisablers = addFunctionDisabler(functionDisablers, functionDisabler)
      functionDisablers = addFunctionDisabler(functionDisablers, functionDisablerSecond)

      functionDisablers = removeFunctionDisabler(functionDisablers, functionDisabler)

      expect(functionDisablers.length).toBe(1)
      expect(functionDisablers[0].id).toBe(functionDisablerSecond.id)
    })
  })

  describe('toggleFunctionDisabler', () => {
    it('shall add functionDisabler if no previous functionDisabler with same id exists', () => {
      const functionDisabler = generateFunctionDisabler()

      functionDisablers = toggleFunctionDisabler(functionDisablers, functionDisabler)

      expect(functionDisablers.length).toBe(1)
      expect(functionDisablers[0].id).toBe(functionDisabler.id)
    })

    it('shall remove functionDisabler if it already exists', () => {
      const functionDisabler = generateFunctionDisabler()
      functionDisablers = toggleFunctionDisabler(functionDisablers, functionDisabler)

      functionDisablers = toggleFunctionDisabler(functionDisablers, functionDisabler)

      expect(functionDisablers.length).toBe(0)
    })

    it('shall remove correct functionDisabler if multiple entries exist', () => {
      const functionDisablerToRemove = generateFunctionDisabler()
      functionDisablers = toggleFunctionDisabler(functionDisablers, functionDisablerToRemove)
      const functionDisablerSecond = generateFunctionDisabler()
      functionDisablers = toggleFunctionDisabler(functionDisablers, functionDisablerSecond)

      functionDisablers = toggleFunctionDisabler(functionDisablers, functionDisablerToRemove)

      expect(functionDisablers.length).toBe(1)
      expect(functionDisablers[0].id).toBe(functionDisablerSecond.id)
    })
  })

  describe('isFunctionDisabled', () => {
    it('shall return true if functionDisabler exists', () => {
      const functionDisabler = generateFunctionDisabler()
      functionDisablers = addFunctionDisabler(functionDisablers, functionDisabler)

      const actual = isFunctionDisabled(functionDisablers)

      expect(actual).toBe(true)
    })

    it('shall return false if no functionDisabler exists', () => {
      const actual = isFunctionDisabled([])

      expect(actual).toBe(false)
    })
  })
})
