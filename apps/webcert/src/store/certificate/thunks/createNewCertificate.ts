import { createApiThunk } from '../../api/createApiThunk'
import { updateCreatedCertificateId } from '../certificateSlice'

export const createNewCertificate = createApiThunk<string, { certificateType: string; patientId: string }>(
  'certificate/create',
  ({ certificateType, patientId }) => ({
    url: `/api/certificate/${certificateType}/${patientId}`,
    method: 'POST',
    onSuccess: (data, { dispatch }) => {
      dispatch(updateCreatedCertificateId(data))
    },
  })
)
