import { createReducer } from '@reduxjs/toolkit'
import { updateCertificateTypes, updateCreateCertificate, updateCreatedCertificateId, updatePatients } from './welcomeActions'
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
}

const initialState: WelcomeState = {
  types: null,
  patients: [],
  createCertificate: {
    certificateType: 'lisjp',
    certificateTypeVersion: '',
    patientId: '',
    personId: '',
    unitId: '',
    status: '',
    fillType: '',
  },
  createdCertificateId: '',
  users: [...mockUserData],
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
    .addCase(updateCreatedCertificateId, (state, action) => {
      state.createdCertificateId = action.payload
    })
)

export default utilsReducer
