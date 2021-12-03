import {
  addFunctionBlocker,
  FunctionBlocker,
  generateFunctionBlocker,
  isFunctionBlocked,
  removeFunctionBlocker,
  toggleFunctionBlocker,
} from './functionBlockerUtils'

let functionBlockers: FunctionBlocker[]

describe('functionBlockerUtils', () => {
  beforeEach(() => {
    functionBlockers = []
  })

  describe('generateFunctionBlocker', () => {
    it('returns functionBlocker with generated id', () => {
      const functionBlocker = generateFunctionBlocker()

      expect(functionBlocker.id).not.toBeNull()
    })
  })

  describe('addFunctionBlocker', () => {
    it('shall add functionBlocker to array', () => {
      const functionBlocker = generateFunctionBlocker()

      functionBlockers = addFunctionBlocker(functionBlockers, functionBlocker)

      expect(functionBlockers.length).toBe(1)
      expect(functionBlockers[0].id).toBe(functionBlocker.id)
    })
  })

  describe('removeFunctionBlocker', () => {
    it('shall remove functionBlocker from array', () => {
      const functionBlocker = generateFunctionBlocker()
      functionBlockers = addFunctionBlocker(functionBlockers, functionBlocker)

      functionBlockers = removeFunctionBlocker(functionBlockers, functionBlocker)

      expect(functionBlockers.length).toBe(0)
    })

    it('shall remove correct functionBlocker from array if multiple entries', () => {
      const functionBlocker = generateFunctionBlocker()
      const functionBlocker_2 = generateFunctionBlocker()
      functionBlockers = addFunctionBlocker(functionBlockers, functionBlocker)
      functionBlockers = addFunctionBlocker(functionBlockers, functionBlocker_2)

      functionBlockers = removeFunctionBlocker(functionBlockers, functionBlocker)

      expect(functionBlockers.length).toBe(1)
      expect(functionBlockers[0].id).toBe(functionBlocker_2.id)
    })
  })

  describe('toggleFunctionBlocker', () => {
    it('shall add functionBlocker if no previous functionBlocker with same id exists', () => {
      const functionBlocker = generateFunctionBlocker()

      functionBlockers = toggleFunctionBlocker(functionBlockers, functionBlocker)

      expect(functionBlockers.length).toBe(1)
      expect(functionBlockers[0].id).toBe(functionBlocker.id)
    })

    it('shall remove functionBlocker if it already exists', () => {
      const functionBlocker = generateFunctionBlocker()
      functionBlockers = toggleFunctionBlocker(functionBlockers, functionBlocker)

      functionBlockers = toggleFunctionBlocker(functionBlockers, functionBlocker)

      expect(functionBlockers.length).toBe(0)
    })

    it('shall remove correct functionBlocker if multiple entries exist', () => {
      const functionBlockerToRemove = generateFunctionBlocker()
      functionBlockers = toggleFunctionBlocker(functionBlockers, functionBlockerToRemove)
      const functionBlocker_2 = generateFunctionBlocker()
      functionBlockers = toggleFunctionBlocker(functionBlockers, functionBlocker_2)

      functionBlockers = toggleFunctionBlocker(functionBlockers, functionBlockerToRemove)

      expect(functionBlockers.length).toBe(1)
      expect(functionBlockers[0].id).toBe(functionBlocker_2.id)
    })
  })

  describe('isFunctionBlocked', () => {
    it('shall return true if functionBlocker exists', () => {
      const functionBlocker = generateFunctionBlocker()
      functionBlockers = addFunctionBlocker(functionBlockers, functionBlocker)

      const actual = isFunctionBlocked(functionBlockers)

      expect(actual).toBe(true)
    })

    it('shall return false if no functionBlocker exists', () => {
      const actual = isFunctionBlocked([])

      expect(actual).toBe(false)
    })
  })
})
