import React from 'react'
import { CertificateDataConfig, CheckboxCode, ValueCode, ValueCodeList } from '../../../types/certificate'
import { Badge } from '../Badge'

const getCodeListText = (id: string, config: CertificateDataConfig) => {
  const item = (config.list as CheckboxCode[]).find((item) => item.id === id)
  return item ? item.label : ''
}
const getCodeListConfigIndex = (id: string, config: CertificateDataConfig) => {
  return (config.list as CheckboxCode[]).findIndex((item) => item.id === id)
}

export const UvCodeList: React.FC<{
  value: ValueCodeList
  config: CertificateDataConfig
}> = ({ value, config }) => {
  if (value.list.length > 0) {
    return (
      <Badge>
        <ul>
          {(value.list as ValueCode[])
            .slice()
            .sort((a, b) => getCodeListConfigIndex(a.id, config) - getCodeListConfigIndex(b.id, config))
            .map((value) => (
              <li key={value.id}>{getCodeListText(value.id, config)}</li>
            ))}
        </ul>
      </Badge>
    )
  }
  return null
}
