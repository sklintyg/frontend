import { isEqual } from 'lodash-es'
import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Checkbox from '../../../components/Inputs/Checkbox'
import { CustomButton } from '../../../components/Inputs/CustomButton'
import ButtonWithConfirmModal from '../../../components/utils/Modal/ButtonWithConfirmModal'
import { ReloadIcon } from '../../../images'
import { renewCertificate } from '../../../store/certificate/certificateActions'
import { setUserPreference } from '../../../store/user/userActions'
import { getUser } from '../../../store/user/userSelectors'
import { sanitizeText } from '../../../utils'
import type { FunctionDisabled } from '../../../utils/functionDisablerUtils'

interface Props extends FunctionDisabled {
  name: string
  description: string
  enabled: boolean
  body?: string
  certificateId: string
}

const RenewCertificateButton = ({ name, description, enabled, body, functionDisabled, certificateId }: Props) => {
  const dispatch = useDispatch()
  const [checked, setChecked] = React.useState(false)
  const user = useSelector(getUser, isEqual)
  const dontShowFornyaDialog = 'wc.dontShowFornyaDialog'
  const showModal = user?.preferences?.[dontShowFornyaDialog] !== 'true'

  const handleConfirm = () => {
    if (checked) {
      dispatch(setUserPreference({ key: dontShowFornyaDialog, value: 'true' }))
    }
    dispatch(renewCertificate({ certificateId: certificateId }))
  }

  const handleClick = () => {
    dispatch(renewCertificate({ certificateId: certificateId }))
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
          startIcon={<ReloadIcon size="lg" />}
          confirmButtonDisabled={functionDisabled}
          buttonTestId="renew-certificate-button"
        >
          <div className={'iu-pb-400'} dangerouslySetInnerHTML={sanitizeText(body as string)} />
          <Checkbox id={'renew-modal-checkbox'} disabled={false} onChange={onCheckboxChange} label={'Visa inte igen.'} checked={checked} />
        </ButtonWithConfirmModal>
      )
    }
    return (
      <CustomButton
        tooltip={description}
        disabled={!enabled}
        text={name}
        buttonStyle={'primary'}
        data-testid="renew-certificate-button"
        startIcon={<ReloadIcon size="lg" />}
        onClick={handleClick}
      />
    )
  }

  return getButton()
}

export default RenewCertificateButton
