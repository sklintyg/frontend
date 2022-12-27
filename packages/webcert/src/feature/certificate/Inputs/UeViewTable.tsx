import { CertificateDataElement, ConfigUeViewTable, ConfigViewColumn, ValueText, ValueTextRow, ValueViewTable } from '@frontend/common'
import * as React from 'react'

export interface Props {
  question: CertificateDataElement
}

const UeViewTable: React.FC<Props> = ({ question }) => {
  const value = question.value as ValueViewTable
  const questionConfig = question.config as ConfigUeViewTable

  return (
    <div className="iu-p-none">
      <table className="ic-table iu-fullwidth">
        <thead>
          <tr>
            {questionConfig.columns.map((column: ConfigViewColumn, index: number) => (
              <th key={index} scope="col">
                {column.title}
              </th>
            ))}
          </tr>
        </thead>
        {value && (
          <tbody>
            {value.rows.map((row: ValueTextRow, index: number) => (
              <tr key={index}>
                {questionConfig.columns.map((column: ConfigViewColumn, index: number) => (
                  <td key={index}>{row.columns.find((rowColumn: ValueText) => rowColumn.id === column.id)?.text ?? ''}</td>
                ))}
              </tr>
            ))}
          </tbody>
        )}
      </table>
    </div>
  )
}

export default UeViewTable
