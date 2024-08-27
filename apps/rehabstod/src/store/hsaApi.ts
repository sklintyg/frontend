import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import type { MedarbetarUppdrag, Person } from '../schemas/hsa'

export const hsaApi = createApi({
  reducerPath: 'hsa-api',
  baseQuery: fetchBaseQuery({ baseUrl: '/services/api/hsa-api' }),
  endpoints: (builder) => ({
    getMedarbetarUppdrag: builder.query<MedarbetarUppdrag[], void>({
      query: () => 'medarbetaruppdrag',
    }),
    getPerson: builder.query<Person[], void>({
      query: () => 'person',
    }),
  }),
})

export const { useGetMedarbetarUppdragQuery, useGetPersonQuery } = hsaApi
