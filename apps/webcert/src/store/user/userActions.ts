import { ResourceLink, ResourceLinkType, Unit, User, UserProperty, UserStatistics } from '@frontend/common/types'
import { createAction } from '@reduxjs/toolkit'

const USER = '[User]'

export const getUser = createAction(`${USER} Get user`)
export const getUserStarted = createAction(`${USER} Get user started`)

interface GetUserResponse {
  user: User
  links: ResourceLink[]
}

export const getUserSuccess = createAction<GetUserResponse>(`${USER} Get user success`)
export const getUserError = createAction<string>(`${USER} Get user error`)

export const updateUser = createAction<User>(`${USER} Update user`)
export const updateIsLoadingUser = createAction<boolean>(`${USER} Update is loading user`)
export const updateUserResourceLinks = createAction<ResourceLink[]>(`${USER} Update user resource links`)

export const setUserPreference = createAction<UserProperty>(`${USER} Set user preference`)
export const setUserPreferenceStarted = createAction(`${USER} Set user preference started`)
export const setUserPreferenceSuccess = createAction<UserProperty>(`${USER} Set user preference success`)
export const setUserPreferenceError = createAction<string>(`${USER} Set user preference error`)

export const updateUserPreference = createAction<UserProperty>(`${USER} Update user preference`)

export const cancelLogout = createAction(`${USER} Cancel logout`)
export const cancelLogoutStarted = createAction(`${USER} Cancel logout started`)
export const cancelLogoutSuccess = createAction(`${USER} Cancel logout success`)
export const cancelLogoutError = createAction<string>(`${USER} Cancel logout error`)

export const triggerLogout = createAction(`${USER} Trigger logout`)
export const triggerLogoutStarted = createAction(`${USER} Trigger logout started`)
export const triggerLogoutSuccess = createAction(`${USER} Trigger logout success`)
export const triggerLogoutError = createAction<string>(`${USER} Trigger logout error`)

export const triggerLogoutNow = createAction(`${USER} Trigger logout now`)
export const triggerLogoutNowStarted = createAction(`${USER} Trigger logout now started`)
export const triggerLogoutNowSuccess = createAction(`${USER} Trigger logout now success`)
export const triggerLogoutNowError = createAction<string>(`${USER} Trigger logout now error`)

export const updateInactivateAutomaticLogout = createAction<boolean>(`${USER} Update inactivate automatic logout`)

export const getUserStatistics = createAction(`${USER} Get user statistics`)
export const getUserStatisticsStarted = createAction(`${USER} Get user statistics started`)
export const getUserStatisticsSuccess = createAction<UserStatistics>(`${USER} Get user statistics success`)
export const getUserStatisticsError = createAction<string>(`${USER} Get user statistics error`)
export const updateUserStatistics = createAction<UserStatistics>(`${USER} Get user statistics error`)

export const setUnit = createAction<string>(`${USER} Set unit`)
export const setUnitStarted = createAction(`${USER} Set unit started`)
export const setUnitSuccess = createAction<Unit>(`${USER} Set unit success`)
export const setUnitError = createAction<string>(`${USER} Set unit error`)

export const updateIsLoadingUserStatistics = createAction<boolean>(`${USER} Update is loading user statistics`)

export const updateIsCareProviderModalOpen = createAction<boolean>(`${USER} Update is care provider modal open`)

export const acknowledgeSubscription = createAction(`${USER} Acknowledge subscription`)
export const acknowledgeSubscriptionSuccess = createAction(`${USER} Acknowledge subscription success`)

export const removeResourceLink = createAction<ResourceLinkType>(`${USER} Remove resource link`)
