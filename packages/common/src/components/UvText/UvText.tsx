import {
  CertificateDataConfig,
  CertificateDataElement,
  CertificateDataElementStyleEnum,
  CertificateDataValueType,
  CheckboxCode,
  ConfigTypes,
  ConfigUeCauseOfDeath,
  ConfigUeCauseOfDeathControl,
  ConfigUeCauseOfDeathList,
  ConfigUeCheckboxBoolean,
  ConfigUeCheckboxDateRange,
  ConfigUeCheckboxMultipleDate,
  ConfigUeCodeItem,
  ConfigUeIcf,
  ConfigUeMedicalInvestigationList,
  ConfigUeRadioMultipleCodesOptionalDropdown,
  ConfigUeSickLeavePeriod,
  ConfigUeViewTable,
  ConfigUeVisualAcuity,
  ConfigViewColumn,
  formatAcuity,
  ValueBoolean,
  ValueCauseOfDeath,
  ValueCauseOfDeathList,
  ValueCode,
  ValueCodeList,
  ValueDate,
  ValueDateList,
  ValueDateRange,
  ValueDiagnosis,
  ValueDiagnosisList,
  ValueMedicalInvestigation,
  ValueMedicalInvestigationList,
  ValueText,
  ValueTextRow,
  ValueUncertainDate,
  ValueViewList,
  ValueViewTable,
  ValueViewText,
  ValueVisualAcuity,
} from '@frontend/common'
import UeMessage from '@frontend/webcert/src/feature/certificate/Inputs/UeMessage'
import { getQuestion } from '@frontend/webcert/src/store/certificate/certificateSelectors'
import _ from 'lodash'
import * as React from 'react'
import { useSelector } from 'react-redux'
import styled from 'styled-components'
import Badge from './Badge'
import UvTable from './UvTable'

const IcfCode = styled.p`
  flex-shrink: 0;
`
const IcfCodeWrapper = styled.div`
  flex-wrap: wrap;
`
const CauseOfDeathWrapper = styled.div`
  display: inline-block;
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
  const getDiagnosisListText = (diagnosisListValue: ValueDiagnosisList) => {
    const columns: ConfigViewColumn[] = [
      { id: 'kod', text: `Diagnoskod enligt ICD-10 SE` },
      { id: 'desc', text: '' },
    ]
    const rows: ValueTextRow[] = (diagnosisListValue.list as ValueDiagnosis[]).map(
      (diagnosis) =>
        ({
          columns: [
            { id: 'kod', text: diagnosis.code },
            { id: 'desc', text: diagnosis.description },
          ],
        } as ValueTextRow)
    )
    return rows && <UvTable columns={columns} rows={rows} />
  }
  const getDateListDisplayValue = (value: ValueDateList, config: ConfigUeCheckboxMultipleDate) => {
    return config.list.map((element, index) => {
      const foundValue = value.list.find((v) => v.id === element.id)
      return (
        <React.Fragment key={index}>
          <p className={'iu-fs-200 iu-fw-bold iu-pb-200 iu-pt-400'}>{element.label}</p>
          <Badge>
            <div className={'iu-fs-200'}>{foundValue ? foundValue.date : 'Ej angivet'}</div>
          </Badge>
        </React.Fragment>
      )
    })
  }
  const getDateRangeListDisplayValue = (valueList: ValueDateRange[], configList: ConfigUeCheckboxDateRange[]) => {
    const columns: ConfigViewColumn[] = [
      { id: 'degree', text: 'Nedsättningsgrad' },
      { id: 'from', text: 'Från och med' },
      { id: 'to', text: 'Till och med' },
    ]
    const rows: ValueTextRow[] = []
    configList
      .slice()
      .reverse()
      .forEach((element) => {
        const foundValue = valueList.find((v) => v.id === element.id && (v.from || v.to))
        if (foundValue) {
          rows.push({
            columns: [
              { id: 'degree', text: element.label },
              { id: 'from', text: foundValue.from },
              { id: 'to', text: foundValue.to },
            ],
          } as ValueTextRow)
        }
      })

    return rows && <UvTable columns={columns} rows={rows} />
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

  const getMedicalInvestigationValue = (questionElement: CertificateDataElement) => {
    const medicalInvestigationValueList = questionElement.value as ValueMedicalInvestigationList
    const medicalInvestigationConfigList = questionElement.config as ConfigUeMedicalInvestigationList
    const columns: ConfigViewColumn[] = [
      { id: 'investigation', text: 'Ange utredning eller underlag' },
      { id: 'date', text: 'Datum' },
      { id: 'careGiver', text: 'Vårdgivare' },
    ]
    const rows: ValueTextRow[] = []
    medicalInvestigationConfigList.list.forEach((medicalConfig) => {
      const medicalValue = (medicalInvestigationValueList.list as ValueMedicalInvestigation[]).find(
        (item) => item.investigationType.id === medicalConfig.investigationTypeId
      )
      if (medicalValue?.informationSource.text !== undefined) {
        const codeValue = (medicalConfig.typeOptions as ConfigUeCodeItem[]).find(
          (value) => value.code === medicalValue?.investigationType.code
        )
        rows.push({
          columns: [
            { id: 'investigation', text: codeValue?.label ?? '' },
            { id: 'date', text: medicalValue?.date.date ?? '' },
            { id: 'careGiver', text: medicalValue?.informationSource.text ?? '' },
          ],
        } as ValueTextRow)
      }
    })
    return rows && <UvTable columns={columns} rows={rows} />
  }
  const getCauseOfDeathRow = (description: string, debut: string, specification: string) => {
    return (
      <CauseOfDeathWrapper>
        <div>
          <p className={'iu-fs-200 iu-fw-bold iu-pb-200 iu-pt-300'}>Beskrivning</p>
          <Badge>{description}</Badge>
        </div>
        <div className="iu-flex">
          <div className=" iu-mr-600">
            <p className={'iu-fs-200 iu-fw-bold iu-pb-200 iu-pt-300'}>Ungefärlig debut</p>
            <Badge>{debut}</Badge>
          </div>
          <div>
            <p className={'iu-fs-200 iu-fw-bold iu-pb-200 iu-pt-300'}>Specificera tillståndet</p>
            <Badge>{specification}</Badge>
          </div>
        </div>
      </CauseOfDeathWrapper>
    )
  }
  const getCauseOfDeathValue = (questionElement: CertificateDataElement) => {
    const causeOfDeathValue = questionElement.value as ValueCauseOfDeath
    const causeOfDeathConfig = questionElement.config as ConfigUeCauseOfDeath
    const causeOfDeathControlConfig = causeOfDeathConfig.causeOfDeath as ConfigUeCauseOfDeathControl
    if (questionElement.visible) {
      const chosenSpec = (causeOfDeathControlConfig.specifications as ConfigUeCodeItem[]).find(
        (item) => item.code === causeOfDeathValue.specification.code
      )
      return (
        <>
          {causeOfDeathConfig.label && <div className="iu-fl iu-fs-700 iu-mr-400 iu-pt-200">{causeOfDeathConfig.label}</div>}
          {getCauseOfDeathRow(
            causeOfDeathValue.description?.text ?? 'Ej angivet',
            causeOfDeathValue.debut?.date ?? 'Ej angivet',
            chosenSpec?.label ?? 'Ej angivet'
          )}
        </>
      )
    }
    return ''
  }
  const getCauseOfDeathValueList = (questionElement: CertificateDataElement) => {
    const causeOfDeathValueList = questionElement.value as ValueCauseOfDeathList
    const causeOfDeathListConfig = questionElement.config as ConfigUeCauseOfDeathList
    const columns: ConfigViewColumn[] = [
      { id: 'descr', text: 'Beskrivning' },
      { id: 'date', text: 'Ungefärlig debut' },
      { id: 'spec', text: 'Specificera tillståndet' },
    ]
    const rows: ValueTextRow[] = []

    if (causeOfDeathValueList !== undefined && questionElement.visible) {
      causeOfDeathListConfig.list.forEach((causeOfDeathControlConfig) => {
        const causeOfDeathValue = causeOfDeathValueList.list.find((item) => item.id === causeOfDeathControlConfig.id)
        if (causeOfDeathValue?.description?.text || causeOfDeathValue?.debut?.date || causeOfDeathValue?.specification?.code) {
          const chosenSpec = (causeOfDeathControlConfig.specifications as ConfigUeCodeItem[]).find(
            (item) => item.code === causeOfDeathValue.specification.code
          )
          rows.push({
            columns: [
              { id: 'descr', text: causeOfDeathValue.description?.text ?? 'Ej angivet' },
              { id: 'date', text: causeOfDeathValue.debut?.date ?? 'Ej angivet' },
              { id: 'spec', text: chosenSpec?.label ?? 'Ej angivet' },
            ],
          } as ValueTextRow)
        }
      })
    }

    return rows && <UvTable columns={columns} rows={rows} />
  }

  const getVisualAcuityValue = (questionElement: CertificateDataElement) => {
    const visualAcuityValue = questionElement.value as ValueVisualAcuity
    const configVisualAcuity = questionElement.config as ConfigUeVisualAcuity

    return (
      <table className="ic-table iu-fullwidth">
        <thead>
          <tr>
            <th scope="col"></th>
            <th scope="col">{configVisualAcuity.withoutCorrectionLabel}</th>
            <th scope="col">{configVisualAcuity.withCorrectionLabel}</th>
            <th scope="col">{configVisualAcuity.contactLensesLabel}</th>
          </tr>
        </thead>
        <tbody>
          {[
            { ...visualAcuityValue.rightEye, label: configVisualAcuity.rightEye.label },
            { ...visualAcuityValue.leftEye, label: configVisualAcuity.leftEye.label },
            { ...visualAcuityValue.binocular, label: configVisualAcuity.binocular.label },
          ].map(({ label, withoutCorrection, withCorrection, contactLenses }, index) => {
            return (
              <tr key={index}>
                <td>{label}</td>
                <td>{formatAcuity(`${withoutCorrection.value}`)}</td>
                <td>{formatAcuity(`${withCorrection.value}`)}</td>
                <td>{contactLenses ? (contactLenses.selected === true ? 'Ja' : 'Nej') : '-'}</td>
              </tr>
            )
          })}
        </tbody>
      </table>
    )
  }
  const getUVText = () => {
    if (question.config.type === ConfigTypes.UE_MESSAGE && question.visible) {
      const questionProps = { key: question.id, disabled: false, question }
      return <UeMessage {...questionProps} />
    }
    if (question.value === undefined || question.value === null || !question.visible) {
      return null
    }
    let displayText = 'Ej angivet'
    switch (question.value.type) {
      case CertificateDataValueType.BOOLEAN: {
        const booleanConfig = question.config as ConfigUeCheckboxBoolean
        const booleanValue = question.value as ValueBoolean
        return getCheckboxBooleanText(booleanValue, booleanConfig)
      }
      case CertificateDataValueType.TEXT:
      case CertificateDataValueType.VIEW_TEXT: {
        const textValue = question.value as ValueText | ValueViewText
        if (textValue.text != null && textValue.text.length > 0) {
          displayText = textValue.text
        }
        break
      }
      case CertificateDataValueType.VIEW_LIST: {
        const listValue = question.value as ValueViewList
        return (
          <Badge>
            {listValue && (
              <ul>
                {listValue.list.map((i: ValueViewText, index: number) => (
                  <li key={index}>{i.text}</li>
                ))}
              </ul>
            )}
          </Badge>
        )
      }
      case CertificateDataValueType.VIEW_TABLE: {
        const columns = (question.config as ConfigUeViewTable).columns
        const rows = (question.value as ValueViewTable).rows

        return rows && <UvTable columns={columns} rows={rows} />
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
                  .map((value) => (
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
        if (diagnosisListValue.list.length > 0 && question.visible) {
          return <div className={'iu-p-none'}>{getDiagnosisListText(diagnosisListValue)}</div>
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
      case CertificateDataValueType.CAUSE_OF_DEATH: {
        return getCauseOfDeathValue(question)
      }
      case CertificateDataValueType.CAUSE_OF_DEATH_LIST: {
        return getCauseOfDeathValueList(question)
      }
      case CertificateDataValueType.MEDICAL_INVESTIGATION_LIST: {
        if (question.visible) {
          return <div className={'iu-p-none'}>{getMedicalInvestigationValue(question)}</div>
        }
        break
      }
      case CertificateDataValueType.VISUAL_ACUITIES: {
        return getVisualAcuityValue(question)
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
