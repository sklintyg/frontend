import { Patient } from '../../types'
import { RootState } from '../store'
import { CertificateType, CreateCertificate, IntegrationParameters, IntegrationParametersDisablers, MockUser } from './welcomeReducer'

export const getAvailableCertificateTypes =
  () =>
  (state: RootState): CertificateType[] | null =>
    state.ui.uiWelcome.types

export const getAvailablePatients =
  () =>
  (state: RootState): Patient[] =>
    state.ui.uiWelcome.patients

export const getCreateCertificate =
  () =>
  (state: RootState): CreateCertificate =>
    state.ui.uiWelcome.createCertificate

export const getCertificateId =
  () =>
  (state: RootState): string =>
    state.ui.uiWelcome.createdCertificateId

export const getAvailableUsers =
  () =>
  (state: RootState): MockUser[] =>
    state.ui.uiWelcome.users

export const getNavigateToCertificate =
  () =>
  (state: RootState): boolean =>
    state.ui.uiWelcome.navigateToCertificate

export const getIntegrationParameters =
  () =>
  (state: RootState): IntegrationParameters =>
    state.ui.uiWelcome.integrationParameters

export const getIntegrationParametersDisablers =
  () =>
  (state: RootState): IntegrationParametersDisablers =>
    state.ui.uiWelcome.integrationParametersDisablers
