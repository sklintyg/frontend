import { UvText } from '../../../../components/UnifiedView/UvText/UvText'
import type { CertificateDataElement, ConfigUeViewText, ValueViewText } from '../../../../types'

export interface Props {
  question: CertificateDataElement
}

const UeViewText = ({ question }: Props) => {
  const questionConfig = question.config as ConfigUeViewText

  return (
    <div className="iu-grid-cols-12">
      <div className="iu-grid-span-6">
        {questionConfig.label && <label>{questionConfig.label}</label>}
        <UvText value={question.value as ValueViewText} />
      </div>
    </div>
  )
}

export default UeViewText
