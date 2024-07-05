import { fakeCertificate, fakeResourceLink } from '../../src/faker'
import { fakeId } from '../../src/faker/fakeId'
import { CertificateStatus, ResourceLinkType } from '../../src/types'
import { expect, test } from '../fixtures'

const firstCert = fakeCertificate({
  metadata: {
    id: fakeId(),
    status: CertificateStatus.SIGNED,
  },
  links: [fakeResourceLink({ type: ResourceLinkType.READ_CERTIFICATE }), fakeResourceLink({ type: ResourceLinkType.REPLACE_CERTIFICATE })],
})

const secondCert = fakeCertificate({
  metadata: {
    id: fakeId(),
    relations: {
      parent: { certificateId: firstCert.metadata.id },
    },
  },
  links: [fakeResourceLink({ type: ResourceLinkType.READ_CERTIFICATE }), fakeResourceLink({ type: ResourceLinkType.REPLACE_CERTIFICATE })],
})

test.beforeEach(async ({ routeJson }) => {
  await routeJson(`**/*/api/certificate/${firstCert.metadata.id}`, { certificate: firstCert })
  await routeJson(`**/*/api/certificate/${firstCert.metadata.id}/replace`, { certificateId: secondCert.metadata.id })
  await routeJson(`**/*/api/certificate/${secondCert.metadata.id}`, { certificate: secondCert })
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

test('navigate back from multiple replaced certificates', async ({ page, routeJson }) => {
  const thirdCert = fakeCertificate({
    metadata: {
      id: fakeId(),
      relations: { parent: { certificateId: secondCert.metadata.id } },
    },
  })
  await routeJson(`**/*/api/certificate/${secondCert.metadata.id}/replace`, { certificateId: thirdCert.metadata.id })
  await routeJson(`**/*/api/certificate/${thirdCert.metadata.id}`, { certificate: thirdCert })

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
