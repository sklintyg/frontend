import { fakeCareProvider, fakeCertificate, fakeResourceLink, fakeUnit } from '../../src/faker'
import { CertificateStatus, ResourceLinkType } from '../../src/types'
import { expect, test } from '../fixtures'
import { setupUser } from '../mocks/user'

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
  links: [fakeResourceLink({ type: ResourceLinkType.READ_CERTIFICATE }), fakeResourceLink({ type: ResourceLinkType.EDIT_CERTIFICATE })],
})

const unit = fakeUnit()
const careProvider = fakeUnit()
const careProviders = [
  fakeCareProvider({
    id: careProvider.unitId,
    name: careProvider.unitName,
    careUnits: [
      { ...unit, units: [] },
      { ...fakeUnit(), units: [fakeUnit()] },
    ],
  }),
  fakeCareProvider({
    careUnits: [
      { ...fakeUnit(), units: [fakeUnit()] },
      { ...fakeUnit(), units: [] },
    ],
  }),
]

test.beforeEach(async ({ page, routeJson }) => {
  await routeJson(`**/*/api/certificate/${certificate.metadata.id}`, { certificate })
  await setupUser(
    page,
    {
      protectedPerson: false,
      loggedInCareProvider: {},
      loggedInCareUnit: {},
      loggedInUnit: {},
      careProviders,
    },
    [fakeResourceLink({ type: ResourceLinkType.CHOOSE_UNIT }), fakeResourceLink({ type: ResourceLinkType.CHANGE_UNIT })]
  )
})

test('when coming from integrated without specified unit', async ({ page }) => {
  // On login the user is redirected to /visa/intyg/%id% (backend)
  // that redirects to /certificate/%id%/launch-unit-selection (frontend)
  // Each unit should link back to the backend with /visa/intyg/%id%/resume?enhet=%hsaid%
  // that redirects to /certificate/%id%
  await page.route(`**/*/visa/intyg/${certificate.metadata.id}/resume?enhet=${unit.unitId}`, async (route) => {
    const url = new URL(route.request().url())
    await route.fulfill({
      status: 307,
      headers: {
        Location: `${url.origin}/certificate/${certificate.metadata.id}`,
      },
    })
  })

  await page.goto(`/certificate/${certificate.metadata.id}/launch-unit-selection`)
  await expect(page.getByRole('heading', { name: certificate.metadata.name })).toBeHidden()

  await setupUser(page, {
    protectedPerson: false,
    loggedInUnit: unit,
    loggedInCareUnit: unit,
    loggedInCareProvider: careProvider,
    careProviders,
  })

  await page.getByRole('link', { name: unit.unitName }).click()
  await page.waitForURL(`**/certificate/${certificate.metadata.id}`)
  await expect(page.getByRole('heading', { name: certificate.metadata.name })).toBeVisible()
})
