import React from 'react'
import RemovedCertificate from '../RemovedCertificate/RemovedCertificate'
import { ToastModal } from '@frontend/common'
import { updateRoutedFromDeletedCertificate } from '../../../store/certificate/certificateActions'
import { useDispatch } from 'react-redux'

interface Props {
  routedFromDeletedCertificate: boolean
}

const CertificateDeletedModal: React.FC<Props> = ({ routedFromDeletedCertificate }) => {
  const dispatch = useDispatch()

  if (!routedFromDeletedCertificate) return null

  const handleClose = () => {
    dispatch(updateRoutedFromDeletedCertificate(false))
  }

  return (
    <ToastModal onClose={handleClose}>
      <RemovedCertificate />
    </ToastModal>
  )
}

export default CertificateDeletedModal
