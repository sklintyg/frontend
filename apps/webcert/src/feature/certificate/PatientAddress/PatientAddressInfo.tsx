import React from 'react'
import { useSelector } from 'react-redux'
import { getIsEditable, getIsLocked, getIsUnsigned } from '../../../store/certificate/certificateSelectors'
import PatientAddress from './PatientAddress'
import UvPatientAddress from './UvPatientAddress'

const PatientAddressInfo: React.FC = () => {
  const isUnsigned = useSelector(getIsUnsigned())
  const isEditable = useSelector(getIsEditable)
  const isLocked = useSelector(getIsLocked)
  const ueMode = isUnsigned || isEditable || isLocked

  return ueMode ? <PatientAddress /> : <UvPatientAddress />
}

export default PatientAddressInfo
