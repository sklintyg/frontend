import { getCookie } from '@frontend/utils'
import { isAnyOf, isPlainObject } from '@reduxjs/toolkit'
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import type { AvailableFunction, Certificate, CertificateMetadata, CertificateText } from '../schema/certificate.schema'
import type { CertificateFilterOptions } from '../schema/certificateListFilter.schema'
import type { ErrorData } from '../schema/error.schema'
import type { Session } from '../schema/session.schema'
import type { User } from '../schema/user.schema'
import type { CertificateFilterState } from './slice/certificateFilter.slice'
import type { InformationResponse } from '../schema/informationSchema'

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
    getCertificate: builder.query<Certificate & { availableFunctions: AvailableFunction[]; texts: CertificateText }, { id: string }>({
      query: ({ id }) => `certificate/${id}`,
      transformResponse: ({
        certificate,
        availableFunctions,
        texts,
      }: {
        certificate: Certificate
        availableFunctions: AvailableFunction[]
        texts: CertificateText
      }) => ({
        ...certificate,
        availableFunctions,
        texts,
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
    getSessionPing: builder.query<Session, void>({
      query: () => 'session/ping',
      providesTags: ['User'],
    }),
    logError: builder.mutation<void, ErrorData>({
      query: (body) => ({
        url: 'log/error',
        method: 'POST',
        body,
      }),
    }),
    getInfo: builder.query<InformationResponse, void>({
      query: () => 'info',
    }),
  }),
})

export const {
  useGetCertificatesQuery,
  useGetCertificateQuery,
  useGetCertificatesFilterQuery,
  useSendCertificateMutation,
  useGetSessionPingQuery,
  useLogErrorMutation,
  useGetInfoQuery,
} = api

export const isFulfilledEndpoint = isAnyOf(...Object.values(api.endpoints).map((endpoint) => endpoint.matchFulfilled))
export const isRejectedEndpoint = isAnyOf(...Object.values(api.endpoints).map((endpoint) => endpoint.matchRejected))
export const hasResponse = (o: unknown): o is { response: Response } =>
  isPlainObject(o) && 'response' in o && o.response instanceof Response
export const hasRequest = (o: unknown): o is { request: Request } => isPlainObject(o) && 'request' in o && o.request instanceof Request
