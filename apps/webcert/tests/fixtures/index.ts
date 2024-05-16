import { test as base } from '@playwright/test'
import { fakeCareProvider, fakeResourceLink, fakeUnit, fakeUnitStatistic, fakeUser, fakeUserStatistics } from '../../src/faker'
import { ResourceLinkType } from '../../src/types'
import { links } from '../mocks/links'

export const test = base.extend<{
  routeJson: (path: string, data: unknown) => Promise<void>
}>({
  routeJson: async ({ page }, use) => {
    await use((path: string, data: unknown) =>
      page.route(path, async (route) => {
        await route.fulfill({ json: data })
      })
    )
  },
  page: async ({ page }, use) => {
    const unit = fakeUnit({ unitId: 'FAKE_UNIT-1234', unitName: 'Medicincentrum' })

    await page.route('**/*/api/user', async (route) => {
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
            fakeResourceLink({ type: ResourceLinkType.ACCESS_QUESTION_LIST, name: 'Ej hanterade ärenden' }),
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
          ppHost: '/',
          version: '7.2.0.33',
          banners: [],
          sakerhetstjanstIdpUrl: 'https://idp.ineratest.org:443/saml',
          cgiFunktionstjansterIdpUrl: 'https://m00-mg-local.testidp.funktionstjanster.se/samlv2/idp/metadata/0/30',
        },
      })
    })

    await page.route('**/*/api/user/statistics', async (route) => {
      await route.fulfill({
        json: fakeUserStatistics({
          nbrOfDraftsOnSelectedUnit: 0,
          nbrOfUnhandledQuestionsOnSelectedUnit: 0,
          totalDraftsAndUnhandledQuestionsOnOtherUnits: 0,
          unitStatistics: {
            [unit.unitId]: fakeUnitStatistic({
              draftsOnUnit: 0,
              questionsOnUnit: 0,
              draftsOnSubUnits: 0,
              questionsOnSubUnits: 0,
            }),
          },
        }),
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

    await page.route(`**/*/api/certificate/*/validate`, async (route) => {
      route.fulfill({ json: { validationErrors: [] } })
    })
    await page.route(`**/*/api/certificate/*/events`, async (route) => {
      route.fulfill({ json: { certificateEvents: [] } })
    })

    await page.route(`**/*/api/question/*`, async (route) => {
      route.fulfill({ json: { questions: [] } })
    })
    await page.route(`**/*/api/question/*/complements`, async (route) => {
      route.fulfill({ json: { questions: [] } })
    })

    use(page)
  },
})

export { expect } from '@playwright/test'
