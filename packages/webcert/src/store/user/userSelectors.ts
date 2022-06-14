import { RootState } from '../store'
import { ResourceLink, UnitStatistics, User, UserStatistics } from '@frontend/common'

export const getUser = (state: RootState): User | null => state.ui.uiUser.user

export const getUserPreference = (key: string) => (state: RootState): string | undefined => state.ui.uiUser.user?.preferences?.[key]

export const isDoctor = (state: RootState): boolean | null =>
  state.ui.uiUser.user && state.ui.uiUser.user.role.toLowerCase().includes('läkare')

export const isCareAdministrator = (state: RootState): boolean | undefined =>
  state.ui.uiUser.user?.role.toLowerCase().includes('vårdadministratör')

export const selectIsLoadingUser = (state: RootState): boolean => state.ui.uiUser.isLoadingUser

export const getUserResourceLinks = (state: RootState): ResourceLink[] => state.ui.uiUser.links

export const getUserStatistics = (state: RootState): UserStatistics | undefined => state.ui.uiUser.userStatistics

export const getNumberOfDraftsOnUnit = (state: RootState): number | undefined =>
  state.ui.uiUser.userStatistics ? state.ui.uiUser.userStatistics.nbrOfDraftsOnSelectedUnit : 0

export const getUnitStatistics = (state: RootState): UnitStatistics =>
  state.ui.uiUser.userStatistics ? state.ui.uiUser.userStatistics.unitStatistics : {}

export const selectIsLoadingUserStatistics = (state: RootState): boolean => state.ui.uiUser.isLoadingUserStatistics

export const getTotalDraftsAndUnhandledQuestionsOnOtherUnits = (state: RootState): number | undefined =>
  state.ui.uiUser.userStatistics?.totalDraftsAndUnhandledQuestionsOnOtherUnits
