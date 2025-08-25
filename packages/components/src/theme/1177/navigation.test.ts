import { getNavigation, getNavigationItem, getNavigationItemUrl, getSettingsUrl } from './navigation'

it('Should return list of items', () => {
  expect(getNavigation()).toHaveLength(8)
})

it('Should return specific item', () => {
  expect(getNavigationItem('Start')).toMatchObject({
    id: 1,
    isAgentModeSupported: true,
    name: 'Start',
    url: {
      acc: 'https://e-tjanster.at.1177.se/mvk/',
      prod: 'https://e-tjanster.1177.se/mvk/',
      sys: 'https://e-tjanster.st.1177.se/mvk/start.xhtml',
    },
  })
})

it.each([
  ['development', 'https://e-tjanster.st.1177.se/mvk/start.xhtml'],
  ['staging', 'https://e-tjanster.at.1177.se/mvk/'],
  ['production', 'https://e-tjanster.1177.se/mvk/'],
])('Should return item url on mode %s', (mode, url) => {
  expect(
    getNavigationItemUrl(
      {
        id: 1,
        isAgentModeSupported: true,
        name: 'Start',
        url: {
          acc: 'https://e-tjanster.at.1177.se/mvk/',
          prod: 'https://e-tjanster.1177.se/mvk/',
          sys: 'https://e-tjanster.st.1177.se/mvk/start.xhtml',
        },
      },
      mode
    )
  ).toBe(url)
})

it.each([
  ['development', 'https://e-tjanster.st.1177.se/mvk/settings.xhtml'],
  ['staging', 'https://e-tjanster.at.1177.se/mvk/settings.xhtml'],
  ['production', 'https://e-tjanster.1177.se/mvk/settings.xhtml'],
])('Should return settings url for mode %s', (mode, url) => {
  expect(getSettingsUrl(mode)).toBe(url)
})
