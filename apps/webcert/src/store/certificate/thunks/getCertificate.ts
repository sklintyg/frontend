import { Certificate, CertificateSignStatus, CertificateStatus } from '../../../types'
import { getDecoratedCertificateData } from '../../../utils/validation/getDecoratedCertificateData'
import { createApiThunk } from '../../api/createApiThunk'
import { throwError } from '../../error/errorActions'
import { ErrorCode, ErrorType } from '../../error/errorReducer'
import {
  getCertificateCompleted,
  getCertificateEvents,
  hideSpinner,
  showSpinner,
  updateCertificate,
  updateCertificateSignStatus,
  validateCertificate,
} from '../certificateActions'

export const getCertificate = createApiThunk<{ certificate: Certificate }, string>('certificate/get', (id) => ({
  url: `/api/certificate/${id}`,
  method: 'GET',
  onStart: ({ dispatch }) => {
    dispatch(showSpinner('Laddar...'))
  },
  onSuccess: (payload, { dispatch }) => {
    const { data, metadata, links } = payload.certificate
    const certificate = { ...payload.certificate, data: getDecoratedCertificateData(data, metadata, links) }
    dispatch(updateCertificate(certificate))
    dispatch(getCertificateCompleted())
    dispatch(hideSpinner())
    if (certificate.metadata.status === CertificateStatus.UNSIGNED) {
      dispatch(validateCertificate(certificate))
    }
    dispatch(getCertificateEvents(certificate.metadata.id))
    dispatch(updateCertificateSignStatus(CertificateSignStatus.INITIAL))
  },
  onError: (error, { dispatch }) => {
    let errorCode: ErrorCode
    const errorCodesToMapToOriginal = [
      ErrorCode.AUTHORIZATION_PROBLEM_SEKRETESSMARKERING_ENHET,
      ErrorCode.AUTHORIZATION_PROBLEM,
      ErrorCode.DATA_NOT_FOUND,
    ]
    if (errorCodesToMapToOriginal.some((code) => code.toString() === error.errorCode)) {
      errorCode = error.errorCode as ErrorCode
    } else {
      errorCode = ErrorCode.GET_CERTIFICATE_PROBLEM
    }

    dispatch(
      throwError({
        type: ErrorType.ROUTE,
        errorCode: errorCode,
        message: error.message,
        certificateId: id,
      })
    )
  },
}))
