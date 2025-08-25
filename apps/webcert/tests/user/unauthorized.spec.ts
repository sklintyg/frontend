import { expect, test } from '../fixtures'

test.beforeEach(async ({ page }) => {
  await page.route('**/*/api/user', async (route) => {
    await route.abort()
  })
})

test('has title', async ({ page }) => {
  await page.goto('/')

  await expect(page).toHaveTitle(/Webcert/)
})

test('has header content', async ({ page }) => {
  await page.goto('/')

  await expect(page.getByRole('img', { name: 'Webcert', exact: true })).toBeVisible()
  await expect(page.getByText('Är du privatläkare och vill')).toBeVisible()
  await expect(page.getByRole('link', { name: 'Skapa konto' })).toBeVisible()
})

test('has page content', async ({ page }) => {
  await page.goto('/')

  await expect(page.getByRole('img', { name: 'Bärbar dator som är inloggad' })).toBeVisible()
  await expect(page.getByRole('heading', { name: 'Välkommen till Webcert' })).toBeVisible()
  await expect(page.getByText('Webcert används för att utfä')).toBeVisible()
  await expect(page.getByRole('heading', { name: 'Välj inloggning' })).toBeVisible()
  await expect(page.getByRole('link', { name: 'SITHS-kort' })).toBeVisible()
  await expect(page.getByRole('link', { name: 'E-legitimation' })).toBeVisible()
})

test('has footer content', async ({ page }) => {
  await page.goto('/')

  await expect(page.getByText('Webcert', { exact: true })).toBeVisible()
  await expect(page.getByText('Webcert är en tjänst som')).toBeVisible()
  await expect(page.getByLabel('Sidfot meny', { exact: true }).locator('li').filter({ hasText: 'Inera AB' })).toBeVisible()
  await expect(page.getByLabel('Sidfot meny', { exact: true }).locator('li').filter({ hasText: 'Inera Support' })).toBeVisible()
  await expect(page.getByLabel('Sidfot meny', { exact: true }).locator('li').filter({ hasText: 'Om kakor (cookies)' })).toBeVisible()
  await expect(page.getByLabel('Sidfot meny', { exact: true }).locator('li').filter({ hasText: 'Webcerts informationsyta' })).toBeVisible()
})
