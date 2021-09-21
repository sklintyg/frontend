import * as React from 'react'
import {
  CertificateDataElement,
  CertificateDataValueType,
  CheckboxCode,
  ValueBoolean,
  ValueCode,
  ValueCodeList,
  ValueText,
  CertificateDataConfig,
  ConfigUeCheckboxDateRange,
  ConfigUeCheckboxMultipleDate,
  ConfigUeDiagnoses,
  ConfigUeSickLeavePeriod,
  ValueDateList,
  ValueDateRange,
  ValueDiagnosis,
  ValueDiagnosisList,
} from '@frontend/common'
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
  const getCodeListText = (id: string, config: CertificateDataConfig) => {
    const item = (config.list as CheckboxCode[]).find((item) => item.id === id)
    return <li>{item?.label}</li>
  }

  const getDiagnosisListText = (diagnosisListValue: ValueDiagnosisList, diagnosisListConfig: ConfigUeDiagnoses) => {
    return (
      <table className="ic-table">
        <thead>
          <tr>
            <th>{`Diagnoskod enligt ${getDiagnosisTerminologyLabel(diagnosisListValue.list[0].terminology, diagnosisListConfig)}`}</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {(diagnosisListValue.list as ValueDiagnosis[]).map((diagnosis) => (
            <tr key={diagnosis.code}>
              <td>{diagnosis.code}</td>
              <td>{diagnosis.description}</td>
            </tr>
          ))}
        </tbody>
      </table>
    )
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
    return config.list.map((element, index) => {
      const foundValue = value.list.find((v) => v.id === element.id)
      return (
        <React.Fragment key={element.label}>
          <p className={'iu-fs-200 iu-fw-bold iu-pb-200 iu-pt-400'}>{element.label}</p>
          <Root key={index} className={'iu-bg-secondary-light iu-radius-sm'}>
            <div className={'iu-fs-200'}>{foundValue ? foundValue.date : 'Ej angivet'}</div>
          </Root>
        </React.Fragment>
      )
    })
  }

  const getDateRangeListDisplayValue = (valueList: ValueDateRange[], configList: ConfigUeCheckboxDateRange[]) => {
    return (
      <table className="ic-table">
        <thead>
          <tr>
            <th scope="col">Nedsättningsgrad</th>
            <th scope="col">Från och med</th>
            <th scope="col">Till och med</th>
          </tr>
        </thead>
        <tbody>
          {configList.map((element, index) => {
            const foundValue = valueList.find((v) => v.id === element.id)

            if (!foundValue?.from || !foundValue.to) return null

            return (
              <tr key={element.id}>
                <td>{element.label}</td>
                <td>{foundValue.from}</td>
                <td>{foundValue.to}</td>
              </tr>
            )
          })}
        </tbody>
      </table>
    )
  }

  // This function gets a warning for rendering children withous keys.

  const getUVText = () => {
    if (question.value === undefined || question.value === null) {
      return null
    }

    let displayText = 'Ej angivet'

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
              {(codeListValue.list as ValueCode[]).map((value, key) => (
                <div key={key}>{getCodeListText(value.id, codeListConfig)}</div>
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
              <div>{getDiagnosisListText(diagnosisListValue, diagnosisListConfig)}</div>
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
        if (question.visible) {
          return getDateListDisplayValue(dateListValue, dateListConfig)
        }
        break
      case CertificateDataValueType.DATE_RANGE_LIST:
        const dateRangeListValue = question.value.list as ValueDateRange[]
        const dateRangeListConfig = (question.config as ConfigUeSickLeavePeriod).list
        if (dateRangeListValue.length > 0 && dateRangeListValue.some((val) => val.from && val.to)) {
          return getDateRangeListDisplayValue(dateRangeListValue, dateRangeListConfig)
        }
        break
      default:
        displayText = 'Okänd datatyp'
        break
    }
    if (displayText && displayText.length > 0) {
      return (
        <Root className={'iu-bg-secondary-light iu-radius-sm'}>
          <div className={'iu-fs-200'}>{displayText}</div>
        </Root>
      )
    }
  }

  return <>{getUVText()}</>
}

export default UvText
