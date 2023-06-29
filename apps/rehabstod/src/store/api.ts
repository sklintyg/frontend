import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { Link, Mottagning, Ping, User, UserPreferences, Vardenhet } from '../schemas'
import { Config } from '../schemas/configSchema'
import { ErrorData } from '../schemas/errorSchema'
import { Lakare } from '../schemas/lakareSchema'
import { Patient } from '../schemas/patientSchema'
import {
  OccupationType,
  RekoStatusType,
  SickLeaveFilter,
  SickLeaveInfo,
  SickLeaveSummary,
  UnansweredCommunicationFilterType,
} from '../schemas/sickLeaveSchema'
import { CreateSickleaveDTO, TestDataOptionsDTO } from '../schemas/testabilitySchema'
import { getCookie } from '../utils/cookies'
import { DiagnosKapitel } from '../schemas/diagnosisSchema'
import { LUCertificatesFilter, LUCertificatesInfo } from '../schemas/luCertificatesSchema'
import { AGCertificatesInfo } from '../schemas/agCertificatesSchema'

export const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: '/api/',
    prepareHeaders: (headers) => {
      if (getCookie('XSRF-TOKEN')) {
        headers.set('X-XSRF-TOKEN', getCookie('XSRF-TOKEN'))
      }
      return headers
    },
  }),
  tagTypes: ['User', 'SickLeavesFilter', 'SickLeaveSummary', 'SickLeaves', 'SickLeavePatient', 'LUCertificates', 'LUCertificatesPatient'],
  endpoints: (builder) => ({
    getUser: builder.query<User, void>({
      query: () => 'user',
      providesTags: ['User'],
    }),
    getConfig: builder.query<Config, void>({
      query: () => 'config',
    }),
    changeUnit: builder.mutation<User, { vardenhet: Vardenhet | Mottagning }>({
      query: ({ vardenhet }) => ({
        url: 'user/andraenhet',
        method: 'POST',
        body: { id: vardenhet.id },
      }),
      invalidatesTags: ['SickLeavesFilter', 'SickLeaveSummary', 'User'],
      async onQueryStarted({ vardenhet }, { dispatch, queryFulfilled }) {
        dispatch(
          api.util.updateQueryData('getUser', undefined, (draft) =>
            Object.assign(draft, {
              valdVardenhet: vardenhet,
            })
          )
        )
        try {
          await queryFulfilled
        } catch {
          dispatch(api.util.invalidateTags(['User']))
        }
      },
    }),
    giveConsent: builder.mutation<User, { pdlConsentGiven: boolean }>({
      query: ({ pdlConsentGiven }) => ({
        url: 'user/giveconsent',
        method: 'POST',
        body: { consentGiven: pdlConsentGiven },
      }),
      invalidatesTags: ['User'],
    }),
    updateUserPreferences: builder.mutation<UserPreferences, UserPreferences>({
      query: (preferences) => ({
        url: 'user/preferences',
        method: 'POST',
        body: preferences,
      }),
      transformResponse: (response: { content: UserPreferences }) => response.content,
      invalidatesTags: ['User'],
    }),
    fakeLogout: builder.mutation<void, void>({
      query: () => ({
        url: '../logout',
        method: 'POST',
        headers: {
          'content-type': 'application/x-www-form-urlencoded',
        },
      }),
      invalidatesTags: ['User'],
    }),
    getSessionPing: builder.query<Ping, void>({
      query: () => 'session-auth-check/ping',
    }),
    getLinks: builder.query<Record<string, Link | undefined>, void>({
      query: () => 'config/links',
    }),
    getSickLeaves: builder.query<{ content: SickLeaveInfo[]; unansweredCommunicationError: boolean; srsError: boolean }, SickLeaveFilter>({
      query: (request) => ({
        url: 'sickleaves/active',
        method: 'POST',
        body: request,
        providesTags: ['SickLeaves'],
      }),
      providesTags: ['SickLeaves'],
    }),
    getLUCertificates: builder.query<LUCertificatesInfo, LUCertificatesFilter>({
      query: (request) => ({
        url: 'certificate/lu/unit',
        method: 'POST',
        body: request,
      }),
      providesTags: ['LUCertificates'],
    }),
    getPopulatedFilters: builder.query<
      {
        activeDoctors: Lakare[]
        allDiagnosisChapters: DiagnosKapitel[]
        enabledDiagnosisChapters: DiagnosKapitel[]
        nbrOfSickLeaves: number
        rekoStatusTypes: RekoStatusType[]
        occupationTypes: OccupationType[]
        unansweredCommunicationFilterTypes: UnansweredCommunicationFilterType[]
        srsActivated: boolean
      },
      void
    >({
      query: () => ({
        url: 'sickleaves/filters',
      }),
      providesTags: ['SickLeavesFilter'],
    }),
    getPopulatedFiltersForLU: builder.query<
      {
        doctors: Lakare[]
        allDiagnosisChapters: DiagnosKapitel[]
      },
      void
    >({
      keepUnusedDataFor: 0,
      query: () => 'lu/filters',
    }),
    getSickLeavesSummary: builder.query<SickLeaveSummary, void>({
      query: () => ({
        url: 'sickleaves/summary',
      }),
      providesTags: ['SickLeaveSummary'],
    }),
    getSickLeavePatient: builder.query<Patient, { encryptedPatientId: string }>({
      keepUnusedDataFor: 0,
      query: (encryptedPatientId) => ({
        url: 'sjukfall/patient',
        method: 'POST',
        body: encryptedPatientId,
      }),
      providesTags: ['SickLeavePatient'],
    }),
    getLUCertificatesForPatient: builder.query<LUCertificatesInfo, { encryptedPatientId: string }>({
      keepUnusedDataFor: 0,
      query: (request) => ({
        url: 'certificate/lu/person',
        method: 'POST',
        body: request,
      }),
      providesTags: ['LUCertificatesPatient'],
    }),
    getAGCertificatesForPatient: builder.query<AGCertificatesInfo, { personId: string }>({
      keepUnusedDataFor: 0,
      query: (request) => ({
        url: 'certificate/ag/person',
        method: 'POST',
        body: request,
      }),
      providesTags: ['LUCertificatesPatient'],
    }),
    createDefaultTestData: builder.mutation<string, void>({
      query: () => ({
        url: '/testability/createDefault',
        method: 'POST',
      }),
      transformResponse: (response: { content: string }) => response.content,
    }),
    getTestDataOptions: builder.query<TestDataOptionsDTO, void>({
      query: () => ({
        url: '/testability/testDataOptions',
        method: 'GET',
      }),
    }),
    createSickLeave: builder.mutation<string, CreateSickleaveDTO>({
      query: (request) => ({
        url: '/testability/createSickLeave',
        method: 'POST',
        body: request,
      }),
      transformResponse: (response: { content: string }) => response.content,
    }),
    addVardenhet: builder.mutation<string[], { patientId: string; vardenhetId: string }>({
      query: ({ patientId, vardenhetId }) => ({
        url: 'sjukfall/patient/addVardenhet',
        method: 'POST',
        body: { patientId, vardenhetId },
      }),
      invalidatesTags: ['SickLeavePatient'],
    }),
    addVardgivare: builder.mutation<string[], { patientId: string; vardgivareId: string }>({
      query: ({ patientId, vardgivareId }) => ({
        url: 'sjukfall/patient/addVardgivare',
        method: 'POST',
        body: { patientId, vardgivareId },
      }),
      invalidatesTags: ['SickLeavePatient'],
    }),
    giveSjfConsent: builder.mutation<
      { registeredBy: string; responseCode: string; responseMessage: string },
      { days: number; onlyCurrentUser: boolean; patientId: string; encryptedPatientId: string }
    >({
      query: ({ days, onlyCurrentUser, patientId }) => ({
        url: 'consent',
        method: 'POST',
        body: { days, onlyCurrentUser, patientId },
      }),
      async onQueryStarted({ encryptedPatientId }, { dispatch, queryFulfilled }) {
        try {
          const {
            data: { responseCode },
          } = await queryFulfilled
          dispatch(
            api.util.updateQueryData('getSickLeavePatient', { encryptedPatientId }, (draft) =>
              Object.assign(draft, {
                sjfMetaData: {
                  ...(draft.sjfMetaData ?? {}),
                  samtyckeFinns: responseCode === 'OK',
                },
              })
            )
          )
        } catch {
          dispatch(api.util.invalidateTags(['SickLeavePatient']))
        }
      },
    }),
    setRekoStatus: builder.mutation<
      void,
      { patientId: string; status: RekoStatusType; sickLeaveTimestamp: string; filter: SickLeaveFilter }
    >({
      query: ({ patientId, status, sickLeaveTimestamp }) => ({
        url: 'reko',
        method: 'POST',
        body: { patientId, statusId: status.id, sickLeaveTimestamp },
      }),
      async onQueryStarted({ patientId, status, filter }, { dispatch, queryFulfilled }) {
        dispatch(
          api.util.updateQueryData('getSickLeaves', filter, (draft) => {
            const index = draft.content.findIndex((sickLeave) => sickLeave.patient.id === patientId)
            if (index !== -1) {
              // eslint-disable-next-line no-param-reassign
              draft.content[index].rekoStatus = { status }
            }
          })
        )
        try {
          await queryFulfilled
        } catch {
          dispatch(api.util.invalidateTags(['User']))
        }
      },
    }),
    logError: builder.mutation<void, { errorData: ErrorData }>({
      query: (errorData) => ({
        url: 'log/error',
        method: 'POST',
        body: errorData,
      }),
    }),
    getDoctorsForLUCertificates: builder.query<{ doctors: Lakare[] }, void>({
      query: () => ({
        url: 'certificate/lu/doctors',
        method: 'GET',
      }),
    }),
  }),
})

export const {
  useAddVardenhetMutation,
  useAddVardgivareMutation,
  useChangeUnitMutation,
  useCreateDefaultTestDataMutation,
  useCreateSickLeaveMutation,
  useFakeLogoutMutation,
  useGetConfigQuery,
  useGetLinksQuery,
  useGetPopulatedFiltersQuery,
  useGetSessionPingQuery,
  useGetSickLeavePatientQuery,
  useGetLUCertificatesForPatientQuery,
  useGetAGCertificatesForPatientQuery,
  useGetSickLeavesQuery,
  useGetSickLeavesSummaryQuery,
  useGetTestDataOptionsQuery,
  useGetUserQuery,
  useGiveConsentMutation,
  useGiveSjfConsentMutation,
  useLazyGetSickLeavesQuery,
  useLogErrorMutation,
  useLazyGetLUCertificatesQuery,
  useSetRekoStatusMutation,
  useUpdateUserPreferencesMutation,
  useGetDoctorsForLUCertificatesQuery,
  useGetPopulatedFiltersForLUQuery,
} = api
