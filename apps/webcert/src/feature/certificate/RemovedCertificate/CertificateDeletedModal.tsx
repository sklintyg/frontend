import { useDispatch, useSelector } from 'react-redux'
import ToastModal from '../../../components/utils/Modal/ToastModal'
import { updateRoutedFromDeletedCertificate } from '../../../store/certificate/certificateActions'
import { getIsRoutedFromDeletedCertificate } from '../../../store/certificate/certificateSelectors'
import RemovedCertificate from '../RemovedCertificate/RemovedCertificate'

const CertificateDeletedModal = () => {
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
