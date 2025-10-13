import type { Patient } from '../../types'
import type { RootState } from '../reducer'
import type { CertificateType, CreateCertificate, IntegrationParameters, IntegrationParametersDisablers } from './welcomeReducer'

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
