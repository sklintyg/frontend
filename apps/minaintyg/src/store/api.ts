import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { CertificateListItem } from '../schema/certificateList.schema'
import { CertificateFilterOptions, CertificateSelectedOptions } from '../schema/certificateListFilter.schema'
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
    getCertificates: builder.query<{ content: CertificateListItem[] }, Partial<CertificateSelectedOptions>>({
      query: (body) => ({ url: 'certificate', method: 'POST', body }),
    }),
    getCertificatesFilter: builder.query<CertificateFilterOptions, void>({
      query: () => 'filter-certificate',
    }),
  }),
})

export const { useGetUserQuery, useGetCertificatesQuery, useGetCertificatesFilterQuery } = api
