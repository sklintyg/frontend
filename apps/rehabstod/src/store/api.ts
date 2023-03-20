import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { Link } from './types/link'
import { User } from './types/user'

export const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({ baseUrl: '/api/' }),
  endpoints: (builder) => ({
    getLinks: builder.query<Record<string, Link | undefined>, void>({
      query: () => 'config/links',
    }),
    getUser: builder.query<Record<string, User>, void>({
      query: () => 'user',
    }),
  }),
})

export const { useGetLinksQuery, useGetUserQuery } = api
