import { getIsEditable, getIsLocked, getIsUnsigned } from '../../../store/certificate/certificateSelectors'
import { useAppSelector } from '../../../store/store'
import UeCareUnitAddress from './UeCareUnitAddress'
import UvCareUnitAddress from './UvCareUnitAddress'

const CareUnit = () => {
  const isUnsigned = useAppSelector(getIsUnsigned())
  const isEditable = useAppSelector(getIsEditable)
  const isLocked = useAppSelector(getIsLocked)
  const ueMode = isUnsigned || isEditable || isLocked

  return ueMode ? <UeCareUnitAddress /> : <UvCareUnitAddress />
}

export default CareUnit
