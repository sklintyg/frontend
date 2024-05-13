import { fakeCategoryElement, fakeCertificate, fakeCertificateEvent, fakeResourceLink } from '../../src/faker'
import { CertificateEventType, CertificateStatus, ResourceLinkType } from '../../src/types'
import { expect, test } from '../fixtures'

const certificate = fakeCertificate({
  metadata: {
    name: 'Intyg om lasagne',
    patient: {
      firstName: 'Tolvan',
      middleName: 'TPU',
      lastName: 'Tolvanson',
      fullName: 'Tolvan TPU Tolvanson',
      personId: { id: '191212121212' },
    },
    status: CertificateStatus.SIGNED,
  },
  links: [
    fakeResourceLink({
      type: ResourceLinkType.READ_CERTIFICATE,
    }),
    fakeResourceLink({
      type: ResourceLinkType.EDIT_CERTIFICATE,
    }),
  ],
})

test.beforeEach(async ({ routeJson }) => {
  await routeJson(`**/*/api/certificate/${certificate.metadata.id}/validate`, { validationErrors: [] })
  await routeJson(`**/*/api/certificate/${certificate.metadata.id}/events`, { certificateEvents: [] })
  await routeJson(`**/*/api/certificate/${certificate.metadata.id}`, { certificate })
})

test('should load certificate', async ({ page }) => {
  await page.goto(`/certificate/${certificate.metadata.id}`)
  await expect(page.getByText('Laddar...')).toBeHidden()
  await expect(
    page.getByRole('heading', { name: `${certificate.metadata.patient.fullName} - ${certificate.metadata.patient.personId.id}` })
  ).toBeVisible()
})

test('should display category', async ({ page, routeJson }) => {
  await routeJson(`**/*/api/certificate/${certificate.metadata.id}`, {
    certificate: fakeCertificate({
      ...certificate,
      metadata: { status: CertificateStatus.UNSIGNED },
      data: {
        ...fakeCategoryElement({ id: '1', config: { text: 'A category', description: 'Category description' } }),
      },
    }),
  })
  await page.goto(`/certificate/${certificate.metadata.id}`)

  await expect(page.getByText('Laddar...')).toBeHidden()
  await expect(page.getByRole('heading', { name: 'A category' })).toBeVisible()
  await page.getByRole('heading', { name: 'A category' }).click()
  await expect(page.getByText('Category description')).toBeVisible()
})

test.describe('Header buttons', () => {
  for (const type of [
    ResourceLinkType.COPY_CERTIFICATE_CONTINUE,
    ResourceLinkType.COPY_CERTIFICATE,
    ResourceLinkType.CREATE_CERTIFICATE_FROM_TEMPLATE,
    ResourceLinkType.PRINT_CERTIFICATE,
    ResourceLinkType.REMOVE_CERTIFICATE,
    ResourceLinkType.RENEW_CERTIFICATE,
    ResourceLinkType.REPLACE_CERTIFICATE_CONTINUE,
    ResourceLinkType.REPLACE_CERTIFICATE,
    ResourceLinkType.REVOKE_CERTIFICATE,
    ResourceLinkType.SEND_CERTIFICATE,
    ResourceLinkType.SHOW_RELATED_CERTIFICATE,
  ]) {
    test(`should have "${type}" button`, async ({ page, routeJson }) => {
      const resourceLink = fakeResourceLink({ type })
      routeJson(`**/*/api/certificate/${certificate.metadata.id}`, {
        certificate: fakeCertificate({
          ...certificate,
          links: [resourceLink],
        }),
      })
      await page.goto(`/certificate/${certificate.metadata.id}`)
      await expect(page.getByText('Laddar...')).toBeHidden()
      await expect(page.getByRole('button', { name: resourceLink.name })).toBeEnabled()
    })
  }
})

test.describe('Certificate events', () => {
  test('open and close certificate events modal', async ({ page, routeJson }) => {
    await routeJson(`**/*/api/certificate/${certificate.metadata.id}/events`, {
      certificateEvents: Object.values(CertificateEventType).map((type) =>
        fakeCertificateEvent({ type, certificateId: certificate.metadata.id, relatedCertificateId: 'related-certificate' })
      ),
    })
    await page.goto(`/certificate/${certificate.metadata.id}`)
    await expect(page.getByRole('button', { name: 'Visa alla händelser' })).toBeVisible()
    await page.getByRole('button', { name: 'Visa alla händelser' }).click()
    await expect(page.getByRole('heading', { name: 'Alla händelser' })).toBeVisible()
    await page.getByLabel('Stäng').click()
    await expect(page.getByRole('heading', { name: 'Alla händelser' })).toBeHidden()
  })

  const STATUSES: [CertificateEventType, string][] = [
    [CertificateEventType.CREATED, 'Utkastet är skapat'],
    [CertificateEventType.CREATED_FROM, 'Utkastet är skapat'],
    [CertificateEventType.SIGNED, 'Intyget är signerat'],
    [CertificateEventType.AVAILABLE_FOR_PATIENT, 'Intyget är tillgängligt för patienten'],
    [CertificateEventType.REPLACES, 'Utkastet skapades för att ersätta ett tidigare intyg.'],
    [CertificateEventType.EXTENDED, 'Utkastet skapades för att förnya ett tidigare intyg.'],
    [CertificateEventType.INCOMING_MESSAGE, 'Försäkringskassan har ställt en fråga'],
    [CertificateEventType.OUTGOING_MESSAGE, 'En fråga har skickats till Försäkringskassan'],
    [CertificateEventType.INCOMING_ANSWER, 'Försäkringskassan har svarat på en fråga'],
    [CertificateEventType.REQUEST_FOR_COMPLEMENT, 'Försäkringkassan har begärt komplettering'],
    [CertificateEventType.INCOMING_MESSAGE_HANDLED, 'En fråga från Försäkringskassan är markerad som hanterad'],
    [CertificateEventType.OUTGOING_MESSAGE_HANDLED, 'En fråga till Försäkringskassan är markerad som hanterad'],
    [CertificateEventType.LOCKED, 'Utkastet låstes'],
    [CertificateEventType.COPIED_FROM, 'Utkastet är skapat som en kopia på ett låst utkast'],
  ]

  for (const [type, expected] of STATUSES) {
    test(`should have expected content for ${type}`, async ({ page, routeJson }) => {
      await routeJson(`**/*/api/certificate/${certificate.metadata.id}/events`, {
        certificateEvents: [
          fakeCertificateEvent({ type, certificateId: certificate.metadata.id, relatedCertificateId: 'related-certificate' }),
        ],
      })
      await page.goto(`/certificate/${certificate.metadata.id}`)
      await page.getByRole('button', { name: 'Visa alla händelser' }).click()
      await expect(page.getByLabel('Alla händelser').getByText(expected)).toBeVisible()
    })
  }

  const REPLACED_STATUSES: [CertificateStatus, string][] = [
    [CertificateStatus.UNSIGNED, 'Det finns redan ett påbörjat utkast som ska ersätta detta intyg.'],
    [CertificateStatus.SIGNED, 'Intyget har ersatts av'],
    [CertificateStatus.REVOKED, 'Intyget ersattes av ett intyg som nu är makulerat.'],
    [CertificateStatus.LOCKED_REVOKED, 'Intyget ersattes av ett utkast som nu är låst.'],
    [CertificateStatus.LOCKED, 'Intyget ersattes av ett utkast som nu är låst.'],
  ]

  for (const [status, expected] of REPLACED_STATUSES) {
    test(`should have expected content for REPLACED for related certificate is ${status}`, async ({ page, routeJson }) => {
      await routeJson(`**/*/api/certificate/${certificate.metadata.id}/events`, {
        certificateEvents: [
          fakeCertificateEvent({
            type: CertificateEventType.REPLACED,
            certificateId: certificate.metadata.id,
            relatedCertificateId: 'related-certificate',
            relatedCertificateStatus: status,
          }),
        ],
      })
      await page.goto(`/certificate/${certificate.metadata.id}`)
      await page.getByRole('button', { name: 'Visa alla händelser' }).click()
      await expect(page.getByLabel('Alla händelser').getByText(expected)).toBeVisible()
    })
  }
})
