import { CertificateDataElement, ConfigUeViewTable, ValueViewTable, UvTable } from '@frontend/common'
import * as React from 'react'

export interface Props {
  question: CertificateDataElement
}

const UeViewTable: React.FC<Props> = ({ question }) => {
  return (
    <div className="iu-p-none">
      <UvTable value={question.value as ValueViewTable} config={question.config as ConfigUeViewTable} />
    </div>
  )
}

export default UeViewTable
