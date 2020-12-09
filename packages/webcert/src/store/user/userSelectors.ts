import { RootState } from '../store'

export const getIsUserLoggedIn = (state: RootState) => state.ui.uiUser.userLoggedIn

export const getUser = (state: RootState) => state.ui.uiUser.user

export const getUserPreference = (key: string) => (state: RootState) => state.ui.uiUser.user?.preferences?.[key]
