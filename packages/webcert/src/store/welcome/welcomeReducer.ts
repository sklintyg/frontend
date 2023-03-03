import { Patient } from '@frontend/common'
import { createReducer } from '@reduxjs/toolkit'
import { mockUserData } from './mockUserData'
import {
  clearWelcome,
  updateCertificateId,
  updateCertificateTypes,
  updateCreateCertificate,
  updateIntegrationParameters,
  updateIntegrationParametersDisablers,
  updateNavigateToCertificate,
  updatePatients,
} from './welcomeActions'

export interface CertificateType {
  type: string
  internalType: string
  name: string
  versions: string[]
  statuses: string[]
  fillType: string[]
}

export interface IntegrationParameters {
  firstName: string
  lastName: string
  middleName: string
  alternatePatientSSN: string
  ref: string
  coherentJournaling: boolean
  inactiveUnit: boolean
  unitId: string
  address: string
  city: string
  zipcode: string
  allowCopy: boolean
  responsibleHospName: string
  launchId?: string
}

export interface IntegrationParametersDisablers {
  firstName: boolean
  lastName: boolean
  middleName: boolean
  address: boolean
  city: boolean
  zipcode: boolean
  launchId: boolean
}

export interface CreateCertificate {
  certificateType: string
  certificateTypeVersion: string
  patientId: string
  personId: string
  unitId: string
  status: string
  fillType: string
}

export interface MockUser {
  hsaId: string
  forNamn: string
  efterNamn: string
  enhetId: string
  legitimeradeYrkesgrupper?: string[]
}

export interface WelcomeState {
  types: CertificateType[] | null
  patients: Patient[]
  createCertificate: CreateCertificate
  createdCertificateId: string
  users: MockUser[]
  navigateToCertificate: boolean
  integrationParameters: IntegrationParameters
  integrationParametersDisablers: IntegrationParametersDisablers
}

const DEFAULT_CERTIFICATE_TYPE = 'lisjp'

const initialState: WelcomeState = {
  types: null,
  patients: [],
  createCertificate: {
    certificateType: DEFAULT_CERTIFICATE_TYPE,
    certificateTypeVersion: '',
    patientId: '',
    personId: '',
    unitId: '',
    status: '',
    fillType: '',
  },
  createdCertificateId: '',
  users: [...mockUserData],
  navigateToCertificate: false,
  integrationParameters: {
    firstName: 'Nils',
    lastName: 'Nygren',
    middleName: 'Nisse',
    alternatePatientSSN: '',
    ref: '',
    coherentJournaling: true,
    inactiveUnit: false,
    unitId: '',
    address: 'Nygatan 14',
    city: 'Nyberga',
    zipcode: '555 66',
    allowCopy: true,
    responsibleHospName: '',
    launchId: '97f279ba-7d2b-4b0a-8665-7adde08f26f4',
  },
  integrationParametersDisablers: {
    firstName: true,
    lastName: true,
    middleName: true,
    address: true,
    city: true,
    zipcode: true,
    launchId: true,
  },
}

const utilsReducer = createReducer(initialState, (builder) =>
  builder
    .addCase(updateCertificateTypes, (state, action) => {
      state.types = action.payload
    })
    .addCase(updatePatients, (state, action) => {
      state.patients = action.payload
    })
    .addCase(updateCreateCertificate, (state, action) => {
      state.createCertificate = action.payload
    })
    .addCase(updateCertificateId, (state, action) => {
      state.createdCertificateId = action.payload
    })
    .addCase(clearWelcome, (state) => {
      state.navigateToCertificate = false
      state.createdCertificateId = ''
      state.createCertificate = {
        certificateType: DEFAULT_CERTIFICATE_TYPE,
        certificateTypeVersion: '',
        patientId: '',
        personId: '',
        unitId: '',
        status: '',
        fillType: '',
      }
    })
    .addCase(updateNavigateToCertificate, (state, action) => {
      state.navigateToCertificate = action.payload
    })
    .addCase(updateIntegrationParameters, (state, action) => {
      state.integrationParameters = action.payload
    })
    .addCase(updateIntegrationParametersDisablers, (state, action) => {
      state.integrationParametersDisablers = action.payload
    })
)

export default utilsReducer
