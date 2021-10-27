import React, { useEffect } from 'react'
import { CustomButton, ModalBase } from '@frontend/common'
import { useKeyPress } from '@frontend/common/src/utils/userFunctionUtils'
import { createCertificateFromCandidate } from '../../../store/certificate/certificateActions'
import { useDispatch } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { ResourceLink, resourceLinksAreEqual, ResourceLinkType } from '@frontend/common/src'

interface Props {
  resourceLinks: ResourceLink[]
}

const CreateCertificateFromCandidateModal: React.FC<Props> = ({ resourceLinks }) => {
  const dispatch = useDispatch()
  const [open, setOpen] = React.useState(false)
  const escPress = useKeyPress('Escape')
  const resourceLink = resourceLinks.find((link) => resourceLinksAreEqual(link.type, ResourceLinkType.CREATE_CERTIFICATE_FROM_CANDIDATE))

  useEffect(() => {
    if (escPress) {
      handleClose()
    }
  }, [escPress])

  useEffect(() => {
    if (resourceLink) {
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
