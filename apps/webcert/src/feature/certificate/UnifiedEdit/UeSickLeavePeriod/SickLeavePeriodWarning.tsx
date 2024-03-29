import React from 'react'
import { useSelector } from 'react-redux'
import { getSickLeavePeriodWarning } from '../../../../store/fmb/fmbSelectors'
import InfoBox from '../../../../components/utils/InfoBox'

export const SickLeavePeriodWarning: React.FC = () => {
  const warning = useSelector(getSickLeavePeriodWarning)

  if (warning === '' || warning == null) return null

  return (
    <div className="iu-mb-400">
      <InfoBox type={'info'} activateIconWrap>
        <p>{warning}</p>
      </InfoBox>
    </div>
  )
}
