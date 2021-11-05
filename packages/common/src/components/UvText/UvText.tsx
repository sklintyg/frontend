import * as React from 'react'
import {
  CertificateDataElement,
  CertificateDataValueType,
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
  ConfigUeIcf,
  CheckboxCode,
} from '@frontend/common'
import styled from 'styled-components'
import Badge from './Badge'

const IcfCode = styled.p`
  flex-shrink: 0;
`

const IcfCodeWrapper = styled.div`
  flex-wrap: wrap;
`

interface UvTextProps {
  question: CertificateDataElement
}

const UvText: React.FC<UvTextProps> = ({ question }) => {
  const getUvIcf = (collectionsLabel: string, icfCodes: string[], textValue: string) => {
    return (
      <Badge>
        <div className={'iu-fs-200'}>
          {icfCodes && icfCodes.length > 0 && (
            <>
              <p>{collectionsLabel}</p>
              <IcfCodeWrapper className={'iu-flex iu-mb-400'}>
                {icfCodes.map((code, i) => (
                  <React.Fragment key={code}>
                    <IcfCode>{code}</IcfCode>
                    {i !== icfCodes.length - 1 && <label className={'iu-ml-200 iu-mr-200'}>-</label>}
                  </React.Fragment>
                ))}
              </IcfCodeWrapper>
            </>
          )}
          <p>{textValue}</p>
        </div>
      </Badge>
    )
  }

  const getCodeListText = (id: string, config: CertificateDataConfig) => {
    const item = (config.list as CheckboxCode[]).find((item) => item.id === id)
    return <li key={id}>{item?.label}</li>
  }

  const getDiagnosisListText = (diagnosisListValue: ValueDiagnosisList, diagnosisListConfig: ConfigUeDiagnoses) => {
    return (
      <table className="ic-table">
        <thead>
          <tr>
            <th>{`Diagnoskod enligt ${getDiagnosisTerminologyLabel(diagnosisListValue.list[0].terminology, diagnosisListConfig)}`}</th>
            <th />
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
          <Badge>
            <div className={'iu-fs-200'}>{foundValue ? foundValue.date : 'Ej angivet'}</div>
          </Badge>
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
            <Badge>
              <ul>{(codeListValue.list as ValueCode[]).map((value, key) => getCodeListText(value.id, codeListConfig))}</ul>
            </Badge>
          )
        }
        break
      case CertificateDataValueType.DIAGNOSIS_LIST:
        const diagnosisListValue = question.value as ValueDiagnosisList
        const diagnosisListConfig = question.config as ConfigUeDiagnoses
        if (diagnosisListValue.list.length > 0 && question.visible) {
          return <div className={'iu-p-none'}>{getDiagnosisListText(diagnosisListValue, diagnosisListConfig)}</div>
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
      case CertificateDataValueType.ICF:
        const icfCodes = question.value.icfCodes as string[]
        const icfTextValue = question.value.text as string
        const collectionsLabel = (question.config as ConfigUeIcf).collectionsLabel

        if ((icfCodes && icfCodes.length) || (icfTextValue && icfTextValue.length)) {
          return getUvIcf(collectionsLabel, icfCodes, icfTextValue)
        }
        break
      default:
        displayText = 'Okänd datatyp'
        break
    }
    if (displayText && displayText.length > 0) {
      return <Badge>{displayText}</Badge>
    }
  }

  return <>{getUVText()}</>
}

export default UvText
