import { getCookie } from '@frontend/utils'
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { Certificate, CertificateListResponse, CertificateResponse } from '../schema/certificate.schema'
import { CertificateFilterOptions } from '../schema/certificateListFilter.schema'
import { User } from '../schema/user.schema'
import { CertificateFilterState } from './slice/certificateFilter.slice'

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
  tagTypes: ['User'],
  endpoints: (builder) => ({
    getUser: builder.query<User, void>({
      query: () => 'user',
      providesTags: ['User'],
    }),
    getCertificates: builder.query<CertificateListResponse, CertificateFilterState>({
      query: (body) => ({
        url: 'certificate',
        method: 'POST',
        body: Object.fromEntries(Object.entries(body).map(([key, value]) => [key, [value]])),
      }),
    }),
    getCertificatesFilter: builder.query<CertificateFilterOptions, void>({
      query: () => 'filters',
    }),
    getCertificate: builder.query<Certificate, { id: string }>({
      query: ({ id }) => `certificate/${id}`,
      transformResponse: ({ metadata, content }: CertificateResponse): Certificate => {
        const { type, name, ...data } = metadata
        return { metadata: { ...data, type: { ...type, name } }, content }
      },
    }),
  }),
})

export const { useGetUserQuery, useGetCertificatesQuery, useGetCertificateQuery, useGetCertificatesFilterQuery } = api
