import {
  CertificateDataConfig,
  CertificateDataElement,
  CertificateDataValueType,
  CheckboxCode,
  ConfigUeCheckboxDateRange,
  ConfigUeCheckboxMultipleDate,
  ConfigUeDiagnoses,
  ConfigUeIcf,
  ConfigUeSickLeavePeriod,
  ValueBoolean,
  ValueCode,
  ValueCodeList,
  ValueDateList,
  ValueDateRange,
  ValueDiagnosis,
  ValueDiagnosisList,
  ValueText,
} from '@frontend/common'
import { getQuestion } from '@frontend/webcert/src/store/certificate/certificateSelectors'
import _ from 'lodash'
import * as React from 'react'
import { useSelector } from 'react-redux'
import styled from 'styled-components'
import {
  CertificateDataElementStyleEnum,
  ConfigTypes,
  ConfigUeCheckboxBoolean,
  ConfigUeRadioMultipleCodesOptionalDropdown,
  ValueDate,
  ValueUncertainDate,
} from '../../types/certificate'
import Badge from './Badge'

const IcfCode = styled.p`
  flex-shrink: 0;
`

const IcfCodeWrapper = styled.div`
  flex-wrap: wrap;
`

export interface Props {
  question: CertificateDataElement
}

const UvText: React.FC<Props> = ({ question }) => {
  const getOptionalDropdown = () => {
    if (question.config.type === ConfigTypes.UE_RADIO_MULTIPLE_CODE_OPTIONAL_DROPDOWN) {
      return (question.config as ConfigUeRadioMultipleCodesOptionalDropdown).list.find(
        (r) => r.dropdownQuestionId && r.id === (question.value as ValueCode).id
      )
    }
  }

  const optionalDropdown = getOptionalDropdown()
  const questionWithOptionalDropdown = useSelector(getQuestion(optionalDropdown ? optionalDropdown.dropdownQuestionId : ''), _.isEqual)

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

  const getCheckboxBooleanText = (value: ValueBoolean, config: ConfigUeCheckboxBoolean): JSX.Element => {
    return (
      <>
        <Badge>
          {value.selected === undefined || value.selected === null
            ? 'Ej angivet'
            : value.selected
            ? config.selectedText
            : config.unselectedText}
        </Badge>
      </>
    )
  }

  const getCodeListText = (id: string, config: CertificateDataConfig) => {
    const item = (config.list as CheckboxCode[]).find((item) => item.id === id)
    return item ? item.label : ''
  }

  const getCodeListConfigIndex = (id: string, config: CertificateDataConfig) => {
    const index = (config.list as CheckboxCode[]).findIndex((item) => item.id === id)
    return index
  }

  const getDiagnosisListText = (diagnosisListValue: ValueDiagnosisList, diagnosisListConfig: ConfigUeDiagnoses) => {
    return (
      <table className="ic-table iu-fullwidth">
        <thead>
          <tr>
            <th>{`Diagnoskod enligt ICD-10 SE`}</th>
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
      <table className="ic-table iu-fullwidth">
        <thead>
          <tr>
            <th scope="col">Nedsättningsgrad</th>
            <th scope="col">Från och med</th>
            <th scope="col">Till och med</th>
          </tr>
        </thead>
        <tbody>
          {configList
            .slice()
            .reverse()
            .map((element, index) => {
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

  const getCodeValue = (questionElement: CertificateDataElement): string => {
    const codeValue = questionElement.value as ValueCode
    const codeConfig = questionElement.config
    if (codeValue.id !== undefined && questionElement.visible) {
      const chosenValue = (codeConfig.list as ValueCode[]).find((item) => item.id === codeValue.id)
      return chosenValue ? (chosenValue.label as string) : ''
    }
    return 'Ej angivet'
  }

  const getUVText = () => {
    if (question.value === undefined || question.value === null) {
      return null
    }

    let displayText

    switch (question.value.type) {
      case CertificateDataValueType.BOOLEAN: {
        const booleanConfig = question.config as ConfigUeCheckboxBoolean
        const booleanValue = question.value as ValueBoolean
        return getCheckboxBooleanText(booleanValue, booleanConfig)
      }
      case CertificateDataValueType.TEXT: {
        const textValue = question.value as ValueText
        if (textValue.text != null && textValue.text.length > 0) {
          displayText = textValue.text
        }
        break
      }
      case CertificateDataValueType.CODE_LIST: {
        const codeListValue = question.value as ValueCodeList
        const codeListConfig = question.config
        if (codeListValue.list.length > 0 && question.visible) {
          return (
            <Badge>
              <ul>
                {(codeListValue.list as ValueCode[])
                  .slice()
                  .sort((a, b) => getCodeListConfigIndex(a.id, codeListConfig) - getCodeListConfigIndex(b.id, codeListConfig))
                  .map((value, key) => (
                    <li key={value.id}>{getCodeListText(value.id, codeListConfig)}</li>
                  ))}
              </ul>
            </Badge>
          )
        }
        break
      }
      case CertificateDataValueType.DIAGNOSIS_LIST: {
        const diagnosisListValue = question.value as ValueDiagnosisList
        const diagnosisListConfig = question.config as ConfigUeDiagnoses
        if (diagnosisListValue.list.length > 0 && question.visible) {
          return <div className={'iu-p-none'}>{getDiagnosisListText(diagnosisListValue, diagnosisListConfig)}</div>
        }
        break
      }
      case CertificateDataValueType.CODE: {
        displayText = getCodeValue(question)
        if (questionWithOptionalDropdown) {
          displayText += ` ${getCodeValue(questionWithOptionalDropdown)}`
        }
        break
      }
      case CertificateDataValueType.DATE_LIST: {
        const dateListValue = question.value as ValueDateList
        const dateListConfig = question.config as ConfigUeCheckboxMultipleDate
        if (question.visible) {
          return getDateListDisplayValue(dateListValue, dateListConfig)
        }
        break
      }
      case CertificateDataValueType.DATE_RANGE_LIST: {
        const dateRangeListValue = question.value.list as ValueDateRange[]
        const dateRangeListConfig = (question.config as ConfigUeSickLeavePeriod).list
        if (dateRangeListValue.length > 0 && dateRangeListValue.some((val) => val.from && val.to)) {
          return getDateRangeListDisplayValue(dateRangeListValue, dateRangeListConfig)
        }
        break
      }
      case CertificateDataValueType.ICF: {
        const icfCodes = question.value.icfCodes as string[]
        const icfTextValue = question.value.text as string
        const collectionsLabel = (question.config as ConfigUeIcf).collectionsLabel

        if ((icfCodes && icfCodes.length) || (icfTextValue && icfTextValue.length)) {
          return getUvIcf(collectionsLabel, icfCodes, icfTextValue)
        }
        break
      }
      case CertificateDataValueType.DATE: {
        const textValueDate = question.value as ValueDate
        if (textValueDate.date != null && textValueDate.date.length > 0) {
          displayText = textValueDate.date
        }
        break
      }
      case CertificateDataValueType.UNCERTAIN_DATE: {
        const textValueUncertainDate = question.value as ValueUncertainDate
        if (textValueUncertainDate.value != null && textValueUncertainDate.value.length > 0) {
          displayText = textValueUncertainDate.value
        }
        break
      }
      default: {
        displayText = 'Okänd datatyp'
        break
      }
    }
    if (displayText && displayText.length > 0 && question.style !== CertificateDataElementStyleEnum.HIDDEN) {
      return <Badge>{displayText}</Badge>
    }
  }

  return <>{getUVText()}</>
}

export default UvText
