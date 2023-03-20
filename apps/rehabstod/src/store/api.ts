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
    getUser: builder.query<User, void>({
      query: () => 'user',
    }),
    setUnit: builder.mutation<User, { id: string }>({
      query: ({ id }) => ({
        url: `user/andraenhet`,
        method: 'POST',
        body: { id },
      }),
    }),
  }),
})

export const { useGetLinksQuery, useGetUserQuery } = api
