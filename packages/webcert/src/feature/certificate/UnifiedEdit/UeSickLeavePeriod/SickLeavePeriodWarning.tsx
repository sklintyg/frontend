import React from 'react'
import { useSelector } from 'react-redux'
import { getSickLeavePeriodWarning } from '../../../../store/fmb/fmbSelectors'
import { InfoBox } from '@frontend/common'

export const SickLeavePeriodWarning: React.FC = () => {
  const warning = useSelector(getSickLeavePeriodWarning)

  if (warning === '' || warning == null) return null

  return (
    <InfoBox type={'info'} additionalStyles="iu-mt-400" activateIconWrap>
      <p>{warning}</p>
    </InfoBox>
  )
}
