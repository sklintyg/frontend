import { expect, test } from '../fixtures'
import { question } from '../mocks/config/question'

test.beforeEach(async ({ page }) => {
  await page.route('**/*/api/list/question', async (route) => {
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

test('have correct heading', async ({ page }) => {
  await page.goto('https://wc2.wc.localtest.me/list/unhandledcertificates')

  await expect(page.getByRole('heading', { name: 'Ej hanterade ärenden' })).toBeVisible()
  await expect(page.getByText('Nedan visas ej hanterade ä')).toBeVisible()
})

test('empty page content', async ({ page }) => {
  await page.goto('https://wc2.wc.localtest.me/list/unhandledcertificates')

  await expect(page.getByRole('img', { name: 'Det finns inga resultat i' })).toBeVisible()
  await expect(page.getByText('Det finns inga ohanterade ä')).toBeVisible()
})

test.describe('Menu', () => {
  test('mark "Ej hanterade ärenden" menu item as selected', async ({ page }) => {
    await page.goto('https://wc2.wc.localtest.me/list/unhandledcertificates')

    await expect(page.getByRole('link', { name: 'Ej hanterade ärenden' })).toBeVisible()
    await expect(page.getByRole('link', { name: 'Ej hanterade ärenden' })).toHaveClass(/selected/)
  })

  test('do not mark "Ej signerade utkast" menu item as selected', async ({ page }) => {
    await page.goto('https://wc2.wc.localtest.me/list/unhandledcertificates')

    await expect(page.getByRole('link', { name: 'Ej signerade utkast' })).toBeVisible()
    await expect(page.getByRole('link', { name: 'Ej signerade utkast' })).not.toHaveClass(/selected/)
  })

  test('do not mark "Sök / skriv intyg" menu item as selected', async ({ page }) => {
    await page.goto('https://wc2.wc.localtest.me/list/unhandledcertificates')

    await expect(page.getByRole('link', { name: 'Sök / skriv intyg' })).toBeVisible()
    await expect(page.getByRole('link', { name: 'Sök / skriv intyg' })).not.toHaveClass(/selected/)
  })

  test('do not mark "Signerade intyg" menu item as selected', async ({ page }) => {
    await page.goto('https://wc2.wc.localtest.me/list/draft')

    await expect(page.getByRole('link', { name: 'Signerade intyg' })).toBeVisible()
    await expect(page.getByRole('link', { name: 'Signerade intyg' })).not.toHaveClass(/selected/)
  })
})

test.describe('Failed requests', () => {
  for (const endpoint of ['list/question', 'list/config/question', 'list/config/question/update']) {
    test(`show information on failed ${endpoint} request`, async ({ page }) => {
      await page.route(`**/*/api/${endpoint}`, async (route) => {
        await route.abort()
      })

      await page.goto('https://wc2.wc.localtest.me/list/unhandledcertificates')

      await expect(page.getByText('Sökningen kunde inte utföras.')).toBeVisible()
    })
  }
})

test.describe('Empty table', () => {
  test.beforeEach(async ({ page }) => {
    await page.route('**/*/api/user/statistics', async (route) => {
      await route.fulfill({
        json: {
          nbrOfDraftsOnSelectedUnit: 11,
          nbrOfUnhandledQuestionsOnSelectedUnit: 22,
          totalDraftsAndUnhandledQuestionsOnOtherUnits: 33,
          unitStatistics: {
            'FAKE_UNIT-1234': {
              draftsOnUnit: 1,
              questionsOnUnit: 2,
              draftsOnSubUnits: 3,
              questionsOnSubUnits: 4,
            },
          },
        },
      })
    })
  })

  test('show list filters', async ({ page }) => {
    await page.goto('https://wc2.wc.localtest.me/list/unhandledcertificates')

    await expect(page.getByRole('heading', { name: 'Ärenden visas för alla enheter' })).toBeVisible()
    await expect(page.getByLabel('Enhet')).toBeVisible()
    await expect(page.getByLabel('Vidarebefordrat')).toBeVisible()
    await expect(page.getByLabel('Åtgärd')).toBeVisible()
    await expect(page.getByLabel('Avsändare')).toBeVisible()
    await expect(page.getByLabel('Signerat av')).toBeVisible()

    // Needs proper label fixed.
    await expect(page.getByPlaceholder('ååååmmdd-nnnn')).toBeVisible()
    await expect(page.getByLabel('Från')).toBeVisible()
    await expect(page.getByLabel('till', { exact: true })).toBeVisible()
  })

  test('should have table', async ({ page }) => {
    await page.goto('https://wc2.wc.localtest.me/list/unhandledcertificates')

    await expect(page.getByRole('table', { name: 'Ej hanterade ärenden' })).toBeVisible()
  })

  test('should have table column "Skickat/mottaget"', async ({ page }) => {
    await page.goto('https://wc2.wc.localtest.me/list/unhandledcertificates')

    await expect(page.getByRole('columnheader', { name: 'Skickat/mottaget Byt till att' })).toBeVisible()
  })

  test(`should be possible to sort "Skickat/mottaget"`, async ({ page }) => {
    await page.goto('https://wc2.wc.localtest.me/list/unhandledcertificates')

    await expect(page.getByRole('columnheader', { name: `Skickat/mottaget Byt till att sortera stigande` })).toBeVisible()
    await page.getByRole('columnheader', { name: `Skickat/mottaget Byt till att sortera stigande` }).click()
    await expect(page.getByRole('columnheader', { name: `Skickat/mottaget Byt till att sortera fallande` })).toBeVisible()
  })

  for (const col of ['Åtgärd', 'Avsändare', 'Patient', 'Signerat av', 'Vidarebefordrad']) {
    test(`should have table column "${col}"`, async ({ page }) => {
      await page.goto('https://wc2.wc.localtest.me/list/unhandledcertificates')

      await expect(page.getByRole('columnheader', { name: `${col} Sortera på kolumn` })).toBeVisible()
    })

    test(`should be possible to sort "${col}"`, async ({ page }) => {
      await page.goto('https://wc2.wc.localtest.me/list/unhandledcertificates')

      await page.getByRole('columnheader', { name: `${col} Sortera på kolumn` }).click()
      await expect(page.getByRole('columnheader', { name: `${col} Byt till att sortera fallande` })).toBeVisible()

      await page.getByRole('columnheader', { name: `${col} Byt till att sortera fallande` }).click()
      await expect(page.getByRole('columnheader', { name: `${col} Byt till att sortera stigande` })).toBeVisible()
    })
  }

  test('should have empty table text', async ({ page }) => {
    await page.goto('https://wc2.wc.localtest.me/list/unhandledcertificates')

    await expect(page.getByRole('cell', { name: 'Inga resultat att visa.' })).toBeVisible()
  })
})
