import { RootState } from '../store'
import { CertificateType, CreateCertificate, MockUser } from './welcomeReducer'
import { Patient } from '@frontend/common'

export const getAvailableCertificateTypes = () => (state: RootState): CertificateType[] | null => state.ui.uiWelcome.types

export const getAvailablePatients = () => (state: RootState): Patient[] => state.ui.uiWelcome.patients

export const getCreateCertificate = () => (state: RootState): CreateCertificate => state.ui.uiWelcome.createCertificate

export const getCertificateId = () => (state: RootState): string => state.ui.uiWelcome.createdCertificateId

export const getAvailableUsers = () => (state: RootState): MockUser[] => state.ui.uiWelcome.users

export const getNavigateToCertificate = () => (state: RootState): boolean => state.ui.uiWelcome.navigateToCertificate
