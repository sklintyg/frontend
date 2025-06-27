import type React from 'react'
import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { throwError } from '../../../store/error/errorActions'
import { ErrorCode, ErrorType } from '../../../store/error/errorReducer'
import InfoBox from '../../utils/InfoBox'

const SrsPanelError = () => {
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(
      throwError({
        errorCode: ErrorCode.SRS_ERROR,
        certificateId: '',
        type: ErrorType.SILENT,
      })
    )
  })

  return (
    <InfoBox activateIconWrap type="error">
      Tekniskt fel: Stödet Risk och råd är inte tillgängligt eftersom tjänsten inte svarar just nu.
    </InfoBox>
  )
}

export default SrsPanelError
