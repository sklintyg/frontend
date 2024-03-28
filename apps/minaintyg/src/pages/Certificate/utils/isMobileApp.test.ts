import { isMobileApp } from './isMobileApp'

it('Should return false when not on mobile app', () => {
  expect(isMobileApp()).toBe(false)
})

it('Should return true when user-agen includes "1177-appen"', () => {
  vi.stubGlobal('navigator', {
    userAgent:
      'Mozilla/5.0 (Linux; Android 9; SM-A530F Build/PPR1.180610.011; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/86.0.4240.110 Mobile Safari/537.36 1177-appen_1.0.6_Android_9.0',
  })
  expect(isMobileApp()).toBe(true)
  vi.unstubAllGlobals()
})
