import { createAction } from '@reduxjs/toolkit'
import { ApiError } from '../../api/apiActions'
import { throwError } from '../../error/errorActions'
import { createErrorRequestFromApiError } from '../../error/errorCreator'
import { startListening } from '../../listenerMiddleware'
import { hideSpinner } from '../certificateSlice'

export interface CertificateApiGenericError {
  error: ApiError
  certificateId: string
}

export const certificateApiGenericError = createAction<CertificateApiGenericError>('Api certificate generic error')

startListening({
  actionCreator: certificateApiGenericError,
  effect: async (action, { dispatch }) => {
    dispatch(hideSpinner())
    dispatch(throwError(createErrorRequestFromApiError(action.payload.error, action.payload.certificateId)))
  },
})
