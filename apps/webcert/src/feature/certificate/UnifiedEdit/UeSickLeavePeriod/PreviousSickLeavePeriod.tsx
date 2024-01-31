import React from 'react'
import InfoBox from '../../../../components/utils/InfoBox'

interface Props {
  previousSickLeavePeriod: string
}

export const PreviousSickLeavePeriod: React.FC<Props> = ({ previousSickLeavePeriod }) => {
  if (!previousSickLeavePeriod) {
    return null
  }

  return (
    <div className="iu-mb-400">
      <InfoBox type={'observe'} activateIconWrap>
        <p>{previousSickLeavePeriod}</p>
      </InfoBox>
    </div>
  )
}
