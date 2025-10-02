import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import type { MedarbetarUppdrag, Person } from '../schemas/hsa'

export const hsaApi = createApi({
  reducerPath: 'hsa-api',
  baseQuery: fetchBaseQuery({ baseUrl: '/api/testability' }),
  endpoints: (builder) => ({
    getMedarbetarUppdrag: builder.query<MedarbetarUppdrag[], void>({
      query: () => 'commissions',
    }),
    getPerson: builder.query<Person[], void>({
      query: () => 'persons',
    }),
  }),
})

export const { useGetMedarbetarUppdragQuery, useGetPersonQuery } = hsaApi
