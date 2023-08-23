import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { AppConfig } from '../schema/appConfig.schema'
import { CertificateDescription } from '../schema/certificateDescription.schema'

export const configApi = createApi({
  reducerPath: 'configApi',
  baseQuery: fetchBaseQuery({
    baseUrl: '/appconfig/api/',
  }),
  tagTypes: ['User'],
  endpoints: (builder) => ({
    getAppConfig: builder.query<AppConfig, void>({
      query: () => 'app',
    }),
    getCertificateDescription: builder.query<CertificateDescription, void>({
      query: () => 'map',
    }),
  }),
})

export const { useGetAppConfigQuery, useGetCertificateDescriptionQuery } = configApi
