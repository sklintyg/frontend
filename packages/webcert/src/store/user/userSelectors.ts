import { RootState } from '../store'
import { User } from '@frontend/common'

export const getUser = (state: RootState): User | null => state.ui.uiUser.user

export const getUserPreference = (key: string) => (state: RootState): string | undefined => state.ui.uiUser.user?.preferences?.[key]
