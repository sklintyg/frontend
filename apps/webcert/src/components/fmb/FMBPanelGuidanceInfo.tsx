import { FMBDiagnosisCodeInfoFormContent } from '@frontend/common'
import React from 'react'

interface Props {
  info: FMBDiagnosisCodeInfoFormContent
}

const FMBPanelGuidanceInfo: React.FC<Props> = ({ info }) => {
  if (!info.text && !info.list) {
    return null
  }

  return info.text ? (
    <li>{info.text}</li>
  ) : (
    info.list?.map((item: string, index: number) => (
      <li key={index} className="iu-mt-300">
        {item}
      </li>
    ))
  )
}

export default FMBPanelGuidanceInfo
