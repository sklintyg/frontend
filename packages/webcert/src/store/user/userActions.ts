import { createAction } from '@reduxjs/toolkit'
import { CertificateType, ResourceLink, User, UserProperty } from '@frontend/common'
import { CreateCertificate, CreateCertificateResponse } from './userReducer'

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

export const getCertificateTypes = createAction<string>(`${USER} Get certificate types`)
export const getCertificateTypesStarted = createAction(`${USER} Get certificate started`)
export const getCertificateTypesSuccess = createAction(`${USER} Get certificate success`)
export const getCertificateTypesError = createAction<string>(`${USER} Get certificate error`)

export const updateCertificateTypes = createAction<CertificateType[]>(`${USER} Update certificate types`)

export const createNewCertificate = createAction<CreateCertificate>(`${USER} Create certificate`)
export const createNewCertificateStarted = createAction(`${USER} Create certificate started`)
export const createNewCertificateSuccess = createAction<CreateCertificateResponse>(`${USER} Create certificate success`)
export const createNewCertificateError = createAction<string>(`${USER} Create certificate error`)
export const updateCertificateId = createAction<string>(`${USER} Update certificate id`)
