import type { HOSPInformation, PPConfig } from '../../types/pp'
import { api } from '../api'

export const ppApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getHOSPInformation: builder.query<HOSPInformation, void>({
      query: () => 'private-practitioner/hospInformation',
    }),
    getPPConfig: builder.query<PPConfig, void>({
      query: () => 'private-practitioner/config',
    }),
  }),
})

export const { useGetPPConfigQuery, useGetHOSPInformationQuery } = ppApi
