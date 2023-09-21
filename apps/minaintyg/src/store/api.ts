import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { CertificateListItem } from '../schema/certificateList.schema'
import { User } from '../schema/user.schema'

export const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: '/api/',
  }),
  tagTypes: ['User'],
  endpoints: (builder) => ({
    getUser: builder.query<User, void>({
      query: () => 'user',
      providesTags: ['User'],
    }),
    getCertificates: builder.query<{ content: CertificateListItem[] }, void>({
      query: () => ({ url: 'certificate', method: 'POST' }),
    }),
    getCertificate: builder.query<{ content: string }, { id: string }>({
      query: ({ id }) => `certificate/${id}`,
    }),
  }),
})

export const { useGetUserQuery, useGetCertificatesQuery, useGetCertificateQuery } = api
