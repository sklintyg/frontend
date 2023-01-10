import { CertificateDataElement, ConfigUeViewTable, ValueViewTable } from '@frontend/common'
import UvTable from '@frontend/common/src/components/UvText/UvTable'
import * as React from 'react'

export interface Props {
  question: CertificateDataElement
}

const UeViewTable: React.FC<Props> = ({ question }) => {
  const value = question.value as ValueViewTable
  const questionConfig = question.config as ConfigUeViewTable
  const columns = questionConfig.columns
  const rows = value.rows

  return (
    <div className="iu-p-none">
      <UvTable columns={columns} rows={rows} />
    </div>
  )
}

export default UeViewTable
