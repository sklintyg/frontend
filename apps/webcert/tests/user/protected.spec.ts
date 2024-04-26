import { expect, test } from '../fixtures'
import { setupUser } from '../mocks/user'

test.beforeEach(async ({ page }) => setupUser(page))

test('show protected person approval modal', async ({ page }) => {
  await page.goto('/')

  await expect(page.getByTestId('modal-backdrop')).toBeVisible()
  await expect(page.getByRole('heading', { name: 'Användning av Webcert med skyddade personuppgifter' })).toBeVisible()
  await expect(page.getByText('Du har skyddade')).toBeVisible()
  await expect(page.getByText('Att använda Webcert med en')).toBeVisible()
  await expect(page.getByTestId('modal-backdrop').getByRole('list')).toBeVisible()
  await expect(page.getByText('Vill du ändå gå vidare och')).toBeVisible()
  await expect(page.getByText('Jag förstår och godkänner.')).toBeVisible()
  await expect(page.getByLabel('Avbryt')).toBeVisible()
})

test('cancel protected person modal', async ({ page }) => {
  await page.goto('/')

  await expect(page.getByTestId('modal-backdrop')).toBeVisible()
  await expect(page.getByRole('heading', { name: 'Användning av Webcert med skyddade personuppgifter' })).toBeVisible()
  await expect(page.getByLabel('Avbryt')).toBeVisible()
  await expect(page.getByLabel('Till Webcert')).toBeDisabled()

  await page.getByLabel('Avbryt').click()

  await expect(page.getByTestId('modal-backdrop')).toBeHidden()
  await expect(page.getByText('Godkännande saknas')).toBeVisible()
  await expect(page.getByText('Användarvillkoren för anvä')).toBeVisible()
  await expect(page.getByText('Ange fel-ID för snabbare')).toBeVisible()
})

test('accept protected person modal', async ({ page }) => {
  await page.goto('/')

  await expect(page.getByTestId('modal-backdrop')).toBeVisible()
  await expect(page.getByRole('heading', { name: 'Användning av Webcert med skyddade personuppgifter' })).toBeVisible()
  await expect(page.getByLabel('Avbryt')).toBeVisible()

  await page.getByText('Jag förstår och godkänner.').click()
  await expect(page.getByText('Jag förstår och godkänner.')).toBeChecked()
  await expect(page.getByLabel('Till Webcert')).toBeEnabled()
  await page.getByLabel('Till Webcert').click()

  await expect(page.getByTestId('modal-backdrop')).toBeHidden()
})

test('hide protected person approval when approved', async ({ page }) => {
  await setupUser(page, { preferences: { 'wc.vardperson.sekretess.approved': 'true' } })
  await page.goto('/')

  await expect(page.getByRole('heading', { name: 'Användning av Webcert med skyddade personuppgifter' })).toBeHidden()
})

test('show protected person modal', async ({ page }) => {
  await setupUser(page, { preferences: { 'wc.vardperson.sekretess.approved': 'true' } })
  await page.goto('/')

  await expect(page.getByRole('button', { name: 'Skyddade personuppgifter' })).toBeVisible()
  await page.getByRole('button', { name: 'Skyddade personuppgifter' }).click()

  await expect(page.getByTestId('modal-backdrop')).toBeVisible()
  await expect(page.getByRole('heading', { name: 'Användning av Webcert med skyddade personuppgifter' })).toBeVisible()
  await expect(page.getByText('Du har skyddade')).toBeVisible()
  await expect(page.getByText('Att använda Webcert med')).toBeVisible()
  await expect(page.getByText('Stäng')).toBeVisible()

  page.getByText('Stäng').click()

  await expect(page.getByTestId('modal-backdrop')).toBeHidden()
})
