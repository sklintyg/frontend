import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { CertificateListItem } from '../schema/certificateList.schema'
import { CertificateFilterOptions, CertificateSelectedOptions } from '../schema/certificateListFilter.schema'

export const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: '/api/',
  }),
  tagTypes: ['User'],
  endpoints: (builder) => ({
    getCertificates: builder.query<{ content: CertificateListItem[] }, Partial<CertificateSelectedOptions>>({
      query: (body) => ({ url: 'certificates', method: 'POST', body }),
    }),
    getCertificatesFilter: builder.query<CertificateFilterOptions, void>({
      query: () => 'filter-certificate',
    }),
  }),
})

export const { useGetCertificatesQuery, useGetCertificatesFilterQuery } = api
