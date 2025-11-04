import { type Certificate } from '../../types'
import { getCertificateToSave } from '../../utils'
import { createAsyncApiThunk } from '../api/createApiThunk'

export const autoSaveCertificate = createAsyncApiThunk<{ version: number }, Certificate>('certificate/autosave', (certificate) => ({
  url: `/api/certificate/${certificate.metadata.id}`,
  method: 'PUT',
  data: getCertificateToSave(certificate),
}))
