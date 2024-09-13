import faker from 'faker'
import { fakeCareProvider, fakeCareUnit, fakeCertificate, fakeResourceLink, fakeUnit, fakeUnitStatistic, fakeUser } from '../../src/faker'
import { ResourceLinkType } from '../../src/types'
import { expect, test } from '../fixtures'
import { setupUser } from '../mocks/user'

const careProviders = Array.from({ length: 3 }, () => fakeCareProvider({ careUnits: Array.from({ length: 3 }, fakeCareUnit) }))
const unitStatistics = Object.fromEntries(
  careProviders.flatMap((provider) =>
    provider.careUnits.map((unit) => [
      unit.unitId,
      fakeUnitStatistic({
        draftsOnSubUnits: faker.datatype.number(100),
        draftsOnUnit: faker.datatype.number(100),
        questionsOnSubUnits: faker.datatype.number(100),
        questionsOnUnit: faker.datatype.number(100),
      }),
    ])
  )
)

test.beforeEach(async ({ page, routeJson }) => {
  setupUser(page, {
    protectedPerson: false,
    careProviders,
    loggedInCareProvider: fakeUnit({ unitId: careProviders[0].id, unitName: careProviders[0].name }),
    loggedInCareUnit: careProviders[0].careUnits[0],
    loggedInUnit: careProviders[0].careUnits[0],
  })

  routeJson('**/*/api/user/statistics', {
    nbrOfDraftsOnSelectedUnit: 0,
    nbrOfUnhandledQuestionsOnSelectedUnit: 8,
    totalDraftsAndUnhandledQuestionsOnOtherUnits: 5,
    unitStatistics,
  })

  for (const provider of careProviders) {
    for (const unit of provider.careUnits) {
      routeJson(`**/*/api/user/unit/${unit.unitId}`, {
        links: [
          fakeResourceLink({ type: ResourceLinkType.ACCESS_SEARCH_CREATE_PAGE }),
          fakeResourceLink({ type: ResourceLinkType.ACCESS_DRAFT_LIST }),
          fakeResourceLink({ type: ResourceLinkType.ACCESS_SIGNED_CERTIFICATES_LIST }),
          fakeResourceLink({ type: ResourceLinkType.ACCESS_QUESTION_LIST }),
          fakeResourceLink({ type: ResourceLinkType.CHANGE_UNIT }),
          fakeResourceLink({ type: ResourceLinkType.LOG_OUT }),
        ],
        user: fakeUser({
          protectedPerson: false,
          careProviders,
          loggedInCareProvider: fakeUnit({ unitId: provider.id, unitName: provider.name }),
          loggedInCareUnit: unit,
          loggedInUnit: unit,
        }),
      })
    }
  }
})

test('Should be able to change unit', async ({ page }) => {
  await page.goto('/')

  await page.getByText(careProviders[0].name).click()
  await page.getByRole('button', { name: 'Byt vårdenhet' }).click()
  await expect(page.getByRole('heading', { name: 'Byt vårdenhet' })).toBeVisible()

  await page.getByRole('button', { name: careProviders[1].careUnits[0].unitName }).click()
  await expect(page.getByRole('heading', { name: 'Byt vårdenhet' })).toBeHidden()
  await expect(page.getByText(careProviders[1].name)).toBeVisible()
})

test('Revoke access to certificate after changing unit', async ({ page, routeJson }) => {
  const certificate = fakeCertificate({
    links: [fakeResourceLink({ type: ResourceLinkType.READ_CERTIFICATE }), fakeResourceLink({ type: ResourceLinkType.EDIT_CERTIFICATE })],
  })
  await routeJson(`**/*/api/certificate/${certificate.metadata.id}`, { certificate })

  await page.goto(`/certificate/${certificate.metadata.id}`)
  await expect(page.getByText('Laddar...')).toBeHidden()
  await expect(
    page.getByRole('heading', { name: `${certificate.metadata.patient.fullName} - ${certificate.metadata.patient.personId.id}` })
  ).toBeVisible()

  await page.getByText(careProviders[0].name).click()
  await page.getByRole('button', { name: 'Byt vårdenhet' }).click()
  await expect(page.getByRole('heading', { name: 'Byt vårdenhet' })).toBeVisible()

  await page.getByRole('button', { name: careProviders[1].careUnits[0].unitName }).click()
  await expect(page.getByRole('heading', { name: 'Byt vårdenhet' })).toBeHidden()

  await expect(page.getByRole('heading', { name: 'Patientens personnummer eller' })).toBeVisible()

  await page.route(`**/*/api/certificate/${certificate.metadata.id}`, async (route) => {
    await route.fulfill({
      status: 500,
      json: {
        errorCode: 'AUTHORIZATION_PROBLEM',
        message: 'User is logged in on a different unit than the draft/certificate...',
      },
    })
  })
  await page.goBack()
  await expect(page.getByText('Behörighet saknas')).toBeVisible()
})
