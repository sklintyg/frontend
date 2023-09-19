import { FMBDiagnosisCodeInfoFormContent } from '@frontend/common'
import React from 'react'

interface Props {
  info: FMBDiagnosisCodeInfoFormContent
}

const FMBPanelGuidanceInfo: React.FC<Props> = ({ info }) => {
  if (info.text) {
    return (
      <ul>
        <li>{info.text}</li>
      </ul>
    )
  }

  return info.list ? (
    <ul>
      {info.list.map((item: string, index: number) => (
        <li key={index} className="iu-mt-300">
          {item}
        </li>
      ))}
    </ul>
  ) : null
}

export default FMBPanelGuidanceInfo
