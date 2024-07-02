/* eslint-disable no-param-reassign */
import type { PayloadAction } from '@reduxjs/toolkit'
import { createSlice } from '@reduxjs/toolkit'

export interface WelcomeState {
  selectedLogin: string | null
  selectedUnit: string | null
  selectedFilter: string
  freeText: string | null
  careProviderId: string
  careUnitId: string
  patientId: string
  doctorId: string
  fromDays: string
  toDays: string
  primaryDiagnosisCode: string
  secondDiagnosisCode: string | null
  thirdDiagnosisCode: string | null
  workCapacities: string
  occupation: string
  relationKod: string | null
  relationsId: string | null
  isSend: boolean
  isRevoked: boolean
}

const initialState = {
  selectedFilter: 'all',
  careProviderId: 'TSTNMT2321000156-ALFA',
  careUnitId: 'TSTNMT2321000156-ALMC',
  patientId: '194011306125',
  doctorId: 'TSTNMT2321000156-DRAA',
  fromDays: '-10',
  toDays: '10',
  primaryDiagnosisCode: 'A010',
  workCapacities: 'EN_FJARDEDEL',
  occupation: 'NUVARANDE_ARBETE',
  relationsId: null,
  relationKod: null,
  isSend: false,
  isRevoked: false,
} as WelcomeState

const welcomeSlice = createSlice({
  name: 'welcome',
  initialState,
  reducers: {
    selectLogin(state, { payload }: PayloadAction<string>) {
      state.selectedLogin = payload
    },
    selectUnit(state, { payload }: PayloadAction<string>) {
      state.selectedUnit = payload
    },
    selectFilter(state, { payload }: PayloadAction<string>) {
      state.selectedFilter = payload
    },
    updateFreetext(state, { payload }: PayloadAction<string | null>) {
      state.freeText = payload
    },
    setCareProviderId(state, { payload }: PayloadAction<string>) {
      state.careProviderId = payload
    },
    setCareUnitId(state, { payload }: PayloadAction<string>) {
      state.careUnitId = payload
    },
    setPatientId(state, { payload }: PayloadAction<string>) {
      state.patientId = payload
    },
    setDoctorId(state, { payload }: PayloadAction<string>) {
      state.doctorId = payload
    },
    setFromDays(state, { payload }: PayloadAction<string>) {
      state.fromDays = payload
    },
    setToDays(state, { payload }: PayloadAction<string>) {
      state.toDays = payload
    },
    setPrimaryDiagnosisCode(state, { payload }: PayloadAction<string>) {
      state.primaryDiagnosisCode = payload
    },
    setSecondDiagnosisCode(state, { payload }: PayloadAction<string>) {
      state.secondDiagnosisCode = payload
    },
    setThirdDiagnosisCode(state, { payload }: PayloadAction<string>) {
      state.thirdDiagnosisCode = payload
    },
    setWorkCapacities(state, { payload }: PayloadAction<string>) {
      state.workCapacities = payload
    },
    setOccupation(state, { payload }: PayloadAction<string>) {
      state.occupation = payload
    },
    setRelationKod(state, { payload }: PayloadAction<string>) {
      state.relationKod = payload
    },
    setRelationsId(state, { payload }: PayloadAction<string>) {
      state.relationsId = payload
    },
    setIsSend(state, { payload }: PayloadAction<boolean>) {
      state.isSend = payload
    },
    setIsRevoked(state, { payload }: PayloadAction<boolean>) {
      state.isRevoked = payload
    },
  },
})

export const {
  selectLogin,
  selectUnit,
  selectFilter,
  updateFreetext,
  setCareProviderId,
  setCareUnitId,
  setPatientId,
  setDoctorId,
  setFromDays,
  setToDays,
  setPrimaryDiagnosisCode,
  setSecondDiagnosisCode,
  setThirdDiagnosisCode,
  setWorkCapacities,
  setOccupation,
  setRelationKod,
  setRelationsId,
  setIsSend,
  setIsRevoked,
} = welcomeSlice.actions
export const { name: welcomeReducerPath, reducer: welcomeReducer } = welcomeSlice
