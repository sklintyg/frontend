import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { ButtonWithConfirmModal, CertificateMetadata, Checkbox, CustomButton } from '@frontend/common'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSyncAlt } from '@fortawesome/free-solid-svg-icons'
import { renewCertificate } from '../../../store/certificate/certificateActions'
import { useHistory } from 'react-router-dom'
import { getUser } from '../../../store/user/userSelectors'
import { updateUserPreference } from '../../../store/user/userActions'
import _ from 'lodash'

interface Props {
  name: string
  description: string
  enabled: boolean
  body?: string
  certificateMetadata: CertificateMetadata
}

const RenewCertificateButton: React.FC<Props> = ({ name, description, enabled, body, certificateMetadata: propMetaData }) => {
  const dispatch = useDispatch()
  const history = useHistory()
  const [checked, setChecked] = React.useState(false)
  const user = useSelector(getUser, _.isEqual)
  const showModal = user?.preferences?.dontShowFornyaDialog !== 'true'

  const handleConfirm = () => {
    if (checked) {
      dispatch(updateUserPreference({ key: 'dontShowFornyaDialog', value: 'true' }))
    }
    dispatch(renewCertificate(history))
  }

  const handleClick = () => {
    dispatch(renewCertificate(history))
  }

  const onCheckboxChange: React.ChangeEventHandler<HTMLInputElement> = (event) => {
    setChecked(event.currentTarget.checked)
  }

  const getButton = () => {
    if (showModal) {
      return (
        <ButtonWithConfirmModal
          disabled={!enabled}
          onConfirm={handleConfirm}
          modalTitle={'Förnya intyg'}
          confirmButtonText={'Förnya'}
          name={name}
          description={description}
          startIcon={<FontAwesomeIcon icon={faSyncAlt} size="lg"></FontAwesomeIcon>}>
          <div className={'iu-pb-400'} dangerouslySetInnerHTML={{ __html: body as string }}></div>
          <Checkbox
            id={'renew-modal-checkbox'}
            disabled={false}
            onChange={onCheckboxChange}
            label={'Visa inte igen.'}
            checked={checked}></Checkbox>
        </ButtonWithConfirmModal>
      )
    }
    return (
      <CustomButton
        tooltip={description}
        disabled={!enabled}
        text={name}
        buttonStyle={'primary'}
        startIcon={<FontAwesomeIcon icon={faSyncAlt} size="lg"></FontAwesomeIcon>}
        onClick={handleClick}
      />
    )
  }

  return getButton()
}

export default RenewCertificateButton
