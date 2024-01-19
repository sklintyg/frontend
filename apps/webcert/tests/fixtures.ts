import { test as base } from '@playwright/test'
import { fakeCareProvider, fakeResourceLink, fakeUnit, fakeUser } from '../src/faker'
import { ResourceLinkType } from '../src/types'
import { links } from './mocks/links'

export const test = base.extend({
  page: async ({ page }, use) => {
    await page.route('**/*/api/user', async (route) => {
      const unit = fakeUnit({ unitId: 'FAKE_UNIT-1234', unitName: 'Medicincentrum' })
      await route.fulfill({
        json: {
          user: fakeUser({
            hsaId: 'FAKE_HSAID-1234',
            name: `Vince läkare`,
            role: 'Läkare',
            loggedInUnit: unit,
            loggedInCareUnit: unit,
            loggedInCareProvider: unit,
            preferences: {},
            protectedPerson: false,
            careProviders: [fakeCareProvider({ id: unit.unitId, name: unit.unitName })],
          }),
          links: [
            fakeResourceLink({ type: ResourceLinkType.ACCESS_SEARCH_CREATE_PAGE, name: 'Sök / skriv intyg' }),
            fakeResourceLink({ type: ResourceLinkType.ACCESS_DRAFT_LIST, name: 'Ej signerade utkast' }),
            fakeResourceLink({ type: ResourceLinkType.ACCESS_SIGNED_CERTIFICATES_LIST, name: 'Signerade intyg' }),
            fakeResourceLink({ type: ResourceLinkType.ACCESS_UNHANDLED_CERTIFICATES, name: 'Ej hanterade ärenden' }),
            fakeResourceLink({ type: ResourceLinkType.LOG_OUT, name: 'Logga ut' }),
            fakeResourceLink({ type: ResourceLinkType.CHANGE_UNIT, name: 'Byt vårdenhet' }),
            fakeResourceLink({ type: ResourceLinkType.NAVIGATE_BACK_BUTTON, name: 'Tillbaka' }),
          ],
        },
      })
    })

    await page.route('**/*/api/configuration/links', async (route) => {
      await route.fulfill({
        json: links,
      })
    })

    await page.route('**/*/api/configuration', async (route) => {
      await route.fulfill({
        json: {
          ppHost: 'https://wc2.wc.localtest.me/',
          version: '7.2.0.33',
          banners: [],
          sakerhetstjanstIdpUrl: 'https://idp.ineratest.org:443/saml',
          cgiFunktionstjansterIdpUrl: 'https://m00-mg-local.testidp.funktionstjanster.se/samlv2/idp/metadata/0/30',
        },
      })
    })

    await page.route('**/*/api/user/statistics', async (route) => {
      await route.fulfill({
        json: {
          nbrOfDraftsOnSelectedUnit: 0,
          nbrOfUnhandledQuestionsOnSelectedUnit: 0,
          totalDraftsAndUnhandledQuestionsOnOtherUnits: 0,
          unitStatistics: {
            'FAKE_UNIT-1234': {
              draftsOnUnit: 0,
              questionsOnUnit: 0,
              draftsOnSubUnits: 0,
              questionsOnSubUnits: 0,
            },
          },
        },
      })
    })

    await page.route('**/*/api/session-auth-check/ping', async (route) => {
      await route.fulfill({
        json: { hasSession: true, secondsUntilExpire: 1770, authenticated: true },
      })
    })

    await page.route('**/*/api/anvandare/logout/cancel', async (route) => {
      route.fulfill()
    })

    use(page)
  },
})

export { expect } from '@playwright/test'
