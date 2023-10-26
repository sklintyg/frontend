import { resolveNavigationUrl } from './resolveNavigationUrl'

const url = {
  prod: 'production',
  acc: 'staging',
  sys: 'development',
}

it.each(Object.entries(url))('Should resolve link for %s when in %s mode', (key, mode) => {
  import.meta.env.MODE = mode
  expect(resolveNavigationUrl(url)).toBe(mode)
})

it('Should fall back to production link', () => {
  import.meta.env.MODE = 'x'
  expect(resolveNavigationUrl(url)).toBe('production')
})
