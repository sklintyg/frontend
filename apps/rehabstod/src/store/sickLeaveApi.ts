import type { AGCertificatesInfo } from '../schemas/agCertificatesSchema'
import type { Patient } from '../schemas/patientSchema'
import type {
  RekoStatus,
  RekoStatusType,
  SickLeaveFilter,
  SickLeaveFilterOptions,
  SickLeaveInfo,
  SickLeaveSummary,
} from '../schemas/sickLeaveSchema'
import { api } from './api'

const sickLeaveApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getSickLeaves: builder.query<{ content: SickLeaveInfo[]; unansweredCommunicationError: boolean; srsError: boolean }, SickLeaveFilter>({
      query: (request) => ({
        url: 'sickleaves/active',
        method: 'POST',
        body: request,
      }),
      providesTags: ['User'],
      async onQueryStarted(_, { dispatch }) {
        dispatch(sickLeaveApi.endpoints.getSickLeavesFilters.initiate(undefined, { forceRefetch: true }))
      },
    }),
    getSickLeavesFilters: builder.query<SickLeaveFilterOptions, void>({
      query: () => ({
        url: 'sickleaves/filters',
      }),
      providesTags: ['User', 'SickLeaves'],
    }),
    getSickLeavesSummary: builder.query<SickLeaveSummary, void>({
      query: () => ({
        url: 'sickleaves/summary',
      }),
      providesTags: ['User', 'SickLeaves'],
    }),
    getPatientSickLeaves: builder.query<Patient, { encryptedPatientId: string }>({
      keepUnusedDataFor: 0,
      query: (encryptedPatientId) => ({
        url: 'sjukfall/patient',
        method: 'POST',
        body: encryptedPatientId,
      }),
      providesTags: ['Patient', 'SickLeaves'],
    }),
    getAGCertificatesForPatient: builder.query<AGCertificatesInfo, { encryptedPatientId: string }>({
      keepUnusedDataFor: 0,
      query: (request) => ({
        url: 'certificate/ag/person',
        method: 'POST',
        body: request,
      }),
    }),
    addVardenhet: builder.mutation<string[], { patientId: string; vardenhetId: string }>({
      query: ({ patientId, vardenhetId }) => ({
        url: 'sjukfall/patient/addVardenhet',
        method: 'POST',
        body: { patientId, vardenhetId },
      }),
      invalidatesTags: ['Patient'],
    }),
    addVardgivare: builder.mutation<string[], { patientId: string; vardgivareId: string }>({
      query: ({ patientId, vardgivareId }) => ({
        url: 'sjukfall/patient/addVardgivare',
        method: 'POST',
        body: { patientId, vardgivareId },
      }),
      invalidatesTags: ['Patient'],
    }),
    logPrintInteraction: builder.mutation<void, { sickLeaves: SickLeaveInfo[] | undefined }>({
      query: (sickLeaves) => ({
        url: 'sickleaves/print',
        method: 'POST',
        body: sickLeaves,
      }),
    }),
    setRekoStatus: builder.mutation<
      void,
      { patientId: string; status: RekoStatusType; sickLeaveTimestamp: string; filter: SickLeaveFilter }
    >({
      query: ({ patientId, status, sickLeaveTimestamp }) => ({
        url: 'reko',
        method: 'POST',
        body: { patientId, statusId: status.id, sickLeaveTimestamp },
      }),
      invalidatesTags: (result, error, { patientId }) => [{ type: 'RekoStatus', id: patientId }],
      async onQueryStarted({ patientId, status, filter }, { dispatch, queryFulfilled }) {
        dispatch(
          sickLeaveApi.util.updateQueryData('getSickLeaves', filter, (draft) => {
            const index = draft.content.findIndex((sickLeave) => sickLeave.patient.id === patientId)
            if (index !== -1) {
              // eslint-disable-next-line no-param-reassign
              draft.content[index].rekoStatus = { status }
            }
          })
        )
        try {
          await queryFulfilled
        } catch {
          dispatch(api.util.invalidateTags(['User']))
        }
      },
    }),
    getRekoStatusForPatient: builder.query<RekoStatus, { patientId: string; endDate: string; startDate: string }>({
      keepUnusedDataFor: 0,
      query: ({ patientId, endDate, startDate }) => ({
        url: 'reko/patient',
        method: 'POST',
        body: { patientId, endDate, startDate },
      }),
      providesTags: (result, error, { patientId }) => [{ type: 'RekoStatus', id: patientId }],
    }),
    giveSjfConsent: builder.mutation<
      { registeredBy: string; responseCode: string; responseMessage: string },
      { days: number; onlyCurrentUser: boolean; patientId: string; encryptedPatientId: string }
    >({
      query: ({ days, onlyCurrentUser, patientId }) => ({
        url: 'consent',
        method: 'POST',
        body: { days, onlyCurrentUser, patientId },
      }),
      async onQueryStarted({ encryptedPatientId }, { dispatch, queryFulfilled }) {
        try {
          const {
            data: { responseCode },
          } = await queryFulfilled
          dispatch(
            sickLeaveApi.util.updateQueryData('getPatientSickLeaves', { encryptedPatientId }, (draft) =>
              Object.assign(draft, {
                sjfMetaData: {
                  ...(draft.sjfMetaData ?? {}),
                  samtyckeFinns: responseCode === 'OK',
                },
              })
            )
          )
        } catch {
          dispatch(api.util.invalidateTags(['Patient']))
        }
      },
    }),
  }),
  overrideExisting: false,
})

export const {
  useAddVardenhetMutation,
  useAddVardgivareMutation,
  useGetAGCertificatesForPatientQuery,
  useGetPatientSickLeavesQuery,
  useGetSickLeavesFiltersQuery,
  useGetSickLeavesSummaryQuery,
  useGiveSjfConsentMutation,
  useLazyGetSickLeavesQuery,
  useSetRekoStatusMutation,
  useGetRekoStatusForPatientQuery,
  useLogPrintInteractionMutation,
} = sickLeaveApi
