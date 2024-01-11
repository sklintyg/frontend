import { expect, it } from 'vitest'
import { useInputStyle } from './useInputStyle'

it('Should return correct standard styling', () => {
  expect(useInputStyle({}).includes('bg-secondary-95 border-accent-40')).toBe(true)
})

it('Should return correct error styling', () => {
  expect(useInputStyle({ error: true }).includes('bg-error-99 border-error-40')).toBe(true)
})

it('Should return correct disabled styling', () => {
  expect(useInputStyle({ disabled: true }).includes('bg-white border-neutral-40')).toBe(true)
})

it('Should return correct bright styling', () => {
  expect(useInputStyle({ bright: true }).includes('bg-white border-accent-40')).toBe(true)
})
