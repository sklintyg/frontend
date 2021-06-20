import { RootState } from '../store'

export const getAvailableCertificateTypes = () => (state: RootState) => state.ui.uiWelcome.types

export const getAvailablePatients = () => (state: RootState) => state.ui.uiWelcome.patients

export const getCreateCertificate = () => (state: RootState) => state.ui.uiWelcome.createCertificate

export const getCreatedCertificateId = () => (state: RootState) => state.ui.uiWelcome.createdCertificateId

export const getAvailableUsers = () => (state: RootState) => state.ui.uiWelcome.users
