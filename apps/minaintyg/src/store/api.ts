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
    getCertificate: builder.query<{ content: CertificateListItem[] }, void>({
      query: () => ({ url: 'certificates', method: 'POST' }),
    }),
  }),
})

export const { useGetUserQuery, useGetCertificateQuery } = api
