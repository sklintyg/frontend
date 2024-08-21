import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { createCertificateFromCandidateWithMessage } from '../../../store/certificate/certificateActions'
import { getModalData } from '../../../store/certificate/certificateSelectors'
import { CustomButton } from '../../../components/Inputs/CustomButton'
import ModalBase from '../../../components/utils/Modal/ModalBase'
import { ResourceLink, ModalData } from '../../../types'
import { useKeyPress, sanitizeText } from '../../../utils'

interface Props {
  resourceLink: ResourceLink | undefined
}

const CreateCertificateFromCandidateWithMessageModal: React.FC<Props> = ({ resourceLink }) => {
  const dispatch = useDispatch()
  const [open, setOpen] = useState(false)
  const [showButton, setShowButton] = useState(true)
  const [modalData, setModalData] = useState<ModalData>({ title: resourceLink?.name ?? '', message: resourceLink?.body ?? '' })
  const escPress = useKeyPress('Escape')
  const modal = useSelector(getModalData())

  const handleClose = () => {
    setOpen(false)
  }

  useEffect(() => {
    if (modal) {
      setShowButton(false)
      setModalData(modal)
    }
  }, [modal])

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
    if (showButton) {
      dispatch(createCertificateFromCandidateWithMessage())
    }
  }

  return (
    <ModalBase
      open={open}
      handleClose={handleClose}
      title={modalData.title}
      content={<div className={'iu-pb-400'} dangerouslySetInnerHTML={sanitizeText(modalData.message as string)}></div>}
      buttons={
        <>
          <CustomButton onClick={handleClose} buttonStyle="default" text={showButton ? 'Avbryt' : 'Stäng'} />
          {showButton && <CustomButton onClick={handleConfirm} buttonStyle={'primary'} text={'Visa'} />}
        </>
      }
    />
  )
}

export default CreateCertificateFromCandidateWithMessageModal
