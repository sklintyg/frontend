import { getCookie } from '@frontend/utils'
import type { BaseQueryFn } from '@reduxjs/toolkit/query/react'
import { createApi } from '@reduxjs/toolkit/query/react'
import type { AxiosError, AxiosRequestConfig } from 'axios'
import axios from 'axios'
import type { ZipCodeInfo } from '../types/zipCode'
import type { ErrorLogRequest } from './error/errorReducer'

enum TAG {
  CERTIFICATE = 'Certificate',
  QUESTION = 'Question',
}

const axiosBaseQuery =
  (
    { baseUrl }: { baseUrl: string } = { baseUrl: '' }
  ): BaseQueryFn<
    | {
        url: string
        method?: AxiosRequestConfig['method']
        data?: AxiosRequestConfig['data']
        params?: AxiosRequestConfig['params']
        headers?: AxiosRequestConfig['headers']
      }
    | string,
    unknown,
    unknown
  > =>
  async (arg) => {
    const { url, method, data, params, headers } = typeof arg === 'string' ? { url: arg } : arg
    try {
      const result = await axios({
        url: baseUrl + url,
        method,
        data,
        params,
        headers: { ...headers, 'X-XSRF-TOKEN': getCookie('XSRF-TOKEN') ?? '' },
      })
      return { data: result.data }
    } catch (axiosError) {
      const err = axiosError as AxiosError
      return {
        error: {
          status: err.response?.status,
          data: err.response?.data || err.message,
        },
      }
    }
  }

export const api = createApi({
  reducerPath: 'api',
  baseQuery: axiosBaseQuery({
    baseUrl: '/api/',
  }),
  endpoints: (builder) => ({
    getZipCodeInfo: builder.query<ZipCodeInfo[], string>({
      query: (zipcode) => `config/area/${zipcode}`,
    }),
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
