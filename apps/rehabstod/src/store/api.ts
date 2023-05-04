import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

import { Link, Mottagning, Ping, User, UserPreferences, Vardenhet, Vardgivare } from '../schemas'
import { Lakare } from '../schemas/lakareSchema'
import { Patient } from '../schemas/patientSchema'
import { DiagnosKapitel, SickLeaveFilter, SickLeaveInfo, SickLeaveSummary } from '../schemas/sickLeaveSchema'
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
    changeUnit: builder.mutation<User, { vardgivare: Vardgivare; vardenhet: Vardenhet | Mottagning }>({
      query: ({ vardenhet }) => ({
        url: 'user/andraenhet',
        method: 'POST',
        body: { id: vardenhet.id },
      }),
      invalidatesTags: ['SickLeavesFilter', 'SickLeaveSummary'],
      async onQueryStarted({ vardgivare, vardenhet }, { dispatch, queryFulfilled }) {
        dispatch(
          api.util.updateQueryData('getUser', undefined, (draft) =>
            Object.assign(draft, {
              valdVardgivare: vardgivare,
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
      invalidatesTags: ['SickLeaveSummary', 'SickLeavesFilter', 'SickLeaves', 'SickLeavePatient'],
      async onQueryStarted(preferences, { dispatch, queryFulfilled }) {
        dispatch(
          api.util.updateQueryData('getUser', undefined, (draft) =>
            Object.assign(draft, {
              preferences,
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
      { activeDoctors: Lakare[]; allDiagnosisChapters: DiagnosKapitel[]; enabledDiagnosisChapters: DiagnosKapitel[] },
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
    getSickLeavePatient: builder.query<Patient, { patientId: string }>({
      query: ({ patientId }) => ({
        url: 'sjukfall/patient',
        method: 'POST',
        body: { patientId },
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
    addVardenhet: builder.mutation<string[], { patientId: string; vardenhetId: string }>({
      query: ({ patientId, vardenhetId }) => ({
        url: 'sjukfall/patient/addVardenhet',
        method: 'POST',
        body: { patientId, vardenhetId },
      }),
      invalidatesTags: ['SickLeavePatient'],
    }),
  }),
})

export const {
  useChangeUnitMutation,
  useFakeLogoutMutation,
  useGetLinksQuery,
  useGetPopulatedFiltersQuery,
  useGetSessionPingQuery,
  useGetSickLeavePatientQuery,
  useLazyGetSickLeavesQuery,
  useUpdateUserPreferencesMutation,
  useGetUserQuery,
  useCreateDefaultTestDataMutation,
  useGetSickLeavesSummaryQuery,
  useGiveConsentMutation,
  useAddVardenhetMutation,
} = api
