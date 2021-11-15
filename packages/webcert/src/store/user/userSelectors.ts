import { RootState } from '../store'
import { User } from '@frontend/common'

export const getUser = (state: RootState): User | null => state.ui.uiUser.user

export const getUserPreference = (key: string) => (state: RootState): string | undefined => state.ui.uiUser.user?.preferences?.[key]

export const isDoctor = (state: RootState): boolean | null =>
  state.ui.uiUser.user && state.ui.uiUser.user.role.toLowerCase().includes('läkare')
