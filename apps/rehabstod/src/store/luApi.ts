import { Lakare } from '../schemas/lakareSchema'
import { LUCertificatesFilter, LUCertificatesFilterOptions, LUCertificatesInfo } from '../schemas/luCertificatesSchema'
import { api } from './api'

const luApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getLUCertificates: builder.query<LUCertificatesInfo, LUCertificatesFilter>({
      query: (request) => ({
        url: 'certificate/lu/unit',
        method: 'POST',
        body: request,
      }),
      providesTags: ['User'],
      async onQueryStarted(_, { dispatch }) {
        dispatch(luApi.endpoints.getLUFilters.initiate(undefined, { forceRefetch: true }))
      },
    }),
    getLUFilters: builder.query<LUCertificatesFilterOptions, void>({
      keepUnusedDataFor: 0,
      query: () => 'lu/filters',
      providesTags: ['User'],
    }),
    getPatientLUCertificates: builder.query<LUCertificatesInfo, { encryptedPatientId: string }>({
      keepUnusedDataFor: 0,
      query: (request) => ({
        url: 'certificate/lu/person',
        method: 'POST',
        body: request,
      }),
      providesTags: ['User'],
    }),
    getLUCertificatesDoctors: builder.query<{ doctors: Lakare[] }, void>({
      query: () => ({
        url: 'certificate/lu/doctors',
        method: 'GET',
      }),
      providesTags: ['User'],
    }),
  }),
  overrideExisting: false,
})

export const { useGetLUFiltersQuery, useGetPatientLUCertificatesQuery, useLazyGetLUCertificatesQuery } = luApi
