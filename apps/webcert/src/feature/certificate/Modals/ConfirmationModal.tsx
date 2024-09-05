import { useState } from 'react'
import Checkbox from '../../../components/Inputs/Checkbox'
import { CustomButton } from '../../../components/Inputs/CustomButton'
import InfoBox from '../../../components/utils/InfoBox'
import ModalBase from '../../../components/utils/Modal/ModalBase'
import { createNewCertificate, deleteCertificate } from '../../../store/certificate/certificateActions'
import { useAppDispatch } from '../../../store/store'
import type { CertificateConfirmationModal, CertificateModalActionType } from '../../../types/confirmModal'

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
    setDisabled(true)
    setOpen(false)
  }

  return (
    <ModalBase
      open={open}
      handleClose={() => setOpen(false)}
      title={title}
      buttons={
        <>
          <CustomButton buttonStyle="default" onClick={() => handleAction(secondaryAction)} text="Avbryt" />
          <CustomButton buttonStyle="primary" disabled={disabled} onClick={() => handleAction(primaryAction)} text="Gå vidare" />
        </>
      }
      closeOnBackdropClick={false}
      content={
        <>
          {alert && (
            <div className="iu-mb-200">
              <InfoBox type="info">{alert}</InfoBox>
            </div>
          )}
          <p className="iu-mb-300">{text}</p>
          {checkboxText && (
            <Checkbox
              label={checkboxText}
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
