import React from 'react'
import InfoBox from '../../../components/utils/InfoBox'
import { CertificateDataElement, CertificateDataValueType, ConfigTypes } from '../../../types'
import UeCauseOfDeath from '../UnifiedEdit/UeCauseOfDeath/UeCauseOfDeath'
import UeCauseOfDeathList from '../UnifiedEdit/UeCauseOfDeath/UeCauseOfDeathList'
import UeCheckbox from '../UnifiedEdit/UeCheckbox/UeCheckbox'
import UeCheckboxDateGroup from '../UnifiedEdit/UeCheckboxDateGroup/UeCheckboxDateGroup'
import { UeCheckboxDateRangeList } from '../UnifiedEdit/UeCheckboxDateRangeList/UeCheckboxDateRangeList'
import UeCheckboxGroup from '../UnifiedEdit/UeCheckboxGroup/UeCheckboxGroup'
import UeDate from '../UnifiedEdit/UeDate/UeDate'
import UeDateRange from '../UnifiedEdit/UeDateRange/UeDateRange'
import UeDiagnoses from '../UnifiedEdit/UeDiagnosis/UeDiagnoses'
import UeDropdown from '../UnifiedEdit/UeDropdown/UeDropdown'
import UeIcf from '../UnifiedEdit/UeIcf/UeIcf'
import UeInteger from '../UnifiedEdit/UeInteger/UeInteger'
import UeMedicalInvestigationList from '../UnifiedEdit/UeMedicalInvestigation/UeMedicalInvestigationList'
import UeMessage from '../UnifiedEdit/UeMessage/UeMessage'
import UeRadio from '../UnifiedEdit/UeRadio/UeRadio'
import UeRadioGroup from '../UnifiedEdit/UeRadioGroup/UeRadioGroup'
import UeRadioGroupOptionalDropdown from '../UnifiedEdit/UeRadioGroupOptionalDropdown/UeRadioGroupOptionalDropdown'
import { UeSickLeavePeriod } from '../UnifiedEdit/UeSickLeavePeriod/UeSickLeavePeriod'
import UeTextArea from '../UnifiedEdit/UeTextArea/UeTextArea'
import UeTextField from '../UnifiedEdit/UeTextField/UeTextField'
import UeTypeahead from '../UnifiedEdit/UeTypeahead/UeTypeahead'
import UeUncertainDate from '../UnifiedEdit/UeUncertainDate/UeUncertainDate'
import UeViewList from '../UnifiedEdit/UeViewList/UeViewList'
import UeViewTable from '../UnifiedEdit/UeViewTable/UeViewTable'
import UeViewText from '../UnifiedEdit/UeViewText/UeViewText'
import UeVisualAcuity from '../UnifiedEdit/UeVisualAcuity/UeVisualAcuity'
import UeYear from '../UnifiedEdit/UeYear/UeYear'

interface Props {
  question: CertificateDataElement
  disabled: boolean
}

const QuestionUeResolve: React.FC<Props> = ({ question, disabled }) => {
  const value = question.value
  const config = question.config
  const commonProps = { key: question.id, disabled, question }

  if (config.type == ConfigTypes.UE_CHECKBOX_DATE_RANGE_LIST && value?.type === CertificateDataValueType.DATE_RANGE_LIST) {
    return <UeCheckboxDateRangeList key={question.id} disabled={disabled} question={{ ...question, config, value }} />
  }

  switch (question.config.type) {
    case ConfigTypes.UE_RADIO_BOOLEAN:
      return <UeRadio {...commonProps} />
    case ConfigTypes.UE_ICF:
      return <UeIcf {...commonProps} />
    case ConfigTypes.UE_TEXTAREA:
      return <UeTextArea {...commonProps} />
    case ConfigTypes.UE_CHECKBOX_BOOLEAN:
      return <UeCheckbox {...commonProps} />
    case ConfigTypes.UE_CHECKBOX_MULTIPLE_CODE:
      return <UeCheckboxGroup {...commonProps} />
    case ConfigTypes.UE_DROPDOWN:
      return <UeDropdown {...commonProps} />
    case ConfigTypes.UE_RADIO_MULTIPLE_CODE:
      return <UeRadioGroup {...commonProps} />
    case ConfigTypes.UE_CHECKBOX_MULTIPLE_DATE:
      return <UeCheckboxDateGroup {...commonProps} />
    case ConfigTypes.UE_SICK_LEAVE_PERIOD:
      return <UeSickLeavePeriod {...commonProps} />
    case ConfigTypes.UE_DIAGNOSES:
      return <UeDiagnoses {...commonProps} />
    case ConfigTypes.UE_RADIO_MULTIPLE_CODE_OPTIONAL_DROPDOWN:
      return <UeRadioGroupOptionalDropdown {...commonProps} />
    case ConfigTypes.UE_UNCERTAIN_DATE:
      return <UeUncertainDate {...commonProps} />
    case ConfigTypes.UE_MESSAGE:
      return <UeMessage {...commonProps} />
    case ConfigTypes.UE_TYPE_AHEAD:
      return <UeTypeahead {...commonProps} />
    case ConfigTypes.UE_TEXTFIELD:
      return <UeTextField {...commonProps} />
    case ConfigTypes.UE_DATE:
      return <UeDate {...commonProps} />
    case ConfigTypes.UE_DATE_RANGE:
      return <UeDateRange {...commonProps} />
    case ConfigTypes.UE_YEAR:
      return <UeYear {...commonProps} />
    case ConfigTypes.UE_INTEGER:
      return <UeInteger {...commonProps} />
    case ConfigTypes.UE_CAUSE_OF_DEATH:
      return <UeCauseOfDeath {...commonProps} />
    case ConfigTypes.UE_CAUSE_OF_DEATH_LIST:
      return <UeCauseOfDeathList {...commonProps} />
    case ConfigTypes.UE_MEDICAL_INVESTIGATION:
      return <UeMedicalInvestigationList {...commonProps} />
    case ConfigTypes.UE_VISUAL_ACUITY:
      return <UeVisualAcuity {...commonProps} />
    case ConfigTypes.UE_VIEW_TEXT:
      return <UeViewText {...commonProps} />
    case ConfigTypes.UE_VIEW_LIST:
      return <UeViewList {...commonProps} />
    case ConfigTypes.UE_VIEW_TABLE:
      return <UeViewTable {...commonProps} />
    case ConfigTypes.UE_HEADER:
      return null
    default:
      return <InfoBox type="error">Cannot find a component for: {question.config.type}</InfoBox>
  }
}

export default QuestionUeResolve
