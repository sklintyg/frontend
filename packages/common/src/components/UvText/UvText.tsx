import * as React from 'react'
import { ValueBoolean, ValueCodeList, ValueCode, CertificateDataElement, ValueText } from '@frontend/common'
import {
  CertificateDataConfig,
  CertificateDataValueType,
  ConfigUeCheckboxMultipleDate,
  ConfigUeDiagnoses,
  ValueDateList,
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

  const getDateListDisplayValue = (value: ValueDateList, config: ConfigUeCheckboxMultipleDate) => {
    return value.list.map((element, index) => (
      <>
        <p className={'iu-fs-200 iu-fw-bold iu-pb-200 iu-pt-400'}>{config.list.find((c) => c.id === element.id)?.label}</p>
        <Root className={'iu-bg-secondary-light iu-radius-sm'}>
          <div className={'iu-fs-200'}>{element.date}</div>
        </Root>
      </>
    ))
  }

  const getUVText = () => {
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
            return (
              <Root className={'iu-bg-secondary-light iu-radius-sm'}>
                {(codeListValue.list as ValueCode[]).map((value) => (
                  <div dangerouslySetInnerHTML={{ __html: getCodeListText(value.id, codeListConfig) }}></div>
                ))}
              </Root>
            )
          }
          break
        case CertificateDataValueType.DIAGNOSIS_LIST:
          const diagnosisListValue = question.value as ValueDiagnosisList
          const diagnosisListConfig = question.config as ConfigUeDiagnoses
          if (diagnosisListValue.list.length > 0 && question.visible) {
            return (
              <Root className={'iu-p-none'}>
                <div dangerouslySetInnerHTML={{ __html: getDiagnosisListText(diagnosisListValue, diagnosisListConfig) }}></div>
              </Root>
            )
          }
          break
        case CertificateDataValueType.CODE:
          const codeValue = question.value as ValueCode
          const codeConfig = question.config
          if (codeValue.id !== undefined && question.visible) {
            displayText = (codeConfig.list as ValueCode[]).find((item) => item.id === codeValue.id)?.label as string
          }
          break
        case CertificateDataValueType.DATE_LIST:
          const dateListValue = question.value as ValueDateList
          const dateListConfig = question.config as ConfigUeCheckboxMultipleDate
          if (dateListValue.list.length > 0 && question.visible) {
            return getDateListDisplayValue(dateListValue, dateListConfig)
          }
          break
        default:
          displayText = 'Okänd datatyp'
          break
      }
      if (displayText.length > 0) {
        return (
          <Root className={'iu-bg-secondary-light iu-radius-sm'}>
            <div className={'iu-fs-200'} dangerouslySetInnerHTML={{ __html: displayText }}></div>
          </Root>
        )
      }
    }
  }

  return <>{getUVText()}</>
}

export default UvText
