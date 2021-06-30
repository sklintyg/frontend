import { createReducer } from '@reduxjs/toolkit'
import {
  clearWelcome,
  updateCertificateTypes,
  updateCreateCertificate,
  updateCertificateId,
  updateNavigateToCertificate,
  updatePatients,
} from './welcomeActions'
import { Patient } from '@frontend/common'
import { mockUserData } from './mockUserData'

export interface CertificateType {
  type: string
  internalType: string
  name: string
  versions: string[]
  statuses: string[]
  fillType: string[]
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

interface WelcomeState {
  types: CertificateType[] | null
  patients: Patient[]
  createCertificate: CreateCertificate
  createdCertificateId: string
  users: MockUser[]
  navigateToCertificate: boolean
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
)

export default utilsReducer
