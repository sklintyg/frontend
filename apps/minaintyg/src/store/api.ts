import { getCookie } from '@frontend/utils'
import { isAnyOf, isPlainObject } from '@reduxjs/toolkit'
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { AvailableFunction, Certificate, CertificateMetadata } from '../schema/certificate.schema'
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
  tagTypes: ['User', 'Certificate'],
  endpoints: (builder) => ({
    getUser: builder.query<User, void>({
      query: () => 'user',
      providesTags: ['User'],
    }),
    getCertificates: builder.query<{ content: CertificateMetadata[] }, CertificateFilterState>({
      query: (body) => ({
        url: 'certificate',
        method: 'POST',
        body: Object.fromEntries(Object.entries(body).map(([key, value]) => [key, [value]])),
      }),
      providesTags: (result) =>
        result
          ? [...result.content.map(({ id }) => ({ type: 'Certificate' as const, id })), { type: 'Certificate', id: 'LIST' }]
          : [{ type: 'Certificate', id: 'LIST' }],
    }),
    getCertificatesFilter: builder.query<CertificateFilterOptions, void>({
      query: () => 'filters',
    }),
    getCertificate: builder.query<Certificate & { availableFunctions: AvailableFunction[] }, { id: string }>({
      query: ({ id }) => `certificate/${id}`,
      transformResponse: ({ certificate, availableFunctions }: { certificate: Certificate; availableFunctions: AvailableFunction[] }) => ({
        ...certificate,
        availableFunctions,
      }),
      providesTags: (result) => (result ? [{ type: 'Certificate' as const, id: result.metadata.id }] : []),
    }),
    sendCertificate: builder.mutation<void, { id: string }>({
      query: ({ id }) => ({
        url: `certificate/${id}/send`,
        method: 'POST',
      }),
      invalidatesTags: (result, error, { id }) => (error ? [] : [{ type: 'Certificate', id }]),
    }),
  }),
})

export const { useGetCertificatesQuery, useGetCertificateQuery, useGetCertificatesFilterQuery, useSendCertificateMutation } = api

export const isFulfilledEndpoint = isAnyOf(...Object.values(api.endpoints).map((endpoint) => endpoint.matchFulfilled))
export const isRejectedEndpoint = isAnyOf(...Object.values(api.endpoints).map((endpoint) => endpoint.matchRejected))
export const hasResponse = (o: unknown): o is { response: Response } =>
  isPlainObject(o) && 'response' in o && o.response instanceof Response
