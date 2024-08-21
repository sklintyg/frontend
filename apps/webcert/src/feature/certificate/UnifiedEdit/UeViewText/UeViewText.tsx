import { UvText } from '../../../../components/UnifiedView/UvText/UvText'
import { CertificateDataElement, ConfigUeViewText, ValueViewText } from '../../../../types'

export interface Props {
  question: CertificateDataElement
}

const UeViewText: React.FC<Props> = ({ question }) => {
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
