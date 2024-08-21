import React from 'react'
import {
  CertificateDataConfig,
  CheckboxCode,
  ConfigLayout,
  ConfigTypes,
  ConfigUeCheckboxMultipleCodes,
  ValueCode,
  ValueCodeList,
} from '../../../types'
import { Badge } from '../Badge'

const getCodeListText = (id: string, config: CertificateDataConfig) => {
  const item = (config.list as CheckboxCode[]).find((item) => item.id === id)
  return item ? item.label : ''
}
const getCodeListConfigIndex = (id: string, config: CertificateDataConfig) => {
  return (config.list as CheckboxCode[]).findIndex((item) => item.id === id)
}

const getCode = (value: ValueCode, config: CertificateDataConfig, isLastValue: boolean) => {
  return (
    <div key={value.id}>
      {getCodeListText(value.id, config)}
      {!isLastValue && ', '}
    </div>
  )
}

const isInline = (config: CertificateDataConfig) => {
  return config.type === ConfigTypes.UE_CHECKBOX_MULTIPLE_CODE && (config as ConfigUeCheckboxMultipleCodes).layout === ConfigLayout.INLINE
}

function getCompareFunction(config: CertificateDataConfig) {
  return (a: ValueCode, b: ValueCode) => getCodeListConfigIndex(a.id, config) - getCodeListConfigIndex(b.id, config)
}

export const UvCodeList: React.FC<{
  value: ValueCodeList
  config: CertificateDataConfig
}> = ({ value, config }) => {
  if (value.list.length > 0) {
    return (
      <Badge>
        {isInline(config) ? (
          <>
            {(value.list as ValueCode[])
              .slice()
              .sort(getCompareFunction(config))
              .map((v, index) => getCode(v, config, index + 1 === value.list.length))}
          </>
        ) : (
          <ul>
            {(value.list as ValueCode[])
              .slice()
              .sort(getCompareFunction(config))
              .map((v) => (
                <li key={v.id}>{getCodeListText(v.id, config)}</li>
              ))}
          </ul>
        )}
      </Badge>
    )
  }
  return (
    <Badge>
      <p>Ej angivet</p>
    </Badge>
  )
}
