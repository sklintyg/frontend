import { useState } from 'react'
import Checkbox from '../../../components/Inputs/Checkbox'
import { CustomButton } from '../../../components/Inputs/CustomButton'
import InfoBox from '../../../components/utils/InfoBox'
import ModalBase from '../../../components/utils/Modal/ModalBase'
import { createNewCertificate, deleteCertificate, startSignCertificate } from '../../../store/certificate/certificateActions'
import { useAppDispatch } from '../../../store/store'
import type { AlertType, CertificateConfirmationModal, CertificateModalActionType } from '../../../types/confirmModal'
import parse from 'html-react-parser'

export function ConfirmationModal({
  certificateId,
  certificateType,
  patientId,
  setOpen,
  open,
  title,
  text,
  alert,
  checkboxText,
  primaryAction,
  secondaryAction,
}: CertificateConfirmationModal & {
  certificateId?: string
  certificateType?: string
  patientId?: string
  setOpen: (val: boolean) => void
  open: boolean
}) {
  const [disabled, setDisabled] = useState(checkboxText ? true : false)
  const dispatch = useAppDispatch()

  const handleAction = (action: CertificateModalActionType) => {
    if (action === 'DELETE' && certificateId) {
      dispatch(deleteCertificate({ certificateId }))
    }
    if (action === 'READ' && certificateType && patientId) {
      dispatch(createNewCertificate({ certificateType, patientId }))
    }
    if (action === 'SIGN') {
      dispatch(startSignCertificate())
    }

    setDisabled(true)
    setOpen(false)
  }

  const getActionButtonText = (action: CertificateModalActionType) => {
    if (action === 'DELETE') {
      return 'Radera'
    }
    if (action === 'READ') {
      return 'Gå vidare'
    }
    if (action === 'SIGN') {
      return 'Signera'
    }
    return 'Avbryt'
  }

  const convertAlertType = (type: AlertType) => {
    if (type == 'ERROR') {
      return 'error'
    }
    if (type == 'OBSERVE') {
      return 'observe'
    }
    return 'info'
  }

  return (
    <ModalBase
      open={open}
      handleClose={() => setOpen(false)}
      title={title}
      buttons={
        <>
          <CustomButton buttonStyle="default" onClick={() => handleAction(secondaryAction)} text={getActionButtonText(secondaryAction)} />
          <CustomButton
            buttonStyle="primary"
            disabled={disabled}
            onClick={() => handleAction(primaryAction)}
            text={getActionButtonText(primaryAction)}
          />
        </>
      }
      closeOnBackdropClick={false}
      content={
        <>
          {alert && (
            <div className="iu-mb-400">
              <InfoBox type={convertAlertType(alert.type)} additionalWrapperStyles="iu-mx-200 iu-my-200">
                {parse(alert.text)}
              </InfoBox>
            </div>
          )}
          <p className="iu-mb-300">{parse(text)}</p>
          {checkboxText && (
            <Checkbox
              label={parse(checkboxText)}
              onChange={(event) => {
                setDisabled(!event.currentTarget.checked)
              }}
            />
          )}
        </>
      }
    />
  )
}
