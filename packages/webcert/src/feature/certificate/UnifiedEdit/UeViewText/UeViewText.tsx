import { CertificateDataElement, ConfigUeViewText, ValueViewText } from '@frontend/common'
import Badge from '@frontend/common/src/components/UvText/Badge'
import * as React from 'react'

export interface Props {
  question: CertificateDataElement
}

const UeViewText: React.FC<Props> = ({ question }) => {
  const value = question.value as ValueViewText
  const questionConfig = question.config as ConfigUeViewText

  return (
    <div className="iu-pt-200 iu-grid-cols-12">
      <div className="iu-grid-span-6">
        {questionConfig.label && <label>{questionConfig.label}</label>}
        <Badge>{value && value.text}</Badge>
      </div>
    </div>
  )
}

export default UeViewText
