import { tryCatch } from '@frontend/utils';
import type { Certificate, CertificateEvent, ModalData, ValidationError } from '../types';
import { SigningMethod } from '../types';
import { TAG, api } from './api';

const certificateApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getCertificate: builder.query<Certificate, string>({
      query: (id) => `certificate/${id}`,
      transformResponse: ({ certificate }: { certificate: Certificate }) => certificate,
      providesTags: (result) => (result ? [{ type: TAG.CERTIFICATE as const, id: result.metadata.id }] : []),
    }),
    getCertificateEvents: builder.query<CertificateEvent[], string>({
      query: (id) => `certificate/${id}/events`,
      transformResponse: ({ certificateEvents }: { certificateEvents: CertificateEvent[] }) => certificateEvents,
      providesTags: (result, error, id) => (result ? [{ type: TAG.CERTIFICATE as const, id: id }] : []),
    }),
    getRelatedCertificate: builder.query<Certificate, string>({
      query: (id) => `certificate/${id}/related`,
      providesTags: (result, error, id) => (result ? [{ type: TAG.CERTIFICATE as const, id: id }] : []),
    }),
    // TODO: This should probably update the state of getCertificate with a new status, not sure if needed tho.
    // getCertificateSignStatus: builder.query<CertificateSignStatus, {id: string, type: string}>({
    //   query: ({id, type}) => `/api/signature/${type}/${id}/signeringsstatus`,
    //   transformResponse: ({ status }: { status: CertificateSignStatus }) => status,
    // }),
    deleteCertificate: builder.mutation<void, { id: string; version: string }>({
      query: ({ id, version }) => ({
        url: `certificate/${id}/${version}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, { id }) => (error ? [] : [{ type: TAG.CERTIFICATE as const, id }]),
    }),
    updateCertificate: builder.mutation<{ version: string }, Certificate>({
      query: (certificate) => ({
        url: `certificate/${certificate.metadata.id}`,
        method: 'PUT',
        body: certificate,
      }),
      async onQueryStarted(certificate, { dispatch, queryFulfilled }) {
        tryCatch(async () => {
          const { data } = await queryFulfilled
          dispatch(
            certificateApi.util.updateQueryData('getCertificate', certificate.metadata.id, (draft) => {
              Object.assign(draft.metadata, data)
            })
          )
        })
      },
    }),
    validateCertificate: builder.mutation<{ validationErrors: ValidationError[] }, Certificate>({
      query: (certificate) => ({
        url: `certificate/${certificate.metadata.id}/validate`,
        method: 'POST',
        body: certificate,
      }),
    }),
    forwardCertificate: builder.mutation<void, { id: string; forward: string }>({
      query: ({ id, forward }) => ({
        url: `certificate/${id}/forward`,
        method: 'POST',
        body: { forward },
      }),
      invalidatesTags: (result, error, { id }) => (error ? [] : [{ type: TAG.CERTIFICATE as const, id }]),
    }),
    readyForSignCertificate: builder.mutation<void, string>({
      query: (id) => ({
        url: `certificate/${id}/readyforsign`,
        method: 'POST',
      }),
      invalidatesTags: (result, error, id) => (error ? [] : [{ type: TAG.CERTIFICATE as const, id }]),
    }),
    sendCertificate: builder.mutation<void, string>({
      query: (id) => ({
        url: `certificate/${id}/send`,
        method: 'POST',
      }),
      invalidatesTags: (result, error, id) => (error ? [] : [{ type: TAG.CERTIFICATE as const, id }]),
    }),
    signCertificate: builder.mutation<void, { method: SigningMethod; certificate: Certificate }>({
      query: ({ method, certificate }) => ({
        url:
          method === SigningMethod.FAKE
            ? `certificate/${certificate.metadata.id}/sign`
            : `signature/${certificate.metadata.type}/${certificate.metadata.id}/${certificate.metadata.version}/signeringshash/${
                method === SigningMethod.DSS ? 'SIGN_SERVICE' : 'GRP'
              }`,
        body: certificate,
        method: 'POST',
      }),
      invalidatesTags: (
        result,
        error,
        {
          certificate: {
            metadata: { id },
          },
        }
      ) => (error ? [] : [{ type: TAG.CERTIFICATE as const, id }]),
    }),
    revokeCertificate: builder.mutation<void, { id: string; title: string; message: string; reason: string }>({
      query: ({ id, reason, title, message }) => ({
        url: `certificate/${id}/revoke`,
        method: 'POST',
        body: { reason: reason, message: `${title} ${message}` },
      }),
      invalidatesTags: (result, error, { id }) => (error ? [] : [{ type: TAG.CERTIFICATE as const, id }]),
    }),
    complementCertificate: builder.mutation<void, { id: string; message: string }>({
      query: ({ id, message }) => ({
        url: `certificate/${id}/complement`,
        method: 'POST',
        body: { message },
      }),
      invalidatesTags: (result, error, { id }) => (error ? [] : [{ type: TAG.CERTIFICATE as const, id }]),
    }),
    answerCertificateComplement: builder.mutation<void, { id: string; message: string }>({
      query: ({ id, message }) => ({
        url: `certificate/${id}/answercomplement`,
        method: 'POST',
        body: { message },
      }),
      invalidatesTags: (result, error, { id }) => (error ? [] : [{ type: TAG.CERTIFICATE as const, id }]),
    }),
    replaceCertificate: builder.mutation<void, { id: string; certificateType: string; patientId: string }>({
      query: ({ id, certificateType, patientId }) => ({
        url: `certificate/${id}/replace`,
        method: 'POST',
        body: { certificateType, patientId },
      }),
      invalidatesTags: (result, error, { id }) => (error ? [] : [{ type: TAG.CERTIFICATE as const, id }]),
    }),
    copyCertificate: builder.mutation<{ certificateId: string }, { id: string; certificateType: string; patientId: string }>({
      query: ({ id, certificateType, patientId }) => ({
        url: `certificate/${id}/copy`,
        method: 'POST',
        body: { certificateType, patientId },
      }),
      invalidatesTags: (result, error, { id }) => (error ? [] : [{ type: TAG.CERTIFICATE as const, id }]),
    }),
    renewCertificate: builder.mutation<void, string>({
      query: (id) => ({
        url: `certificate/${id}/renew`,
        method: 'POST',
      }),
      invalidatesTags: (result, error, id) => (error ? [] : [{ type: TAG.CERTIFICATE as const, id }]),
    }),
    createCertificateFromTemplate: builder.mutation<{ certificateId: string }, string>({
      query: (id) => ({
        url: `certificate/${id}/template`,
        method: 'POST',
      }),
    }),
    createCertificateFromCandidate: builder.mutation<{ certificateId: string }, string>({
      query: (id) => ({
        url: `certificate/${id}/candidate`,
        method: 'POST',
      }),
    }),
    getCandidateMessage: builder.query<ModalData, string>({
      query: (id) => `certificate/${id}/candidatemessage`,
    }),
    createCertificate: builder.mutation<{ certificateId: string }, { certificateType: string; patientId: string }>({
      query: ({ certificateType, patientId }) => ({
        url: `certificate/${certificateType}/${patientId}`,
        method: 'POST',
      }),
    }),
  }),
})

export const {
  useAnswerCertificateComplementMutation,
  useComplementCertificateMutation,
  useCreateCertificateFromCandidateMutation,
  useCreateCertificateFromTemplateMutation,
  useDeleteCertificateMutation,
  useForwardCertificateMutation,
  useGetCertificateEventsQuery,
  useGetCertificateQuery,
  useGetRelatedCertificateQuery,
  useReadyForSignCertificateMutation,
  useRenewCertificateMutation,
  useReplaceCertificateMutation,
  useRevokeCertificateMutation,
  useSendCertificateMutation,
  useSignCertificateMutation,
  useCopyCertificateMutation,
  useCreateCertificateMutation,
  useGetCandidateMessageQuery,
  useUpdateCertificateMutation,
  useValidateCertificateMutation,
} = certificateApi
