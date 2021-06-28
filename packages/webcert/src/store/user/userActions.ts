import { createAction } from '@reduxjs/toolkit'
import { User, UserProperty } from '@frontend/common'

export const getUser = createAction('[User] Get user')
export const getUserStarted = createAction('[User] Get user started')
export const getUserSuccess = createAction<User>('[User] Get user success')
export const getUserError = createAction<string>('[User] Get user error')

export const updateUser = createAction<User>('[User] Update user')

export const setUserPreference = createAction<UserProperty>('[User] Set user preference')
export const setUserPreferenceStarted = createAction('[User] Set user preference started')
export const setUserPreferenceSuccess = createAction<UserProperty>('[User] Set user preference success')
export const setUserPreferenceError = createAction<string>('[User] Set user preference error')

export const updateUserPreference = createAction<UserProperty>('[User] Update user preference')

export const cancelLogout = createAction('[User] Cancel logout')
export const cancelLogoutStarted = createAction('[User] Cancel logout started')
export const cancelLogoutSuccess = createAction('[User] Cancel logout success')
export const cancelLogoutError = createAction<string>('[User] Cancel logout error')

export const triggerLogout = createAction('[User] Trigger logout')
export const triggerLogoutStarted = createAction('[User] Trigger logout started')
export const triggerLogoutSuccess = createAction('[User] Trigger logout success')
export const triggerLogoutError = createAction<string>('[User] Trigger logout error')

export const triggerLogoutNow = createAction('[User] Trigger logout now')
export const triggerLogoutNowStarted = createAction('[User] Trigger logout now started')
export const triggerLogoutNowSuccess = createAction('[User] Trigger logout now success')
export const triggerLogoutNowError = createAction<string>('[User] Trigger logout now error')
