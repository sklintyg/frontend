import { ToastModal } from '@frontend/common'
import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { updateRoutedFromDeletedCertificate } from '../../../store/certificate/certificateActions'
import { getIsRoutedFromDeletedCertificate } from '../../../store/certificate/certificateSelectors'
import RemovedCertificate from '../RemovedCertificate/RemovedCertificate'

const CertificateDeletedModal: React.FC = () => {
  const routedFromDeletedCertificate = useSelector(getIsRoutedFromDeletedCertificate())
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
