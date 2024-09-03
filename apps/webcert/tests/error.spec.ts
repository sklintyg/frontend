import { expect, test } from './fixtures'

test('display AUTHORIZATION_PROBLEM error', async ({ page }) => {
  await page.goto('/error?reason=auth-exception')
  await expect(page.getByText('Du saknar behörighet för att komma åt intyget.')).toBeVisible()
})

test('display AUTHORIZATION_PROBLEM_SEKRETESSMARKERING error', async ({ page }) => {
  await page.goto('/error?reason=auth-exception-sekretessmarkering')
  await expect(
    page.getByText(
      'För att hantera intyg för patienter med skyddade personuppgifter krävs att du har befattningen läkare eller tandläkare.'
    )
  ).toBeVisible()
})

test('display AUTHORIZATION_USER_SESSION_ALREADY_ACTIVE error', async ({ page }) => {
  await page.goto('/error?reason=auth-exception-user-already-active')
  await expect(page.getByText('Ett problem med sessionen för Webcert har uppstått.')).toBeVisible()
})

test('display INTEGRATION_NOCONTENT error', async ({ page }) => {
  await page.goto('/error?reason=integration.nocontent')
  await expect(page.getByText('Intygsutkastet är raderat och kan därför inte längre visas.')).toBeVisible()
})

for (const error of ['unknown', 'pu-problem', 'missing-parameter']) {
  test(`display ${error} error`, async ({ page }) => {
    await page.goto('/error?reason=unknown')
    await expect(page.getByText('Prova att ladda om sidan.')).toBeVisible()
  })
}
