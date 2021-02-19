import * as React from 'react'
import { ValueBoolean, ValueCodeList, ValueCode, CertificateDataElement, ValueText } from '@frontend/common'
import {
  CertificateDataConfig,
  CertificateDataValueType,
  ConfigUeDiagnoses,
  ValueDiagnosis,
  ValueDiagnosisList,
} from '../../types/certificate'
import styled from 'styled-components'

const Root = styled.div`
  white-space: pre-wrap;
  display: inline-block;
  padding: 8px 14px;
`

interface UvTextProps {
  question: CertificateDataElement
}

const UvText: React.FC<UvTextProps> = ({ question }) => {
  let defaultStyling = true
  let displayText = 'Ej angivet'

  const getCodeListText = (id: string, config: CertificateDataConfig) => {
    const item = (config.list as ValueCode[]).find((item) => item.id === id)
    return '<li>' + item?.label + '</li>'
  }

  const getDiagnosisText = (diagnosis: ValueDiagnosis) => {
    return '<tr><td>' + diagnosis.code + '</td>' + '<td>' + diagnosis.description + '</td></tr>'
  }

  const getDiagnosisListText = (diagnosisListValue: ValueDiagnosisList, diagnosisListConfig: ConfigUeDiagnoses) => {
    let result =
      '<table class="ic-table"><tr><th>Diagnoskod enligt ' +
      getDiagnosisTerminologyLabel(diagnosisListValue.list[0].terminology, diagnosisListConfig) +
      '</th><th></th></tr>'
    ;(diagnosisListValue.list as ValueDiagnosis[]).map((value) => (result += getDiagnosisText(value)))
    result += '</table>'
    return result
  }

  const getDiagnosisTerminologyLabel = (id: string, config: ConfigUeDiagnoses) => {
    const terminology = config.terminology.find((t) => t.id === id)
    if (terminology) {
      return terminology.label
    } else {
      return id
    }
  }

  if (question.value !== undefined && question.value !== null) {
    switch (question.value.type) {
      case CertificateDataValueType.BOOLEAN:
        const booleanConfig = question.config
        const booleanValue = question.value as ValueBoolean
        if (booleanValue.selected !== null && question.visible) {
          displayText = booleanValue.selected ? (booleanConfig.selectedText as string) : (booleanConfig.unselectedText as string)
        }
        break
      case CertificateDataValueType.TEXT:
        const textValue = question.value as ValueText
        if (textValue.text != null && textValue.text.length > 0) {
          displayText = textValue.text
        }
        break
      case CertificateDataValueType.CODE_LIST:
        const codeListValue = question.value as ValueCodeList
        const codeListConfig = question.config
        if (codeListValue.list.length > 0 && question.visible) {
          displayText = ''
          const texts = (codeListValue.list as ValueCode[]).map((value) => getCodeListText(value.id, codeListConfig))
          texts.map((t) => (displayText += t))
        }
        break
      case CertificateDataValueType.DIAGNOSIS_LIST:
        const diagnosisListValue = question.value as ValueDiagnosisList
        const diagnosisListConfig = question.config as ConfigUeDiagnoses
        if (diagnosisListValue.list.length > 0 && question.visible) {
          displayText = getDiagnosisListText(diagnosisListValue, diagnosisListConfig)
        }
        defaultStyling = false
        break
      case CertificateDataValueType.CODE:
        const codeValue = question.value as ValueCode
        const codeConfig = question.config
        if (codeValue.id !== undefined && question.visible) {
          displayText = (codeConfig.list as ValueCode[]).find((item) => item.id === codeValue.id)?.label as string
        }
        break
      default:
        displayText = 'Okänd datatyp'
        break
    }
  }

  return (
    <Root className={`${defaultStyling ? 'iu-bg-secondary-light iu-radius-sm' : 'iu-p-none'}`}>
      <div className={'iu-fs-200'} dangerouslySetInnerHTML={{ __html: displayText }}></div>
    </Root>
  )
}

export default UvText
