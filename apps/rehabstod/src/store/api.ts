import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { Link, Ping, User, UserPreferences, Vardenhet, Vardgivare } from '../schemas'
import { Lakare } from '../schemas/lakareSchema'
import { Patient } from '../schemas/patientSchema'
import { DiagnosKapitel, SickLeaveFilter, SickLeaveInfo } from '../schemas/sickLeaveSchema'
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
  tagTypes: ['User', 'SickLeavesFilter'],
  endpoints: (builder) => ({
    getUser: builder.query<User, void>({
      query: () => 'user',
      providesTags: ['User'],
    }),
    changeUnit: builder.mutation<User, { vardgivare: Vardgivare; vardenhet: Vardenhet }>({
      query: ({ vardenhet }) => ({
        url: 'user/andraenhet',
        method: 'POST',
        body: { id: vardenhet.id },
      }),
      invalidatesTags: ['SickLeavesFilter'],
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
    updateUserPreferences: builder.mutation<UserPreferences, { standardenhet: string }>({
      query: ({ standardenhet }) => ({
        url: 'user/preferences',
        method: 'POST',
        body: { standardenhet },
      }),
      transformResponse: (response: { content: UserPreferences }) => response.content,
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
    getSickLeaves: builder.mutation<SickLeaveInfo[], SickLeaveFilter>({
      query: (request) => ({
        url: 'sickleaves/active',
        method: 'POST',
        body: request,
      }),
      transformResponse: (response: { content: SickLeaveInfo[] }) => response.content,
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
    getSickLeavePatient: builder.query<Patient, { patientId: string }>({
      query: ({ patientId }) => ({
        url: 'sjukfall/patient',
        method: 'POST',
        body: { patientId },
      }),
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
  useGetSickLeavesMutation,
  useUpdateUserPreferencesMutation,
  useGetUserQuery,
} = api
