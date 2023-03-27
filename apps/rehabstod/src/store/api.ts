import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { Link } from './types/link'

export const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({ baseUrl: '/api/' }),
  endpoints: (builder) => ({
    getLinks: builder.query<Record<string, Link | undefined>, void>({
      query: () => 'config/links',
    }),
  }),
})

export const { useGetLinksQuery } = api
