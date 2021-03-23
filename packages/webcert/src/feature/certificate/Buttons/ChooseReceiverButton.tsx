import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEnvelope } from '@fortawesome/free-solid-svg-icons'
import { useDispatch, useSelector } from 'react-redux'
import { getCertificateMetaData } from '../../../store/certificate/certificateSelectors'
import { CustomButton } from '@frontend/common'
import ChooseReceiverModal from '../Modal/ChooseReceiverModal'

interface Props {
  receivers: string[]
  name: string
  description: string
  enabled: boolean
}

const ChooseReceiverButton: React.FC<Props> = ({ name, description, enabled, receivers }) => {
  const certificateMetadata = useSelector(getCertificateMetaData)
  const startIcon = <FontAwesomeIcon size="lg" icon={faEnvelope} />

  const openOnLoad = (): boolean => {
    return (
      certificateMetadata?.approvedReceivers === undefined ||
      certificateMetadata?.approvedReceivers === null ||
      certificateMetadata?.approvedReceivers.length === 0
    )
  }

  const [open, setOpen] = React.useState(openOnLoad())
  const [hideClose, setHideClose] = React.useState(openOnLoad())

  if (!certificateMetadata) return null

  const handleOpen = () => {
    setOpen(true)
    return
  }

  const handleClose = () => {
    setHideClose(false)
    setOpen(false)
    return
  }

  return (
    <>
      <CustomButton
        tooltip={description}
        style={'primary'}
        disabled={!enabled}
        onClick={handleOpen}
        startIcon={startIcon ? startIcon : null}
        text={name}
      />
      <ChooseReceiverModal hideClose={hideClose} open={open} handleClose={handleClose} receivers={receivers} />
    </>
  )
}

export default ChooseReceiverButton
