import type { Page } from '@playwright/test'
import { fakeCareProvider, fakeCareUnit, fakeResourceLink, fakeUnit, fakeUser } from '../../src/faker'
import type { ResourceLink, User } from '../../src/types'
import { ResourceLinkType } from '../../src/types'

export async function setupUser(page: Page, user?: Partial<User>, links?: ResourceLink[]) {
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
          careProviders: [
            fakeCareProvider({ id: careProvider.unitId, name: careProvider.unitName, careUnits: [{ ...unit, units: [] }] }),
            fakeCareProvider({ careUnits: [fakeCareUnit(), fakeCareUnit()] }),
          ],
          ...user,
        }),
        links: links ?? [
          fakeResourceLink({ type: ResourceLinkType.ACCESS_SEARCH_CREATE_PAGE }),
          fakeResourceLink({ type: ResourceLinkType.ACCESS_DRAFT_LIST }),
          fakeResourceLink({ type: ResourceLinkType.ACCESS_SIGNED_CERTIFICATES_LIST }),
          fakeResourceLink({ type: ResourceLinkType.ACCESS_QUESTION_LIST }),
          fakeResourceLink({ type: ResourceLinkType.CHANGE_UNIT }),
          fakeResourceLink({ type: ResourceLinkType.LOG_OUT }),
        ],
      },
    })
  })
}
