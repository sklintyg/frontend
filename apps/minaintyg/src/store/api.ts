import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { CertificateListItem } from '../schema/certificateList.schema'
import { CertificateFilterOptions } from '../schema/certificateListFilter.schema'
import { User } from '../schema/user.schema'
import { getCookie } from '../utils/cookies'
import { CertificateFilterState } from './slice/certificateFilter.slice'

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
    getCertificates: builder.query<{ content: CertificateListItem[] }, CertificateFilterState>({
      query: (body) => ({
        url: 'certificate',
        method: 'POST',
        body: Object.fromEntries(Object.entries(body).map(([key, value]) => [key, [value]])),
      }),
    }),
    getCertificatesFilter: builder.query<CertificateFilterOptions, void>({
      query: () => 'certificate/filters',
    }),
  }),
})

export const { useGetUserQuery, useGetCertificatesQuery, useGetCertificatesFilterQuery } = api
