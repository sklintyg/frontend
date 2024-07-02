import type { Page } from '@playwright/test'
import { fakeCareProvider, fakeResourceLink, fakeUnit, fakeUser } from '../../src/faker'
import type { User } from '../../src/types'
import { ResourceLinkType } from '../../src/types'

export async function setupUser(page: Page, user?: Partial<User>) {
  const unit = fakeUnit({ unitId: 'FAKE_UNIT-1234', unitName: 'Medicincentrum' })
  const careProvider = fakeUnit({ unitId: 'FAKE_UNIT-1234', unitName: 'Hälsa' })
  await page.route('**/*/api/user', async (route) => {
    await route.fulfill({
      json: {
        user: fakeUser({
          hsaId: 'FAKE_HSAID-1234',
          name: 'Alva',
          role: 'Läkare',
          loggedInUnit: unit,
          loggedInCareUnit: unit,
          loggedInCareProvider: careProvider,
          preferences: {},
          protectedPerson: true,
          careProviders: [fakeCareProvider({ id: careProvider.unitId, name: careProvider.unitName, careUnits: [{ ...unit, units: [] }] })],
          ...user,
        }),
        links: [
          fakeResourceLink({ type: ResourceLinkType.ACCESS_SEARCH_CREATE_PAGE, name: 'Sök / skriv intyg' }),
          fakeResourceLink({ type: ResourceLinkType.ACCESS_DRAFT_LIST, name: 'Ej signerade utkast' }),
          fakeResourceLink({ type: ResourceLinkType.ACCESS_SIGNED_CERTIFICATES_LIST, name: 'Signerade intyg' }),
          fakeResourceLink({ type: ResourceLinkType.ACCESS_QUESTION_LIST, name: 'Ej hanterade ärenden' }),
        ],
      },
    })
  })
}
