import { getCookie } from '@frontend/utils'
import { isAnyOf, isPlainObject } from '@reduxjs/toolkit'
import { createApi, fetchBaseQuery, skipToken } from '@reduxjs/toolkit/query/react'
import type { Link, Mottagning, Ping, User, UserPreferences, Vardenhet } from '../schemas'
import type { Config } from '../schemas/configSchema'
import type { ErrorData } from '../schemas/errorSchema'
import { reset as resetLUFilters } from './slices/luCertificatesFilter.slice'
import { reset as resetSickLeaveFilters } from './slices/sickLeaveFilter.slice'

export const tagType = {
  USER: 'User',
  PATIENT: 'Patient',
  SICKLEAVES: 'SickLeaves',
  REKOSTATUS: 'RekoStatus',
} as const

export const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: '/api/',
    prepareHeaders: (headers) => {
      if (getCookie('XSRF-TOKEN')) {
        headers.set('X-XSRF-TOKEN', getCookie('XSRF-TOKEN') ?? '')
      }
      return headers
    },
  }),
  tagTypes: Object.values<string>(tagType),
  endpoints: (builder) => ({
    getUser: builder.query<User, void>({
      query: () => 'user',
      providesTags: [tagType.USER],
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
      invalidatesTags: [tagType.USER],
      async onQueryStarted({ vardenhet }, { dispatch, queryFulfilled }) {
        dispatch(
          api.util.updateQueryData('getUser', undefined, (draft) =>
            Object.assign(draft, {
              valdVardenhet: vardenhet,
            })
          )
        )
        dispatch(resetLUFilters())
        dispatch(resetSickLeaveFilters())
        try {
          await queryFulfilled
        } catch {
          dispatch(api.util.invalidateTags([tagType.USER]))
        }
      },
    }),
    giveConsent: builder.mutation<User, { pdlConsentGiven: boolean }>({
      query: ({ pdlConsentGiven }) => ({
        url: 'user/giveconsent',
        method: 'POST',
        body: { consentGiven: pdlConsentGiven },
      }),
      invalidatesTags: [tagType.USER],
    }),
    updateUserPreferences: builder.mutation<UserPreferences, UserPreferences>({
      query: (preferences) => ({
        url: 'user/preferences',
        method: 'POST',
        body: preferences,
      }),
      transformResponse: (response: { content: UserPreferences }) => response.content,
      invalidatesTags: [tagType.USER],
    }),
    getSessionPing: builder.query<Ping, void>({
      query: () => 'session-auth-check/ping',
    }),
    getLinks: builder.query<Record<string, Link | undefined>, void>({
      query: () => 'config/links',
    }),

    logError: builder.mutation<void, { errorData: ErrorData }>({
      query: (errorData) => ({
        url: 'log/error',
        method: 'POST',
        body: errorData,
      }),
    }),
  }),
})

const isFulfilledEndpoint = isAnyOf(...Object.values(api.endpoints).map((endpoint) => endpoint.matchFulfilled))
export const isRejectedEndpoint = isAnyOf(...Object.values(api.endpoints).map((endpoint) => endpoint.matchRejected))
const hasResponse = (o: unknown): o is { response: Response } => isPlainObject(o) && 'response' in o && o.response instanceof Response
export const hasRequest = (o: unknown): o is { request: Request } => isPlainObject(o) && 'request' in o && o.request instanceof Request

export function useGetUserQuery() {
  const { data: session } = api.useGetSessionPingQuery()
  return api.useGetUserQuery(session?.authenticated && session?.hasSession ? undefined : skipToken)
}

export const {
  useChangeUnitMutation,
  useGetConfigQuery,
  useGetLinksQuery,
  useGetSessionPingQuery,
  useGiveConsentMutation,
  useLogErrorMutation,
} = api
