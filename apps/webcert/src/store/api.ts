import { getCookie } from '@frontend/utils'
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

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
  endpoints: () => ({}),
  tagTypes: Object.values(TAG),
})
