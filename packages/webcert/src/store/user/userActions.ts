import { createAction } from '@reduxjs/toolkit'
import { User } from '@frontend/common'
import { LoginUserQuery, RedirectAction, LoginUserSuccess } from './userReducer'

export const loginUser = createAction<LoginUserQuery>('[User] Login user')
export const loginUserStarted = createAction('[User] Login user started')
export const loginUserSuccess = createAction<LoginUserSuccess>('[User] Login user success')
export const loginUserError = createAction('[User] Login user error')
export const loginUserCompleted = createAction('[User] Login user completed')

export const getUser = createAction('[User] Get user')
export const getUserStarted = createAction('[User] Get user started')
export const getUserSuccess = createAction<User>('[User] Get user success')
export const getUserError = createAction<string>('[User] Get user error')
export const getUserCompleted = createAction('[User] Get user completed')

export const updateUser = createAction<User>('[User] Update user')

export const updateRedirect = createAction<RedirectAction>('[User] Update redirect')
export const clearRedirect = createAction('[User] Clear redirect')
