import React from 'react'
import { CertificateDataElement } from '../../../types/certificate'
import { CertificateDataConfig } from '../../../types/certificateDataConfig'
import { ValueCode } from '../../../types/certificateDataValue'
import { Badge } from '../Badge'

type CodeConfigListItem = { id: string; label: string }

const getChosenValue = (needle: string, haystack: Record<string, unknown>[]): CodeConfigListItem | undefined =>
  haystack
    .filter((item): item is CodeConfigListItem => typeof item.id == 'string' && typeof item.label == 'string')
    .find((item) => item.id === needle)

const getCodeLabel = (value: ValueCode, config: CertificateDataConfig): string | undefined => {
  if (value.id !== undefined && config.list instanceof Array) {
    const chosenValue = getChosenValue(value.id, config.list)
    if (chosenValue && chosenValue.label.length > 0) {
      return chosenValue.label
    }
    return undefined
  }
  return 'Ej angivet'
}

export const UvCode: React.FC<{
  value: ValueCode
  config: CertificateDataConfig
  questionWithOptionalDropdown?: CertificateDataElement
}> = ({ value, config, questionWithOptionalDropdown }) => {
  const label = getCodeLabel(value, config)
  if (questionWithOptionalDropdown) {
    return <Badge>{`${label} ${getCodeLabel(questionWithOptionalDropdown.value as ValueCode, questionWithOptionalDropdown.config)}`}</Badge>
  }
  return <Badge>{label}</Badge>
}
