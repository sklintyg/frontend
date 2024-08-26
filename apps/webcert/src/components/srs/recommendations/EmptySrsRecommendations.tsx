import type React from 'react'
import InfoBox from '../../utils/InfoBox'

interface Props {
  diagnosisCode?: string
  title: string
}

export const EmptySrsRecommendations: React.FC<Props> = ({ diagnosisCode, title }) => {
  return (
    <>
      <h3 className="iu-fw-bold iu-mb-200">{title}</h3>
      <InfoBox type="info">
        {`För ${diagnosisCode ? diagnosisCode : 'vald diagnoskod'} finns ingen SRS-information för detta fält.`}
      </InfoBox>
    </>
  )
}
