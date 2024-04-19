import { expect, test } from '../fixtures'
import { certificate } from '../mocks/config/certificate'

test.beforeEach(async ({ page }) => {
  await page.route('**/*/api/list/certificate', async (route) => {
    await route.fulfill({
      json: { list: [], totalCount: 0 },
    })
  })

  await page.route('**/*/api/list/config/certificate', async (route) => {
    await route.fulfill({
      json: certificate,
    })
  })

  await page.route('**/*/api/list/config/certificate/update', async (route) => {
    await route.fulfill({
      json: certificate,
    })
  })

  await page.goto('/list/certificate')
})

test('have correct heading', async ({ page }) => {
  await expect(page.getByRole('heading', { name: 'Signerade intyg' })).toBeVisible()
  await expect(page.getByText('Nedan visas dina signerade')).toBeVisible()
})

test('empty page content', async ({ page }) => {
  await expect(page.getByRole('img', { name: 'Det finns inga resultat i' })).toBeVisible()
  await expect(page.getByText('Det finns inga signerade')).toBeVisible()
})

test.describe('Menu', () => {
  test('do not mark "Ej hanterade ärenden" menu item as selected', async ({ page }) => {
    await expect(page.getByRole('link', { name: 'Ej hanterade ärenden' })).toBeVisible()
    await expect(page.getByRole('link', { name: 'Ej hanterade ärenden' })).not.toHaveClass(/selected/)
  })

  test('do not mark "Ej signerade utkast" menu item as selected', async ({ page }) => {
    await expect(page.getByRole('link', { name: 'Ej signerade utkast' })).toBeVisible()
    await expect(page.getByRole('link', { name: 'Ej signerade utkast' })).not.toHaveClass(/selected/)
  })

  test('do not mark "Sök / skriv intyg" menu item as selected', async ({ page }) => {
    await expect(page.getByRole('link', { name: 'Sök / skriv intyg' })).toBeVisible()
    await expect(page.getByRole('link', { name: 'Sök / skriv intyg' })).not.toHaveClass(/selected/)
  })

  test('mark "Signerade intyg" menu item as selected', async ({ page }) => {
    await expect(page.getByRole('link', { name: 'Signerade intyg' })).toBeVisible()
    await expect(page.getByRole('link', { name: 'Signerade intyg' })).toHaveClass(/selected/)
  })
})

test.describe('Failed requests', () => {
  for (const endpoint of ['list/certificate', 'list/config/certificate']) {
    test(`show information on failed ${endpoint} request`, async ({ page }) => {
      await page.route(`**/*/api/${endpoint}`, async (route) => {
        await route.abort()
      })
      await page.goto('/list/certificate')

      await expect(page.getByText('Sökningen kunde inte utföras.')).toBeVisible()
    })
  }
})

test.describe('Populated table', () => {
  test.beforeEach(async ({ page }) => {
    await page.route('**/*/api/list/certificate', async (route) => {
      await route.fulfill({
        json: {
          list: [
            {
              values: {
                CERTIFICATE_ID: '178291c2-cec0-421f-b5e8-a76e80d5e820',
                CERTIFICATE_TYPE_NAME: 'Läkarintyg om arbetsförmåga – arbetsgivaren',
                LINKS: [
                  {
                    type: 'READ_CERTIFICATE',
                    name: 'Öppna',
                    description: '',
                    enabled: true,
                  },
                ],
                PATIENT_ID: {
                  id: '195711092642',
                  protectedPerson: false,
                  deceased: false,
                  testIndicated: false,
                },
                SIGNED: '2023-11-10T10:37:34.000',
                STATUS: 'Ej skickat',
              },
            },
          ],
          totalCount: 1,
        },
      })
    })
    await page.goto('/list/certificate')
  })

  test('show list filters', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Intyg visas för Alfa-enheten' })).toBeVisible()

    // Needs proper label fixed.
    await expect(page.getByPlaceholder('ååååmmdd-nnnn')).toBeVisible()
    await expect(page.getByLabel('Från')).toBeVisible()
    await expect(page.getByLabel('till', { exact: true })).toBeVisible()

    await expect(page.getByRole('button', { name: 'Sök', exact: true })).toBeVisible()
    await expect(page.getByRole('button', { name: 'Återställ sökfilter', exact: true })).toBeVisible()
  })

  test('should have table', async ({ page }) => {
    await expect(page.getByRole('table', { name: 'Signerade intyg' })).toBeVisible()
  })

  test('should have table column "Signerad"', async ({ page }) => {
    await expect(page.getByRole('columnheader', { name: 'Signerad Byt till att' })).toBeVisible()
  })

  test(`should be possible to sort "Signerad"`, async ({ page }) => {
    await expect(page.getByRole('columnheader', { name: `Signerad Byt till att sortera stigande` })).toBeVisible()
    await page.getByRole('columnheader', { name: `Signerad Byt till att sortera stigande` }).click()
    await expect(page.getByRole('columnheader', { name: `Signerad Byt till att sortera fallande` })).toBeVisible()
  })

  for (const col of ['Typ av intyg', 'Status', 'Patient']) {
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
})
