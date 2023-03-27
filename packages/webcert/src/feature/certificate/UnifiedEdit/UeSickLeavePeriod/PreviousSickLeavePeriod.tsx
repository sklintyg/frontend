import React from 'react'
import { InfoBox } from '@frontend/common'

interface Props {
  previousSickLeavePeriod: string
}

export const PreviousSickLeavePeriod: React.FC<Props> = ({ previousSickLeavePeriod }) => {
  if (!previousSickLeavePeriod) {
    return null
  }

  return (
    <InfoBox type={'observe'} additionalStyles="iu-mt-400" activateIconWrap>
      <p>{previousSickLeavePeriod}</p>
    </InfoBox>
  )
}
