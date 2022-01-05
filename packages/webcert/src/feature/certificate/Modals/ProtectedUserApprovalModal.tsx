import React, { ChangeEvent, useState } from 'react'
import { Checkbox, CustomButton, getResourceLink, ModalBase, ResourceLink, ResourceLinkType } from '@frontend/common/src'
import { useDispatch, useSelector } from 'react-redux'
import { setUserPreference } from '../../../store/user/userActions'
import { getUser } from '../../../store/user/userSelectors'
import _ from 'lodash'
import { throwError } from '../../../store/error/errorActions'
import { ErrorCode, ErrorType } from '../../../store/error/errorReducer'

interface Props {
  resourceLink: ResourceLink
}

const ProtectedUserApprovalModal: React.FC<Props> = ({ resourceLink }) => {
  const dispatch = useDispatch()
  const [approved, setApproved] = useState(false)
  const dontShowProtectedPersonDialog = 'wc.vardperson.sekretess.approved'
  const user = useSelector(getUser, _.isEqual)
  const showModal = user?.preferences?.[dontShowProtectedPersonDialog] !== 'true'

  if (!resourceLink || !showModal) {
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
      dispatch(setUserPreference({ key: dontShowProtectedPersonDialog, value: 'true' }))
    }
  }

  return (
    <ModalBase
      open={resourceLink.enabled}
      handleClose={onCancel}
      title={resourceLink.name}
      buttons={
        <>
          <CustomButton buttonStyle={'primary'} disabled={!approved} text={'Till Webcert'} onClick={onConfirm} />
          <CustomButton text={'Avbryt'} onClick={onCancel} />
        </>
      }
      content={
        <>
          <div className={'iu-pb-300'} dangerouslySetInnerHTML={{ __html: resourceLink.body as string }} />
          <Checkbox onChange={onCheckboxChange} label={'Jag förstår och godkänner.'} checked={approved} />
        </>
      }
    />
  )
}

export default ProtectedUserApprovalModal
