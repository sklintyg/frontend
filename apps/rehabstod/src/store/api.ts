import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { Link, Ping, User, Vardenhet, Vardgivare } from '../schemas'
import { getCookie } from '../utils/cookies'
import { ActiveSickLeavesRequest, PopulateFiltersResponse, SickLeaveInfo } from './types/sickLeave'

export const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: '/api/',
    prepareHeaders: (headers, { type }) => {
      if (type === 'mutation' && getCookie('XSRF-TOKEN')) {
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
            Object.assign(draft, { valdVardgivare: vardgivare, valdVardenhet: vardenhet })
          )
        )
        try {
          await queryFulfilled
        } catch {
          dispatch(api.util.invalidateTags(['User']))
        }
      },
    }),
    updateUserPreferences: builder.mutation<User, { valdVardgivare: string; valdVardenhet: string }>({
      query: ({ valdVardgivare, valdVardenhet }) => ({
        url: 'user/preferences',
        method: 'PUT',
        body: { valdVardgivare, valdVardenhet },
      }),
      invalidatesTags: ['SickLeavesFilter', 'User'],
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
    getSickLeaves: builder.mutation<SickLeaveInfo[], ActiveSickLeavesRequest>({
      query: (request) => ({
        url: 'sickleaves/active',
        method: 'POST',
        body: request,
      }),
      transformResponse: (response: { content: SickLeaveInfo[] }) => response.content,
    }),
    getPopulatedFilters: builder.query<PopulateFiltersResponse, void>({
      query: () => ({
        url: 'sickleaves/filters',
      }),
      providesTags: ['SickLeavesFilter'],
    }),
  }),
})

export const {
  useGetSessionPingQuery,
  useGetLinksQuery,
  useGetUserQuery,
  useGetPopulatedFiltersQuery,
  useChangeUnitMutation,
  useGetSickLeavesMutation,
  useFakeLogoutMutation,
  useUpdateUserPreferencesMutation,
} = api
