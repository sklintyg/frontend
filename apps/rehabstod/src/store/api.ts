import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { getCookie } from '../utils/cookies'
import { Link } from './types/link'
import { Ping } from './types/ping'
import { SickLeaveInfo } from './types/sickLeave'
import { User, Vardenheter, Vardgivare } from './types/user'

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
  tagTypes: ['User', 'Links'],
  endpoints: (builder) => ({
    getUser: builder.query<User, void>({
      query: () => 'user',
      providesTags: ['User'],
    }),
    changeUnit: builder.mutation<User, { vardgivare: Vardgivare; vardenhet: Vardenheter }>({
      query: ({ vardenhet }) => ({
        url: 'user/andraenhet',
        method: 'POST',
        body: { id: vardenhet.id },
      }),
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
    getSessionPing: builder.query<Ping, void>({
      query: () => 'session-auth-check/ping',
    }),
    getLinks: builder.query<Record<string, Link | undefined>, void>({
      query: () => 'config/links',
      providesTags: ['Links'],
    }),
    getSickLeaves: builder.mutation<SickLeaveInfo[], void>({
      query: () => ({
        url: 'sickleaves/active',
        method: 'POST',
      }),
      transformResponse: (response: { content: SickLeaveInfo[] }) => response.content,
    }),
  }),
})

export const { useGetSessionPingQuery, useGetLinksQuery, useGetUserQuery, useChangeUnitMutation, useGetSickLeavesMutation } = api
