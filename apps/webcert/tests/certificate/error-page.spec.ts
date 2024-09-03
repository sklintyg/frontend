import { expect, test } from '../fixtures'

test('display AUTHORIZATION_PROBLEM_SEKRETESSMARKERING_ENHET error', async ({ page }) => {
  await page.route('**/*/api/certificate/123', async (route) => {
    await route.fulfill({ status: 400, json: { errorCode: 'AUTHORIZATION_PROBLEM_SEKRETESSMARKERING_ENHET' } })
  })
  await page.goto('/certificate/123')

  await expect(page.getByText('Du saknar behörighet att hantera detta intyg.')).toBeVisible()
})

test('display AUTHORIZATION_PROBLEM error', async ({ page }) => {
  await page.route('**/*/api/certificate/123', async (route) => {
    await route.fulfill({ status: 400, json: { errorCode: 'AUTHORIZATION_PROBLEM' } })
  })
  await page.goto('/certificate/123')

  await expect(page.getByText('Du saknar behörighet för att komma åt intyget.')).toBeVisible()
})

test('display DATA_NOT_FOUND error', async ({ page }) => {
  await page.route('**/*/api/certificate/123', async (route) => {
    await route.fulfill({ status: 400, json: { errorCode: 'AUTHORIZATION_PROBLEM' } })
  })
  await page.goto('/certificate/123')

  await expect(page.getByText('Du saknar behörighet för att komma åt intyget.')).toBeVisible()
})

test('display INVALID_LAUNCHID error', async ({ page }) => {
  await page.route('**/*/api/certificate/123', async (route) => {
    await route.fulfill({ status: 400, json: { errorCode: 'INVALID_LAUNCHID' } })
  })
  await page.goto('/certificate/123')

  await expect(page.getByText('Detta intyg kan inte visas eftersom du har öppnat ett annat intyg.')).toBeVisible()
})
