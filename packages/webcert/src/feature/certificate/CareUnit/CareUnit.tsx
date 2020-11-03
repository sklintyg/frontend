import React from 'react'
import { useSelector } from 'react-redux'
import { getIsUnsigned, getIsEditable, getIsLocked } from '../../../store/certificate/certificateSelectors'
import UeCareUnitAddress from './UeCareUnitAddress'
import UvCareUnitAddress from './UvCareUnitAddress'

const CareUnit = () => {
  const isUnsigned = useSelector(getIsUnsigned())
  const isEditable = useSelector(getIsEditable)
  const isLocked = useSelector(getIsLocked)
  const ueMode = isUnsigned || isEditable || isLocked

  return ueMode ? <UeCareUnitAddress /> : <UvCareUnitAddress />
}

export default CareUnit
