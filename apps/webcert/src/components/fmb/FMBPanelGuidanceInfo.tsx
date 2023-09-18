import { FMBDiagnosisCodeInfoFormContent } from '@frontend/common'
import React from 'react'

interface Props {
  info: FMBDiagnosisCodeInfoFormContent
}

const FMBPanelGuidanceInfo: React.FC<Props> = ({ info }) => {
  if (info.text) {
    return <li>{info.text}</li>
  }

  return info.list
    ? info.list?.map((item: string, index: number) => (
        <li key={index} className="iu-mt-300">
          {item}
        </li>
      ))
    : null
}

export default FMBPanelGuidanceInfo
