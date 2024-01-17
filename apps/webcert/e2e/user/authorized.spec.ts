import { fakeCareProvider, fakeResourceLink, fakeUnit, fakeUser } from '../../src/faker'
import { ResourceLinkType } from '../../src/types'
import { expect, test } from '../fixtures'

const unit = fakeUnit({ unitId: 'FAKE_UNIT-1234', unitName: 'Medicincentrum' })
const careProvider = fakeUnit({ unitId: 'FAKE_UNIT-1234', unitName: 'Hälsa' })

const question = {
  filters: [],
  title: 'Ej hanterade ärenden',
  description: 'Nedan visas ej hanterade ärenden, kompletteringsbegäran och administrativa frågor, för den eller de enheter du väljer.',
  emptyListText: 'Det finns inga ohanterade ärenden för den enhet eller de enheter du är inloggad på.',
  secondaryTitle: 'Ärenden visas för alla enheter',
  buttonTooltips: {
    RESET_BUTTON: 'Återställ sökfilter för ej hanterade ärenden.',
    OPEN_BUTTON: 'Öppnar intyget och frågan/svaret.',
    SEARCH_BUTTON: 'Sök efter frågor och svar.',
  },
  excludeFilterButtons: false,
  tableHeadings: [],
  shouldUpdateConfigAfterListSearch: true,
}

test.beforeEach(async ({ page }) => {
  await page.route('**/*/api/list/question', async (route) => {
    await route.fulfill({
      json: { list: [], totalCount: 0 },
    })
  })

  await page.route('**/*/api/list/unhandledcertificates', async (route) => {
    await route.fulfill({
      json: { list: [], totalCount: 0 },
    })
  })

  await page.route('**/*/api/list/config/question', async (route) => {
    await route.fulfill({
      json: question,
    })
  })

  await page.route('**/*/api/list/config/question/update', async (route) => {
    await route.fulfill({
      json: question,
    })
  })
})

for (const role of ['Läkare', 'Privatläkare', 'Vårdadministratör']) {
  test.describe(`${role}`, () => {
    test.beforeEach(async ({ page }) => {
      await page.route('**/*/api/user', async (route) => {
        await route.fulfill({
          json: {
            user: fakeUser({
              hsaId: 'FAKE_HSAID-1234',
              name: `Alva ${role}`,
              role,
              loggedInUnit: unit,
              loggedInCareUnit: unit,
              loggedInCareProvider: careProvider,
              preferences: {},
              protectedPerson: false,
              careProviders: [
                fakeCareProvider({ id: careProvider.unitId, name: careProvider.unitName, careUnits: [{ ...unit, units: [] }] }),
              ],
            }),
            links: [
              fakeResourceLink({ type: ResourceLinkType.ACCESS_SEARCH_CREATE_PAGE, name: 'Sök / skriv intyg' }),
              fakeResourceLink({ type: ResourceLinkType.ACCESS_DRAFT_LIST, name: 'Ej signerade utkast' }),
              fakeResourceLink({ type: ResourceLinkType.ACCESS_SIGNED_CERTIFICATES_LIST, name: 'Signerade intyg' }),
              fakeResourceLink({ type: ResourceLinkType.ACCESS_UNHANDLED_CERTIFICATES, name: 'Ej hanterade ärenden' }),
            ],
          },
        })
      })
    })

    if (role.includes('Vårdadministratör')) {
      test(`redirect to "Ej hanterade ärenden" for ${role}`, async ({ page }) => {
        await page.goto('https://wc2.wc.localtest.me/')

        await page.waitForURL('**/*/list/unhandledcertificates')
        await expect(page.getByRole('heading', { name: 'Ej hanterade ärenden' })).toBeVisible()
      })
    } else {
      test(`redirect to "Sök / skriv intyg" for ${role}`, async ({ page }) => {
        await page.goto('https://wc2.wc.localtest.me/')

        await page.waitForURL('**/*/search')
        await expect(page.getByRole('heading', { name: 'Patientens personnummer eller samordningsnummer' })).toBeVisible()
      })
    }

    if (role === 'Privatläkare') {
      test('do not display care provider name', async ({ page }) => {
        await page.goto('https://wc2.wc.localtest.me/')
        await expect(page.getByText('Hälsa - Medicincentrum')).toBeHidden()
        await expect(page.getByText('Medicincentrum')).toBeVisible()
      })
    } else {
      test('display care provider name', async ({ page }) => {
        await page.goto('https://wc2.wc.localtest.me/')
        await expect(page.getByText('Hälsa - Medicincentrum')).toBeVisible()
      })
    }
  })
}
