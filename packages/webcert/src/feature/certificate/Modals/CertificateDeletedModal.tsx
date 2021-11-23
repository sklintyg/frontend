import React from 'react'
import RemovedCertificate from '../RemovedCertificate/RemovedCertificate'
import ToastModal from './ToastModal'

interface Props {
  routedFromDeletedCertificate: boolean
}

const CertificateDeletedModal: React.FC<Props> = ({ routedFromDeletedCertificate }) => {
  if (!routedFromDeletedCertificate) return null

  return (
    <ToastModal>
      <RemovedCertificate />
    </ToastModal>
  )
}

export default CertificateDeletedModal
