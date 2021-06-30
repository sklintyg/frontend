import React from 'react'
import { useDispatch } from 'react-redux'
import { CertificateMetadata, CustomButton, RadioButton } from '@frontend/common'
import ModalBase from '@frontend/common/src/components/utils/Modal/ModalBase'
import { addCertificateApprovedReceiver } from '../../../store/certificate/certificateActions'
import { CertificateReceiver } from '@frontend/common/src/types/certificate'

interface Props {
  open: boolean
  handleClose: () => void
  receivers: string[]
  hideClose?: boolean
  certificateMetadata: CertificateMetadata
}

const ChooseReceiverModal: React.FC<Props> = ({ open, handleClose, receivers, hideClose, certificateMetadata }) => {
  const dispatch = useDispatch()
  const showClose = !hideClose
  const [chosenReceivers, setChosenReceivers] = React.useState<CertificateReceiver[]>([
    ...(certificateMetadata?.approvedReceivers as CertificateReceiver[]),
  ])
  if (certificateMetadata.approvedReceivers === null || certificateMetadata.approvedReceivers === undefined) return null

  const confirmButtonDisabled =
    certificateMetadata.approvedReceivers.length !== receivers.length && chosenReceivers.length !== receivers.length

  const onChange: React.ChangeEventHandler<HTMLInputElement> = (event) => {
    const name = event.currentTarget.id.split('_')[0]
    const approved = event.currentTarget.value === 'true'
    const copyReceivers = [...chosenReceivers]
    const index = copyReceivers.findIndex((r: CertificateReceiver) => r.name === name)
    if (index !== -1) {
      copyReceivers.splice(index, 1)
    }
    copyReceivers.push({ name: name, approved: approved })
    setChosenReceivers(copyReceivers)
  }

  const onClose = () => {
    setChosenReceivers(certificateMetadata.approvedReceivers?.slice() as CertificateReceiver[])
    handleClose()
  }

  const handleConfirm = () => {
    chosenReceivers.map((r) => dispatch(addCertificateApprovedReceiver(r)))
    handleClose()
    return
  }

  const getReceivers = () => {
    return receivers.map((r) => (
      <>
        <div className="iu-grid-rows">
          <p key={r} className="iu-fw-bold">
            {r}
          </p>
        </div>
      </>
    ))
  }

  const getRadioButtons = () => {
    return receivers.map((r) => (
      <>
        <p className="iu-fw-bold">Godkänd</p>
        <div role="radiogroup" aria-label="Radiogrupp för att godkänna intygsmottagare" className="ic-radio-group-horizontal">
          <RadioButton
            onChange={onChange}
            checked={chosenReceivers.some((item: any) => item.name === r && item.approved)}
            value={'true'}
            name={r}
            id={r + '_JA'}
            label={'Ja'}
          />
          <RadioButton
            onChange={onChange}
            checked={chosenReceivers.some((item: any) => item.name === r && !item.approved)}
            value={'false'}
            name={r}
            id={r + '_NEJ'}
            label={'Nej'}
          />
        </div>
      </>
    ))
  }

  return (
    <>
      <ModalBase
        open={open}
        handleClose={onClose}
        title={'Välj intygsmottagare'}
        content={
          <div className="iu-grid-cols">
            <div className="iu-grid-rows">{getReceivers()}</div>
            <div className="iu-grid-rows">{getRadioButtons()}</div>
          </div>
        }
        hideCross={!showClose}
        buttons={
          <>
            <CustomButton style={'primary'} disabled={confirmButtonDisabled} onClick={handleConfirm} text={'Spara'} />
            {showClose ? <CustomButton style={'secondary'} onClick={onClose} text={'Avbryt'} /> : ''}
          </>
        }
      />
    </>
  )
}

export default ChooseReceiverModal
