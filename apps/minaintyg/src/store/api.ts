import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { CertificateListItem } from '../schema/certificateList.schema'

export const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: '/api/',
  }),
  tagTypes: ['User'],
  endpoints: (builder) => ({
    getCertificate: builder.query<{ content: CertificateListItem[] }, void>({
      query: () => ({ url: 'certificates', method: 'POST' }),
    }),
  }),
})

export const { useGetCertificateQuery } = api
