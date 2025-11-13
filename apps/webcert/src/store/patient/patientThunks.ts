import type { CertificateTypeInfoModalData } from '../../types'
import { createAsyncApiThunk } from '../api/createAsyncApiThunk'

interface GetCertificateTypeInfoModalArgs {
  certificateType: string
  patientId: string
}

export const getCertificateTypeInfoModal = createAsyncApiThunk<CertificateTypeInfoModalData, GetCertificateTypeInfoModalArgs>(
  'patient/getCertificateTypeInfoModal',
  ({ certificateType, patientId }) => ({
    url: `/api/certificate/type/modal/${certificateType}/${patientId}`,
    method: 'GET',
  })
)
