import playwrightConfig from '../../playwright.config'
import { fakeCategoryElement, fakeCertificate, fakeResourceLink, fakeTextFieldElement } from '../../src/faker'
import { CertificateStatus, ResourceLinkType, SigningMethod } from '../../src/types'
import { expect, test } from '../fixtures'
import { setupUser } from '../mocks/user'

const externalUrl = 'https://esign.idp.se/submit'
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
    status: CertificateStatus.UNSIGNED,
  },
  data: {
    ...fakeTextFieldElement({ id: 'textfield', index: 2 }),
    ...fakeCategoryElement({ id: 'category', index: 1 }),
  },
  links: [
    fakeResourceLink({ type: ResourceLinkType.READ_CERTIFICATE }),
    fakeResourceLink({ type: ResourceLinkType.EDIT_CERTIFICATE }),
    fakeResourceLink({ type: ResourceLinkType.SIGN_CERTIFICATE }),
  ],
})

test.beforeEach(async ({ routeJson, page }) => {
  await routeJson(`**/*/api/certificate/${certificate.metadata.id}`, { certificate })
  page.route(externalUrl, (route, request) => {
    route.fulfill({
      contentType: 'text/html',
      headers: {
        ...request.headers(),
        Referer: externalUrl,
      },
      body: `
        <html>
        <body>
          <h1>External Service</h1>
          <form id="returnForm" action="${playwrightConfig.use?.baseURL}api/signature/signservice/v1/response" method="POST">
            <input type="hidden" name="token" value="mocked-token"/>
            <input type="hidden" name="status" value="success"/>
          </form>
          <script>
            window.history.pushState({}, '', '${externalUrl}')
            document.getElementById('returnForm').submit();
          </script>
        </body>
        </html>
      `,
    })
  })
  page.route('**/*/api/signature/signservice/v1/response', async (route) => {
    await route.fulfill({
      status: 303,
      headers: {
        Location: `${playwrightConfig.use?.baseURL}certificate/${certificate.metadata.id}`,
      },
    })
  })
})

test('Sing certificate with DSS', async ({ page }) => {
  setupUser(page, { signingMethod: SigningMethod.DSS, protectedPerson: false })
  page.route('**/*/api/signature/**/*/SIGN_SERVICE', (route) => {
    route.fulfill({
      json: { actionUrl: externalUrl, id: certificate.metadata.id, signRequest: 'signRequest' },
    })
  })

  await page.goto(`/certificate/${certificate.metadata.id}`)
  await expect(page.getByText('Laddar...')).toBeHidden()
  await expect(page.getByRole('heading', { name: certificate.metadata.name })).toBeVisible()
  await expect(page.getByRole('button', { name: 'Signera intyget' })).toBeEnabled()

  await page.getByRole('button', { name: 'Signera intyget' }).click()
  await expect(page.getByRole('heading', { name: certificate.metadata.name })).toBeHidden()
  await page.waitForURL(`**/*/certificate/${certificate.metadata.id}`)
  await expect(page.getByRole('heading', { name: certificate.metadata.name })).toBeVisible()
})

test('Navigate back after external service redirect', async ({ page }) => {
  await page.goto(externalUrl)

  await expect(page.getByRole('heading', { name: certificate.metadata.name })).toBeVisible()

  await page.evaluate(() => {
    Object.defineProperty(document, 'referrer', {
      get: () => 'https://esign.idp.se/submit',
    })
  })

  page.route(externalUrl, (route) => route.fulfill({ status: 500, body: '<html><body><h1>External Service 500 Error</h1></body></html>' }))

  await page.getByRole('button', { name: 'Tillbaka' }).click()
  await page.waitForURL(`**/*/search`)

  await expect(page.getByRole('heading', { name: 'Patientens personnummer eller samordningsnummer' })).toBeVisible()
})
