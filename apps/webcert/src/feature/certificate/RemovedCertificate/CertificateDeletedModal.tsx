import ToastModal from '../../../components/utils/Modal/ToastModal'
import { updateRoutedFromDeletedCertificate } from '../../../store/certificate/certificateActions'
import { getIsRoutedFromDeletedCertificate } from '../../../store/certificate/certificateSelectors'
import { useAppDispatch, useAppSelector } from '../../../store/store'
import RemovedCertificate from '../RemovedCertificate/RemovedCertificate'

const CertificateDeletedModal = () => {
  const routedFromDeletedCertificate = useAppSelector(getIsRoutedFromDeletedCertificate())
  const dispatch = useAppDispatch()

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
