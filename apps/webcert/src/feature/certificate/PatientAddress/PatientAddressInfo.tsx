import { getIsEditable, getIsLocked, getIsUnsigned } from '../../../store/certificate/certificateSelectors'
import { useAppSelector } from '../../../store/store'
import PatientAddress from './PatientAddress'
import UvPatientAddress from './UvPatientAddress'

const PatientAddressInfo = () => {
  const isUnsigned = useAppSelector(getIsUnsigned())
  const isEditable = useAppSelector(getIsEditable)
  const isLocked = useAppSelector(getIsLocked)
  const ueMode = isUnsigned || isEditable || isLocked

  return ueMode ? <PatientAddress /> : <UvPatientAddress />
}

export default PatientAddressInfo
