import React, { useEffect } from 'react'
import { CustomButton, ModalBase } from '@frontend/common'
import { useKeyPress } from '@frontend/common/src/utils/userFunctionUtils'
import { createCertificateFromCandidate } from '../../../store/certificate/certificateActions'
import { useDispatch } from 'react-redux'
import { ResourceLink } from '@frontend/common/src'

interface Props {
  resourceLink: ResourceLink | undefined
}

const CreateCertificateFromCandidateModal: React.FC<Props> = ({ resourceLink }) => {
  const dispatch = useDispatch()
  const [open, setOpen] = React.useState(false)
  const escPress = useKeyPress('Escape')

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
    dispatch(createCertificateFromCandidate())
  }

  const handleClose = () => {
    setOpen(false)
  }

  return (
    <ModalBase
      open={open}
      handleClose={handleClose}
      title={resourceLink.name}
      content={<div className={'iu-pb-400'} dangerouslySetInnerHTML={{ __html: resourceLink.body as string }}></div>}
      buttons={
        <>
          <CustomButton onClick={handleConfirm} buttonStyle={'primary'} text={'Kopiera'} />
          <CustomButton onClick={handleClose} buttonStyle="default" text="Avbryt" />
        </>
      }
    />
  )
}

export default CreateCertificateFromCandidateModal
