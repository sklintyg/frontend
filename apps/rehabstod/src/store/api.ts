import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { Link, Mottagning, Ping, User, UserPreferences, Vardenhet } from '../schemas'
import { Config } from '../schemas/configSchema'
import { Lakare } from '../schemas/lakareSchema'
import { Patient } from '../schemas/patientSchema'
import { DiagnosKapitel, SickLeaveFilter, SickLeaveInfo, SickLeaveSummary } from '../schemas/sickLeaveSchema'
import { CreateSickleaveDTO, TestDataOptionsDTO } from '../schemas/testabilitySchema'
import { getCookie } from '../utils/cookies'

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
  tagTypes: ['User', 'SickLeavesFilter', 'SickLeaveSummary', 'SickLeaves', 'SickLeavePatient'],
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
    getSickLeaves: builder.query<SickLeaveInfo[], SickLeaveFilter>({
      query: (request) => ({
        url: 'sickleaves/active',
        method: 'POST',
        body: request,
        providesTags: ['SickLeaves'],
      }),
      transformResponse: (response: { content: SickLeaveInfo[] }) => response.content,
      providesTags: ['SickLeaves'],
    }),
    getPopulatedFilters: builder.query<
      {
        activeDoctors: Lakare[]
        allDiagnosisChapters: DiagnosKapitel[]
        enabledDiagnosisChapters: DiagnosKapitel[]
        nbrOfSickLeaves: number
      },
      void
    >({
      query: () => ({
        url: 'sickleaves/filters',
      }),
      providesTags: ['SickLeavesFilter'],
    }),
    getSickLeavesSummary: builder.query<SickLeaveSummary, void>({
      query: () => ({
        url: 'sickleaves/summary',
      }),
      providesTags: ['SickLeaveSummary'],
    }),
    getSickLeavePatient: builder.query<Patient, { encryptedPatientId: string }>({
      query: ({ encryptedPatientId }) => ({
        url: 'sjukfall/patient',
        method: 'POST',
        body: { encryptedPatientId },
      }),
      providesTags: ['SickLeavePatient'],
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
  useGetSickLeavesQuery,
  useGetSickLeavesSummaryQuery,
  useGetTestDataOptionsQuery,
  useGetUserQuery,
  useGiveConsentMutation,
  useGiveSjfConsentMutation,
  useLazyGetSickLeavesQuery,
  useUpdateUserPreferencesMutation,
} = api
