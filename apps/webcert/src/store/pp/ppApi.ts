import type { HOSPInformation, PPConfig, RegisterPrivatePractitionerData } from '../../types/pp'
import { api } from '../api'

export const ppApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getHOSPInformation: builder.query<HOSPInformation, void>({
      query: () => 'private-practitioner/hospInformation',
    }),
    getPPConfig: builder.query<PPConfig, void>({
      query: () => 'private-practitioner/config',
    }),
    registerPrivatePractitioner: builder.mutation<void, RegisterPrivatePractitionerData>({
      query: (data) => ({
        url: 'private-practitioner',
        method: 'POST',
        data,
      }),
    }),
  }),
})

export const { useGetPPConfigQuery, useGetHOSPInformationQuery, useRegisterPrivatePractitionerMutation } = ppApi
