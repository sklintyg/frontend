import {
  Badge,
  CertificateDataElement,
  CertificateDataElementStyleEnum,
  CertificateDataValueType,
  ConfigTypes,
  ConfigUeCauseOfDeath,
  ConfigUeCauseOfDeathList,
  ConfigUeCheckboxBoolean,
  ConfigUeCheckboxMultipleDate,
  ConfigUeDateRange,
  ConfigUeIcf,
  ConfigUeInteger,
  ConfigUeMedicalInvestigationList,
  ConfigUeRadioMultipleCodesOptionalDropdown,
  ConfigUeSickLeavePeriod,
  ConfigUeViewTable,
  ConfigUeVisualAcuity,
  UvBoolean,
  UvCauseOfDeath,
  UvCauseOfDeathList,
  UvCode,
  UvCodeList,
  UvDate,
  UvDateList,
  UvDateRange,
  UvDateRangeList,
  UvDiagnosisList,
  UvIcf,
  UvInteger,
  UvMedicalInvestigationList,
  UvTable,
  UvText,
  UvUncertainDate,
  UvViewList,
  UvVisualAcuity,
  UvYear,
  ValueBoolean,
  ValueCauseOfDeath,
  ValueCauseOfDeathList,
  ValueCode,
  ValueCodeList,
  ValueDate,
  ValueDateList,
  ValueDateRange,
  ValueDateRangeList,
  ValueDiagnosisList,
  ValueIcf,
  ValueInteger,
  ValueMedicalInvestigationList,
  ValueUncertainDate,
  ValueViewList,
  ValueViewTable,
  ValueVisualAcuity,
} from '@frontend/common'
import _ from 'lodash'
import React from 'react'
import { useSelector } from 'react-redux'
import { getQuestion } from '../../../store/certificate/certificateSelectors'
import UeMessage from '../UnifiedEdit/UeMessage/UeMessage'

const QuestionUvResolve: React.FC<{
  question: CertificateDataElement
}> = ({ question }) => {
  const getOptionalDropdown = () => {
    if (question.config.type === ConfigTypes.UE_RADIO_MULTIPLE_CODE_OPTIONAL_DROPDOWN) {
      return (question.config as ConfigUeRadioMultipleCodesOptionalDropdown).list.find(
        (r) => r.dropdownQuestionId && r.id === (question.value as ValueCode).id
      )
    }
  }
  const optionalDropdown = getOptionalDropdown()
  const questionWithOptionalDropdown = useSelector(getQuestion(optionalDropdown ? optionalDropdown.dropdownQuestionId : ''), _.isEqual)

  if (question.config.type === ConfigTypes.UE_MESSAGE && question.visible) {
    return <UeMessage key={question.id} disabled={false} question={question} />
  }

  if (question.value == null || question.visible === false || question.style === CertificateDataElementStyleEnum.HIDDEN) {
    return null
  }

  switch (question.value.type) {
    case CertificateDataValueType.BOOLEAN:
      return <UvBoolean config={question.config as ConfigUeCheckboxBoolean} value={question.value as ValueBoolean} />

    case CertificateDataValueType.TEXT:
    case CertificateDataValueType.VIEW_TEXT:
      return <UvText value={question.value} />

    case CertificateDataValueType.VIEW_LIST:
      return <UvViewList value={question.value as ValueViewList} />

    case CertificateDataValueType.VIEW_TABLE:
      return <UvTable config={question.config as ConfigUeViewTable} value={question.value as ValueViewTable} />

    case CertificateDataValueType.CODE_LIST:
      return <UvCodeList config={question.config} value={question.value as ValueCodeList} />

    case CertificateDataValueType.DIAGNOSIS_LIST:
      return <UvDiagnosisList value={question.value as ValueDiagnosisList} />

    case CertificateDataValueType.CODE:
      return (
        <UvCode value={question.value as ValueCode} config={question.config} questionWithOptionalDropdown={questionWithOptionalDropdown} />
      )

    case CertificateDataValueType.DATE_LIST:
      return <UvDateList value={question.value as ValueDateList} config={question.config as ConfigUeCheckboxMultipleDate}></UvDateList>

    case CertificateDataValueType.DATE_RANGE:
      return <UvDateRange value={question.value as ValueDateRange} config={question.config as ConfigUeDateRange} />

    case CertificateDataValueType.DATE_RANGE_LIST:
      return <UvDateRangeList value={question.value as ValueDateRangeList} config={question.config as ConfigUeSickLeavePeriod} />

    case CertificateDataValueType.ICF:
      return <UvIcf value={question.value as ValueIcf} config={question.config as ConfigUeIcf} />

    case CertificateDataValueType.DATE:
      return <UvDate value={question.value as ValueDate} />

    case CertificateDataValueType.UNCERTAIN_DATE:
      return <UvUncertainDate value={question.value as ValueUncertainDate} />

    case CertificateDataValueType.CAUSE_OF_DEATH:
      return <UvCauseOfDeath value={question.value as ValueCauseOfDeath} config={question.config as ConfigUeCauseOfDeath} />

    case CertificateDataValueType.CAUSE_OF_DEATH_LIST:
      return <UvCauseOfDeathList value={question.value as ValueCauseOfDeathList} config={question.config as ConfigUeCauseOfDeathList} />

    case CertificateDataValueType.MEDICAL_INVESTIGATION_LIST:
      return (
        <UvMedicalInvestigationList
          value={question.value as ValueMedicalInvestigationList}
          config={question.config as ConfigUeMedicalInvestigationList}
        />
      )

    case CertificateDataValueType.VISUAL_ACUITIES:
      return <UvVisualAcuity value={question.value as ValueVisualAcuity} config={question.config as ConfigUeVisualAcuity} />

    case CertificateDataValueType.YEAR:
      return <UvYear value={question.value} />

    case CertificateDataValueType.INTEGER:
      return <UvInteger value={question.value as ValueInteger} config={question.config as ConfigUeInteger} />
    default:
      return <Badge>Okänd datatyp</Badge>
  }
}
export default QuestionUvResolve
