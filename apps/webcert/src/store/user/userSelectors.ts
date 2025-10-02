import { getByType } from '@frontend/utils'
import type { CareProvider, ResourceLink, UnitStatistics, User, UserStatistics } from '../../types'
import { ResourceLinkType } from '../../types'
import type { RootState } from '../reducer'

export const getUser = (state: RootState): User | null => state.ui.uiUser.user

export const getUserPreference =
  (key: string) =>
  (state: RootState): string | undefined =>
    state.ui.uiUser.user?.preferences?.[key]

export const isDoctor = (state: RootState): boolean | null =>
  state.ui.uiUser.user && state.ui.uiUser.user.role.toLowerCase().includes('läkare')

export const isPrivatePractitioner = (state: RootState): boolean | null =>
  state.ui.uiUser.user && state.ui.uiUser.user.role.toLowerCase().includes('privatläkare')

export const isCareAdministrator = (state: RootState): boolean | undefined =>
  state.ui.uiUser.user?.role.toLowerCase().includes('vårdadministratör')

export const hasOriginDeepIntegration = (state: RootState): boolean | null =>
  state.ui.uiUser.user && state.ui.uiUser.user.origin.toLowerCase().includes('djupintegration')

export const selectIsLoadingUser = (state: RootState): boolean => state.ui.uiUser.isLoadingUser

export const getUserResourceLinks = (state: RootState): ResourceLink[] => state.ui.uiUser.links

export const getUserResourceLink =
  (type: ResourceLinkType) =>
  (state: RootState): ResourceLink | undefined =>
    getByType(getUserResourceLinks(state), type)

export const getUserStatistics = (state: RootState): UserStatistics | undefined => state.ui.uiUser.userStatistics

export const getNumberOfDraftsOnUnit = (state: RootState): number =>
  state.ui.uiUser.userStatistics ? state.ui.uiUser.userStatistics.nbrOfDraftsOnSelectedUnit : 0

export const getNumberOfQuestionsOnUnit = (state: RootState): number =>
  state.ui.uiUser.userStatistics ? state.ui.uiUser.userStatistics.nbrOfUnhandledQuestionsOnSelectedUnit : 0

export const getUnitStatistics = (state: RootState): UnitStatistics => state.ui.uiUser.userStatistics?.unitStatistics ?? {}

export const selectIsLoadingUserStatistics = (state: RootState): boolean => state.ui.uiUser.isLoadingUserStatistics

export const getTotalDraftsAndUnhandledQuestionsOnOtherUnits = (state: RootState): number =>
  state.ui.uiUser.userStatistics ? state.ui.uiUser.userStatistics.totalDraftsAndUnhandledQuestionsOnOtherUnits : 0

export const getIsCareProviderModalOpen = (state: RootState): boolean => state.ui.uiUser.isCareProviderModalOpen

export const getLoggedInCareProvider = (state: RootState): User['loggedInCareProvider'] | undefined =>
  state.ui.uiUser.user?.loggedInCareProvider

export const getLoggedInUnit = (state: RootState): User['loggedInUnit'] | undefined => state.ui.uiUser.user?.loggedInUnit

export function getSelectUnitHeading(state: RootState): string {
  const chooseUnitLink = getUserResourceLink(ResourceLinkType.CHOOSE_UNIT)(state)
  const changeUnitLink = getUserResourceLink(ResourceLinkType.CHANGE_UNIT)(state)

  if (chooseUnitLink) {
    return chooseUnitLink.name
  } else if (changeUnitLink) {
    return changeUnitLink.name
  } else {
    return 'Välj vårdenhet'
  }
}

export function getCareProviders(state: RootState): CareProvider[] {
  return getUser(state)?.careProviders ?? []
}
