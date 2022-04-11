import { RootState } from '../store'
import { CertificateType, ResourceLink, User } from '@frontend/common'

export const getUser = (state: RootState): User | null => state.ui.uiUser.user

export const getUserPreference = (key: string) => (state: RootState): string | undefined => state.ui.uiUser.user?.preferences?.[key]

export const isDoctor = (state: RootState): boolean | null =>
  state.ui.uiUser.user && state.ui.uiUser.user.role.toLowerCase().includes('läkare')

export const isCareAdministrator = (state: RootState): boolean | undefined =>
  state.ui.uiUser.user?.role.toLowerCase().includes('vårdadministratör')

export const selectIsLoadingUser = (state: RootState): boolean => state.ui.uiUser.isLoadingUser

export const getUserResourceLinks = (state: RootState): ResourceLink[] => state.ui.uiUser.links

export const selectCertificateTypes = (state: RootState): CertificateType[] => state.ui.uiUser.certificateTypes
