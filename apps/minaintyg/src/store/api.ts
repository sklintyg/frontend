import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { Certificate, CertificateMetadata } from '../schema/certificate.schema'
import { User } from '../schema/user.schema'
import { getCookie } from '../utils/cookies'

export const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: '/api/',
    prepareHeaders: (headers) => {
      if (getCookie('XSRF-TOKEN')) {
        headers.set('X-XSRF-TOKEN', getCookie('XSRF-TOKEN'))
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
    getCertificates: builder.query<{ content: CertificateMetadata[] }, void>({
      query: () => ({ url: 'certificate', method: 'POST' }),
    }),
    getCertificate: builder.query<Certificate, { id: string }>({
      query: ({ id }) => `certificate/${id}`,
    }),
  }),
})

export const { useGetUserQuery, useGetCertificatesQuery, useGetCertificateQuery } = api
