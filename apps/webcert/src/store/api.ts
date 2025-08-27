import { getCookie } from '@frontend/utils'
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import type { ErrorLogRequest } from './error/errorReducer'

export enum TAG {
  CERTIFICATE = 'Certificate',
  QUESTION = 'Question',
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
    logError: builder.mutation<void, ErrorLogRequest>({
      query: (error) => ({
        url: 'log/error',
        method: 'POST',
        body: error,
      }),
    }),
  }),
  tagTypes: Object.values(TAG),
})
