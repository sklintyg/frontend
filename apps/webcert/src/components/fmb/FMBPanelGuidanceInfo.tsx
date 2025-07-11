import type { FMBDiagnosisCodeInfoFormContent } from '../../types'

interface Props {
  info: FMBDiagnosisCodeInfoFormContent
}

const FMBPanelGuidanceInfo = ({ info }: Props) => {
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
