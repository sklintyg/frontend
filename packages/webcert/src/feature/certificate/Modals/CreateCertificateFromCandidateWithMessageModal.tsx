import { CustomButton, ModalBase, ResourceLink, sanitizeText } from '@frontend/common'
import { useKeyPress } from '@frontend/common/src/utils/userFunctionUtils'
import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { createCertificateFromCandidateWithMessage } from '../../../store/certificate/certificateActions'

interface Props {
  resourceLink: ResourceLink | undefined
}

const CreateCertificateFromCandidateWithMessageModal: React.FC<Props> = ({ resourceLink }) => {
  const dispatch = useDispatch()
  const [open, setOpen] = React.useState(false)
  const escPress = useKeyPress('Escape')

  const handleClose = () => {
    setOpen(false)
  }

  useEffect(() => {
    if (escPress) {
      handleClose()
    }
  }, [escPress])

  useEffect(() => {
    if (resourceLink && resourceLink.enabled) {
      setOpen(true)
    }
  }, [resourceLink])

  if (!resourceLink) {
    return null
  }

  const handleConfirm = () => {
    dispatch(createCertificateFromCandidateWithMessage())
  }

  return (
    <ModalBase
      open={open}
      handleClose={handleClose}
      title={resourceLink.title}
      content={<div className={'iu-pb-400'} dangerouslySetInnerHTML={sanitizeText(resourceLink.body as string)}></div>}
      buttons={
        <>
          <CustomButton onClick={handleClose} buttonStyle="default" text="Avbryt" />
          <CustomButton onClick={handleConfirm} buttonStyle={'primary'} text={'Visa'} />
        </>
      }
    />
  )
}

export default CreateCertificateFromCandidateWithMessageModal
