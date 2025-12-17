import type { HOSPInformation, PPConfig, PrivatePractitionerInfo } from '../../types/pp'
import { api } from '../api'

export const ppApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getHOSPInformation: builder.query<HOSPInformation, void>({
      query: () => 'private-practitioner/hospInformation',
    }),
    getPPConfig: builder.query<PPConfig, void>({
      query: () => 'private-practitioner/config',
    }),
    getPrivatePractitioner: builder.query<PrivatePractitionerInfo, void>({
      query: () => 'private-practitioner',
    }),
    registerPrivatePractitioner: builder.mutation<void, Omit<PrivatePractitionerInfo, 'personId'>>({
      query: (data) => ({
        url: 'private-practitioner',
        method: 'POST',
        data,
      }),
    }),
  }),
})

export const { useGetPPConfigQuery, useGetHOSPInformationQuery, useGetPrivatePractitionerQuery, useRegisterPrivatePractitionerMutation } =
  ppApi
