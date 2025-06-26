import { Badge } from '../../../../components/UnifiedView/Badge'
import type { CertificateDataElement, ValueViewList, ConfigUeViewList, ValueViewText } from '../../../../types'

export interface Props {
  question: CertificateDataElement
}

const UeViewList = ({ question }: Props) => {
  const value = question.value as ValueViewList
  const questionConfig = question.config as ConfigUeViewList

  return (
    <div className="iu-grid-cols-12">
      <div className="iu-grid-span-6">
        {questionConfig.label ? <label>{questionConfig.label}</label> : ''}
        <Badge>
          {value && (
            <ul>
              {value.list.map((i: ValueViewText, index: number) => (
                <li key={index}>{i.text}</li>
              ))}
            </ul>
          )}
        </Badge>
      </div>
    </div>
  )
}

export default UeViewList
