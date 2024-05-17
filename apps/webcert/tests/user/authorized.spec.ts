import { expect, test } from '../fixtures'
import { setupUser } from '../mocks/user'

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
    test.beforeEach(async ({ page }) => setupUser(page, { role }))

    if (role.includes('Vårdadministratör')) {
      test(`redirect to "Ej hanterade ärenden" for ${role}`, async ({ page }) => {
        await page.goto('/')

        await page.waitForURL('**/*/list/unhandledcertificates')
        await expect(page.getByRole('heading', { name: 'Ej hanterade ärenden' })).toBeVisible()
      })
    } else {
      test(`redirect to "Sök / skriv intyg" for ${role}`, async ({ page }) => {
        await page.goto('/')

        await page.waitForURL('**/*/search')
        await expect(page.getByRole('heading', { name: 'Patientens personnummer eller samordningsnummer' })).toBeVisible()
      })
    }

    if (role === 'Privatläkare') {
      test('do not display care provider name', async ({ page }) => {
        await page.goto('/')
        await expect(page.getByText('Hälsa - Medicincentrum')).toBeHidden()
        await expect(page.getByText('Medicincentrum')).toBeVisible()
      })
    } else {
      test('display care provider name', async ({ page }) => {
        await page.goto('/')
        await expect(page.getByText('Hälsa - Medicincentrum')).toBeVisible()
      })
    }
  })
}

test('session expired', async ({ page }) => {
  await page.route('**/*/api/session-auth-check/ping', async (route) => {
    await route.fulfill({
      json: { hasSession: true, secondsUntilExpire: 0, authenticated: false },
    })
  })

  await page.goto('/')

  await expect(page.getByText('Du är utloggad')).toBeVisible()
  await expect(page.getByText('Du har blivit utloggad från')).toBeVisible()

  await expect(page.locator('nav').filter({ hasText: 'Sök / skriv intygEj hanterade' })).toBeHidden()
  await expect(page.getByRole('banner').locator('div').first()).toBeEmpty()
})
