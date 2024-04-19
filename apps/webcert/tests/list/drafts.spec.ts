import { expect, test } from '../fixtures'
import { draft } from '../mocks/config/draft'

test.beforeEach(async ({ page }) => {
  await page.route('**/*/api/list/draft', async (route) => {
    await route.fulfill({
      json: { list: [], totalCount: 0 },
    })
  })

  await page.route('**/*/api/list/config/draft', async (route) => {
    await route.fulfill({
      json: draft,
    })
  })

  await page.route('**/*/api/list/config/draft/update', async (route) => {
    await route.fulfill({
      json: draft,
    })
  })

  await page.goto('/list/draft')
})

test('have correct heading', async ({ page }) => {
  await expect(page.getByRole('heading', { name: 'Ej signerade utkast' })).toBeVisible()
  await expect(page.getByText('Nedan visas alla ej signerade')).toBeVisible()
})

test('empty page content', async ({ page }) => {
  await expect(page.getByRole('img', { name: 'Det finns inga resultat i' })).toBeVisible()
  await expect(page.getByText('Det finns inga ej signerade')).toBeVisible()
})

test.describe('Menu', () => {
  test('do not mark "Ej hanterade ärenden" menu item as selected', async ({ page }) => {
    await expect(page.getByRole('link', { name: 'Ej hanterade ärenden' })).toBeVisible()
    await expect(page.getByRole('link', { name: 'Ej hanterade ärenden' })).not.toHaveClass(/selected/)
  })

  test('mark "Ej signerade utkast" menu item as selected', async ({ page }) => {
    await expect(page.getByRole('link', { name: 'Ej signerade utkast' })).toBeVisible()
    await expect(page.getByRole('link', { name: 'Ej signerade utkast' })).toHaveClass(/selected/)
  })

  test('do not mark "Sök / skriv intyg" menu item as selected', async ({ page }) => {
    await expect(page.getByRole('link', { name: 'Sök / skriv intyg' })).toBeVisible()
    await expect(page.getByRole('link', { name: 'Sök / skriv intyg' })).not.toHaveClass(/selected/)
  })

  test('do not mark "Signerade intyg" menu item as selected', async ({ page }) => {
    await expect(page.getByRole('link', { name: 'Signerade intyg' })).toBeVisible()
    await expect(page.getByRole('link', { name: 'Signerade intyg' })).not.toHaveClass(/selected/)
  })
})

test.describe('Failed requests', () => {
  for (const endpoint of ['list/draft', 'list/config/draft']) {
    test(`show information on failed ${endpoint} request`, async ({ page }) => {
      await page.route(`**/*/api/${endpoint}`, async (route) => {
        await route.abort()
      })
      await page.goto('/list/draft')

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

    await page.goto('/list/draft')
  })

  test('show list filters', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Intyg visas för Alfa' })).toBeVisible()
    await expect(page.getByLabel('Vidarebefordrat')).toBeVisible()
    await expect(page.getByLabel('Utkast')).toBeVisible()
    await expect(page.getByLabel('Sparat av')).toBeVisible()
    await expect(page.getByLabel('Patient')).toBeVisible()

    // Needs proper label fixed.
    await expect(page.getByPlaceholder('ååååmmdd-nnnn')).toBeVisible()
    await expect(page.getByLabel('Från')).toBeVisible()
    await expect(page.getByLabel('till', { exact: true })).toBeVisible()

    await expect(page.getByRole('button', { name: 'Sök', exact: true })).toBeVisible()
    await expect(page.getByRole('button', { name: 'Återställ sökfilter', exact: true })).toBeVisible()
  })

  test('should have table', async ({ page }) => {
    await expect(page.getByRole('table', { name: 'Ej signerade utkast' })).toBeVisible()
  })

  test('should have table column "Senast sparat"', async ({ page }) => {
    await expect(page.getByRole('columnheader', { name: 'Senast sparat Byt till att' })).toBeVisible()
  })

  test(`should be possible to sort "Senast sparat"`, async ({ page }) => {
    await expect(page.getByRole('columnheader', { name: `Senast sparat Byt till att sortera stigande` })).toBeVisible()
    await page.getByRole('columnheader', { name: `Senast sparat Byt till att sortera stigande` }).click()
    await expect(page.getByRole('columnheader', { name: `Senast sparat Byt till att sortera fallande` })).toBeVisible()
  })

  for (const col of ['Typ av intyg', 'Status', 'Patient', 'Sparat av', 'Vidarebefordrad']) {
    test(`should have table column "${col}"`, async ({ page }) => {
      await expect(page.getByRole('columnheader', { name: `${col} Sortera på kolumn` })).toBeVisible()
    })

    test(`should be possible to sort "${col}"`, async ({ page }) => {
      await page.getByRole('columnheader', { name: `${col} Sortera på kolumn` }).click()
      await expect(page.getByRole('columnheader', { name: `${col} Byt till att sortera fallande` })).toBeVisible()

      await page.getByRole('columnheader', { name: `${col} Byt till att sortera fallande` }).click()
      await expect(page.getByRole('columnheader', { name: `${col} Byt till att sortera stigande` })).toBeVisible()
    })
  }

  test('should have empty table text', async ({ page }) => {
    await expect(page.getByRole('cell', { name: 'Inga resultat att visa.' })).toBeVisible()
  })
})
