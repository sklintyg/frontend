import { fakeCertificateValidationError } from './faker'
import { isShowAlways } from './isShowAlways'

it('should return true if validation error is of type OTHER', () => {
  expect(isShowAlways(fakeCertificateValidationError({ type: 'OTHER' }))).toBe(true)
})

it('should return true if validation error is of type INVALID_FORMAT', () => {
  expect(isShowAlways(fakeCertificateValidationError({ type: 'INVALID_FORMAT' }))).toBe(true)
})

it('should return false if validation error is not OTHER or INVALID_FORMAT', () => {
  expect(isShowAlways(fakeCertificateValidationError({ type: 'TEST' }))).toBe(false)
})
