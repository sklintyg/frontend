import { fakeCertificate, fakeResourceLink } from '../../src/faker'
import { CertificateStatus, ResourceLinkType } from '../../src/types'
import { expect, test } from '../fixtures'

const firstCert = fakeCertificate({
  metadata: {
    id: '1',
    name: 'first certificate',
    status: CertificateStatus.SIGNED,
  },
  links: [fakeResourceLink({ type: ResourceLinkType.REPLACE_CERTIFICATE })],
})

const secondCert = fakeCertificate({
  metadata: {
    id: '2',
    name: 'second certificate',
    relations: { parent: { certificateId: firstCert.metadata.id } },
  },
  links: [fakeResourceLink({ type: ResourceLinkType.REPLACE_CERTIFICATE })],
})

const thirdCert = fakeCertificate({
  metadata: {
    id: '3',
    name: 'third certificate',
    relations: { parent: { certificateId: secondCert.metadata.id } },
  },
  links: [fakeResourceLink({ type: ResourceLinkType.REMOVE_CERTIFICATE })],
})

test.beforeEach(async ({ page, routeJson }) => {
  await routeJson(`**/*/api/certificate/${firstCert.metadata.id}`, { certificate: firstCert })
  await routeJson(`**/*/api/certificate/${firstCert.metadata.id}/replace`, { certificateId: secondCert.metadata.id })
  await routeJson(`**/*/api/certificate/${secondCert.metadata.id}`, { certificate: secondCert })
  await routeJson(`**/*/api/certificate/${secondCert.metadata.id}/replace`, { certificateId: thirdCert.metadata.id })
  await routeJson(`**/*/api/certificate/${thirdCert.metadata.id}`, { certificate: thirdCert })
  await page.route(`**/*/api/certificate/${thirdCert.metadata.id}/${thirdCert.metadata.version}`, async (route) => {
    if (route.request().method() === 'DELETE') {
      await route.fulfill()
    }
  })
})

test('replaced certificate', async ({ page }) => {
  await page.goto(`/certificate/${firstCert.metadata.id}`)
  await expect(page.getByText('Laddar...')).toBeHidden()
  await expect(page.getByRole('heading', { name: firstCert.metadata.name })).toBeVisible()
  await page.getByRole('button', { name: 'Ersätt' }).click()
  await page.getByLabel('Ersätt intyg').getByRole('button', { name: 'Ersätt' }).click()
  await expect(page.getByRole('heading', { name: secondCert.metadata.name })).toBeVisible()
})

test('navigate back from replaced certificate', async ({ page }) => {
  await page.goto(`/certificate/${firstCert.metadata.id}`)
  await expect(page.getByText('Laddar...')).toBeHidden()
  await page.getByRole('button', { name: 'Ersätt' }).click()
  await page.getByLabel('Ersätt intyg').getByRole('button', { name: 'Ersätt' }).click()
  await page.getByRole('button', { name: 'Tillbaka' }).click()
  await expect(page.getByRole('heading', { name: firstCert.metadata.name })).toBeVisible()
})

test('navigate back from multiple replaced certificates', async ({ page }) => {
  await page.goto(`/certificate/${firstCert.metadata.id}`)
  await expect(page.getByText('Laddar...')).toBeHidden()

  await page.getByRole('button', { name: 'Ersätt' }).click()
  await page.getByLabel('Ersätt intyg').getByRole('button', { name: 'Ersätt' }).click()
  await expect(page.getByRole('heading', { name: secondCert.metadata.name })).toBeVisible()

  await page.getByRole('button', { name: 'Ersätt' }).click()
  await page.getByLabel('Ersätt intyg').getByRole('button', { name: 'Ersätt' }).click()
  await expect(page.getByRole('heading', { name: thirdCert.metadata.name })).toBeVisible()

  await page.getByRole('button', { name: 'Tillbaka' }).click()
  await expect(page.getByRole('heading', { name: secondCert.metadata.name })).toBeVisible()
  await page.getByRole('button', { name: 'Tillbaka' }).click()
  await expect(page.getByRole('heading', { name: firstCert.metadata.name })).toBeVisible()
})

test('navigate back from deleted certificate', async ({ page }) => {
  await page.goto(`/certificate/${firstCert.metadata.id}`)
  await expect(page.getByRole('heading', { name: firstCert.metadata.name })).toBeVisible()
  await page.getByRole('button', { name: 'Ersätt' }).click()

  await page.getByLabel('Ersätt intyg').getByRole('button', { name: 'Ersätt' }).click()
  await expect(page.getByRole('heading', { name: secondCert.metadata.name })).toBeVisible()
  await page.getByRole('button', { name: 'Ersätt' }).click()

  await page.getByLabel('Ersätt intyg').getByRole('button', { name: 'Ersätt' }).click()
  await expect(page.getByRole('heading', { name: thirdCert.metadata.name })).toBeVisible()
  await page.getByRole('button', { name: 'Radera' }).click()

  await page.getByLabel('Radera utkast').getByRole('button', { name: 'Radera' }).click()
  await expect(page.getByRole('heading', { name: secondCert.metadata.name })).toBeVisible()

  await page.getByRole('button', { name: 'Tillbaka' }).click()
  await expect(page.getByRole('heading', { name: firstCert.metadata.name })).toBeVisible()
})
