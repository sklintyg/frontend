import { CertificateDataElement, ConfigUeViewList, ValueViewList, ValueViewText } from '@frontend/common'
import Badge from '@frontend/common/src/components/UvText/Badge'
import * as React from 'react'

export interface Props {
  question: CertificateDataElement
}

const UeViewList: React.FC<Props> = ({ question }) => {
  const value = question.value as ValueViewList
  const questionConfig = question.config as ConfigUeViewList

  return (
    <div className="iu-pt-200 iu-grid-cols-12">
      <div className="iu-grid-span-6">
        {questionConfig.label ? <label>{questionConfig.label}</label> : ''}
        <Badge>
          {value && (
            <ul>
              {value.list.map((i: ValueViewText) => (
                <li>{i.text}</li>
              ))}
            </ul>
          )}
        </Badge>
      </div>
    </div>
  )
}

export default UeViewList
