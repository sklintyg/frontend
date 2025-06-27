import type React from 'react'

interface Props {
  title: string
}

const FMBPanelDiagnosisHeader = ({ title }: Props) => {
  return (
    <div className="iu-bg-grey-300">
      <p className="iu-fw-heading iu-p-200 iu-pl-500">{title}</p>
    </div>
  )
}

export default FMBPanelDiagnosisHeader
