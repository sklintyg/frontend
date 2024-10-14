import { isEqual } from 'lodash-es'
import type React from 'react'
import { useSelector } from 'react-redux'
import { Badge } from '../../../components/UnifiedView/Badge'
import { UvBoolean } from '../../../components/UnifiedView/UvBoolean/UvBoolean'
import { UvCauseOfDeath } from '../../../components/UnifiedView/UvCauseOfDeath/UvCauseOfDeath'
import { UvCauseOfDeathList } from '../../../components/UnifiedView/UvCauseOfDeathList/UvCauseOfDeathList'
import { UvCode } from '../../../components/UnifiedView/UvCode/UvCode'
import { UvCodeList } from '../../../components/UnifiedView/UvCodeList/UvCodeList'
import { UvDate } from '../../../components/UnifiedView/UvDate/UvDate'
import { UvDateList } from '../../../components/UnifiedView/UvDateList/UvDateList'
import { UvDateRange } from '../../../components/UnifiedView/UvDateRange/UvDateRange'
import { UvDateRangeList } from '../../../components/UnifiedView/UvDateRangeList/UvDateRangeList'
import { UvDiagnosisList } from '../../../components/UnifiedView/UvDiagnosisList/UvDiagnosisList'
import { UvIcf } from '../../../components/UnifiedView/UvIcf/UvIcf'
import { UvInteger } from '../../../components/UnifiedView/UvInteger/UvInteger'
import { UvMedicalInvestigationList } from '../../../components/UnifiedView/UvMedicalInvestigationList/UvMedicalInvestigationList'
import { UvTable } from '../../../components/UnifiedView/UvTable/UvTable'
import { UvText } from '../../../components/UnifiedView/UvText/UvText'
import { UvUncertainDate } from '../../../components/UnifiedView/UvUncertainDate/UvUncertainDate'
import { UvViewList } from '../../../components/UnifiedView/UvViewList/UvViewList'
import { UvVisualAcuity } from '../../../components/UnifiedView/UvVisualAcuity/UvVisualAcuity'
import { UvYear } from '../../../components/UnifiedView/UvYear/UvYear'
import { getQuestion } from '../../../store/certificate/certificateSelectors'
import type {
  CertificateDataElement,
  ConfigUeCauseOfDeath,
  ConfigUeCauseOfDeathList,
  ConfigUeCheckboxBoolean,
  ConfigUeCheckboxDateRangeList,
  ConfigUeCheckboxMultipleDate,
  ConfigUeDateRange,
  ConfigUeIcf,
  ConfigUeInteger,
  ConfigUeMedicalInvestigationList,
  ConfigUeViewTable,
  ConfigUeVisualAcuity,
  ValueCode,
} from '../../../types'
import { CertificateDataElementStyleEnum, CertificateDataValueType, ConfigTypes } from '../../../types'

const QuestionUvResolve: React.FC<{
  question: CertificateDataElement
}> = ({ question }) => {
  const getOptionalDropdown = () => {
    if (question.config.type === ConfigTypes.UE_RADIO_MULTIPLE_CODE_OPTIONAL_DROPDOWN) {
      return question.config.list.find((r) => r.dropdownQuestionId && r.id === (question.value as ValueCode).id)
    }
  }
  const optionalDropdown = getOptionalDropdown()
  const questionWithOptionalDropdown = useSelector(getQuestion(optionalDropdown ? optionalDropdown.dropdownQuestionId : ''), isEqual)

  if (question.value == null || question.visible === false || question.style === CertificateDataElementStyleEnum.HIDDEN) {
    return null
  }

  switch (question.value.type) {
    case CertificateDataValueType.BOOLEAN:
      return <UvBoolean config={question.config as ConfigUeCheckboxBoolean} value={question.value} />

    case CertificateDataValueType.TEXT:
    case CertificateDataValueType.VIEW_TEXT:
      return <UvText value={question.value} />

    case CertificateDataValueType.VIEW_LIST:
      return <UvViewList value={question.value} />

    case CertificateDataValueType.VIEW_TABLE:
      return <UvTable config={question.config as ConfigUeViewTable} value={question.value} />

    case CertificateDataValueType.CODE_LIST:
      return <UvCodeList config={question.config} value={question.value} />

    case CertificateDataValueType.DIAGNOSIS_LIST:
      return <UvDiagnosisList value={question.value} />

    case CertificateDataValueType.CODE:
      return <UvCode value={question.value} config={question.config} questionWithOptionalDropdown={questionWithOptionalDropdown} />

    case CertificateDataValueType.DATE_LIST:
      return <UvDateList value={question.value} config={question.config as ConfigUeCheckboxMultipleDate}></UvDateList>

    case CertificateDataValueType.DATE_RANGE:
      return <UvDateRange value={question.value} config={question.config as ConfigUeDateRange} />

    case CertificateDataValueType.DATE_RANGE_LIST:
      return <UvDateRangeList value={question.value} config={question.config as ConfigUeCheckboxDateRangeList} />

    case CertificateDataValueType.ICF:
      return <UvIcf value={question.value} config={question.config as ConfigUeIcf} />

    case CertificateDataValueType.DATE:
      return <UvDate value={question.value} />

    case CertificateDataValueType.UNCERTAIN_DATE:
      return <UvUncertainDate value={question.value} />

    case CertificateDataValueType.CAUSE_OF_DEATH:
      return <UvCauseOfDeath value={question.value} config={question.config as ConfigUeCauseOfDeath} />

    case CertificateDataValueType.CAUSE_OF_DEATH_LIST:
      return <UvCauseOfDeathList value={question.value} config={question.config as ConfigUeCauseOfDeathList} />

    case CertificateDataValueType.MEDICAL_INVESTIGATION_LIST:
      return <UvMedicalInvestigationList value={question.value} config={question.config as ConfigUeMedicalInvestigationList} />

    case CertificateDataValueType.VISUAL_ACUITIES:
      return <UvVisualAcuity value={question.value} config={question.config as ConfigUeVisualAcuity} />

    case CertificateDataValueType.YEAR:
      return <UvYear value={question.value} />

    case CertificateDataValueType.INTEGER:
      return <UvInteger value={question.value} config={question.config as ConfigUeInteger} />
    default:
      return <Badge>Okänd datatyp</Badge>
  }
}
export default QuestionUvResolve
