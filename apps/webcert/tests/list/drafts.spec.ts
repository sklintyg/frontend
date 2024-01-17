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
})

test('have correct heading', async ({ page }) => {
  await page.goto('https://wc2.wc.localtest.me/list/draft')

  await expect(page.getByRole('heading', { name: 'Ej signerade utkast' })).toBeVisible()
  await expect(page.getByText('Nedan visas alla ej signerade')).toBeVisible()
})

test('empty page content', async ({ page }) => {
  await page.goto('https://wc2.wc.localtest.me/list/draft')

  await expect(page.getByRole('img', { name: 'Det finns inga resultat i' })).toBeVisible()
  await expect(page.getByText('Det finns inga ej signerade')).toBeVisible()
})

test.describe('Menu', () => {
  test('do not mark "Ej hanterade ärenden" menu item as selected', async ({ page }) => {
    await page.goto('https://wc2.wc.localtest.me/list/draft')

    await expect(page.getByRole('link', { name: 'Ej hanterade ärenden' })).toBeVisible()
    await expect(page.getByRole('link', { name: 'Ej hanterade ärenden' })).not.toHaveClass(/selected/)
  })

  test('mark "Ej signerade utkast" menu item as selected', async ({ page }) => {
    await page.goto('https://wc2.wc.localtest.me/list/draft')

    await expect(page.getByRole('link', { name: 'Ej signerade utkast' })).toBeVisible()
    await expect(page.getByRole('link', { name: 'Ej signerade utkast' })).toHaveClass(/selected/)
  })

  test('do not mark "Sök / skriv intyg" menu item as selected', async ({ page }) => {
    await page.goto('https://wc2.wc.localtest.me/list/draft')

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
  for (const endpoint of ['list/draft', 'list/config/draft']) {
    test(`show information on failed ${endpoint} request`, async ({ page }) => {
      await page.route(`**/*/api/${endpoint}`, async (route) => {
        await route.abort()
      })

      await page.goto('https://wc2.wc.localtest.me/list/draft')

      await expect(page.getByText('Sökningen kunde inte utföras.')).toBeVisible()
    })
  }
})
