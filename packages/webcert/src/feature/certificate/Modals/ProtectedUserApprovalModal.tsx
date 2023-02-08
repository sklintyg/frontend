import { Checkbox, CustomButton, InfoBox, ModalBase } from '@frontend/common'
import React, { ChangeEvent, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { throwError } from '../../../store/error/errorActions'
import { ErrorCode, ErrorType } from '../../../store/error/errorReducer'
import { setUserPreference } from '../../../store/user/userActions'
import { isDoctor } from '../../../store/user/userSelectors'

interface Props {
  showModal: boolean
  preferenceKey: string
}

const ProtectedUserApprovalModal: React.FC<Props> = ({ showModal, preferenceKey }) => {
  const dispatch = useDispatch()
  const [approved, setApproved] = useState(false)
  const isUserDoctor = useSelector(isDoctor)
  const [open, setOpen] = useState(true)

  if (!showModal) {
    return null
  }

  const onCheckboxChange = (event: ChangeEvent<HTMLInputElement>) => {
    setApproved(event.target.checked)
  }

  const onCancel = () => {
    dispatch(throwError({ type: ErrorType.ROUTE, errorCode: ErrorCode.NOT_APPROVED_PROTECTED_PERSON_AGREEMENT }))
  }

  const onConfirm = () => {
    if (approved) {
      setOpen(false)
      dispatch(setUserPreference({ key: preferenceKey, value: 'true' }))
    }
  }

  return (
    <ModalBase
      open={open}
      handleClose={onCancel}
      title={'Användning av Webcert med skyddade personuppgifter'}
      buttons={
        <>
          <CustomButton buttonStyle={'primary'} disabled={!approved} text={'Till Webcert'} onClick={onConfirm} />
          <CustomButton text={'Avbryt'} onClick={onCancel} />
        </>
      }
      content={
        <>
          <InfoBox type={'info'}>
            <p>Du har skyddade personuppgifter.</p>
          </InfoBox>
          <p className="iu-fw-bold iu-py-300"> Att använda Webcert med en skyddade personuppgifter innebär:</p>
          <ul>
            {isUserDoctor && (
              <li>
                När du signerar ett intyg kommer ditt namn och information om den vårdgivare och vårdenhet intyget är utfärdat på, vara
                synligt.
              </li>
            )}
            <li>
              Vid kommunikation med Försäkringskassan kring ett intyg, kommer ditt namn att vara synligt. Detta kan göra att information om
              dig och var du arbetar kan spridas.
            </li>
          </ul>
          <p className="iu-py-300">
            Vill du ändå gå vidare och använda Webcert kan du göra det, efter att du godkänt att du tagit del av denna information. Detta
            godkännande behöver du bara göra en gång.
          </p>
          <p>Vill du inte använda Webcert, eller av annan anledning väljer att avbryta, så kommer Webcert att avslutas.</p>
          <Checkbox onChange={onCheckboxChange} label={'Jag förstår och godkänner.'} checked={approved} />
        </>
      }
    />
  )
}

export default ProtectedUserApprovalModal
