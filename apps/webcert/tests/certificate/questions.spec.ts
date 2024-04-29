import { fakeCertificate, fakeQuestion, fakeResourceLink } from '../../src/faker'
import { CertificateStatus, ResourceLinkType } from '../../src/types'
import { expect, test } from '../fixtures'

const id = 'foo'
const certificate = fakeCertificate({
  metadata: {
    id,
    name: 'Intyg om lasagne',
    patient: {
      firstName: 'Tolvan',
      middleName: 'TPU',
      lastName: 'Tolvanson',
      fullName: 'Tolvan TPU Tolvanson',
      personId: { id: '191212121212' },
    },
    status: CertificateStatus.UNSIGNED,
  },
  links: [
    fakeResourceLink({
      type: ResourceLinkType.READ_CERTIFICATE,
    }),
    fakeResourceLink({
      type: ResourceLinkType.EDIT_CERTIFICATE,
    }),
    fakeResourceLink({
      type: ResourceLinkType.QUESTIONS,
      name: 'Ärendekommunikation',
      description: 'Hantera kompletteringsbegäran, frågor och svar',
      enabled: true,
    }),
    fakeResourceLink({
      type: ResourceLinkType.CREATE_QUESTIONS,
      name: 'Ny fråga',
      description: 'Här kan du ställa en ny fråga till Försäkringskassan.',
      enabled: true,
    }),
  ],
})

test.beforeEach(async ({ page }) => {
  await page.route('**/*/api/certificate/*/validate', async (route) => {
    await route.fulfill({ json: { validationErrors: [] } })
  })
  await page.route('**/*/api/certificate/*/events', async (route) => {
    await route.fulfill({ json: { certificateEvents: [] } })
  })
  await page.route('**/*/api/certificate/*', async (route) => {
    await route.fulfill({ json: { certificate } })
  })
})

test.describe('Administrativ questions', () => {
  test('mark questions as handled', async ({ page }) => {
    await page.route('**/*/api/question/*', async (route) => {
      await route.fulfill({ json: { questions: [fakeQuestion()] } })
    })

    await page.goto(`/certificate/${id}`)
    await expect(page.getByText('Laddar...')).toBeHidden()
    await page.waitForTimeout(2000)
  })
})
