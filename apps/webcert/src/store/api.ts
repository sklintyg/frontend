import { getCookie } from '@frontend/utils'
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export enum TAG {
  CERTIFICATE_PREFILL = 'CertificatePrefill',
}

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
  endpoints: (builder) => ({
    getPrefill: builder.query({
      query: (id) => `prefill/${id}`,
      providesTags: [TAG.CERTIFICATE_PREFILL],
    }),
  }),
  tagTypes: Object.values(TAG),
})

export const { useGetPrefillQuery } = api
