import { useCallback } from 'react'
import InfoBox from '../../../components/utils/InfoBox'
import { updateCertificateDataElement } from '../../../store/certificate/certificateActions'
import { useAppDispatch } from '../../../store/store'
import type { CertificateDataConfigType, CertificateDataElement, ValueType } from '../../../types'
import { CertificateDataValueType, ConfigTypes } from '../../../types'
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
import { UeMedicalInvestigationList } from '../UnifiedEdit/UeMedicalInvestigation/UeMedicalInvestigationList'
import UeRadio from '../UnifiedEdit/UeRadio/UeRadio'
import UeRadioGroup from '../UnifiedEdit/UeRadioGroup/UeRadioGroup'
import UeRadioGroupOptionalDropdown from '../UnifiedEdit/UeRadioGroupOptionalDropdown/UeRadioGroupOptionalDropdown'
import UeTextArea from '../UnifiedEdit/UeTextArea/UeTextArea'
import UeTextField from '../UnifiedEdit/UeTextField/UeTextField'
import UeTypeahead from '../UnifiedEdit/UeTypeahead/UeTypeahead'
import UeUncertainDate from '../UnifiedEdit/UeUncertainDate/UeUncertainDate'
import UeViewList from '../UnifiedEdit/UeViewList/UeViewList'
import UeViewTable from '../UnifiedEdit/UeViewTable/UeViewTable'
import UeViewText from '../UnifiedEdit/UeViewText/UeViewText'
import UeVisualAcuity from '../UnifiedEdit/UeVisualAcuity/UeVisualAcuity'
import UeYear from '../UnifiedEdit/UeYear/UeYear'
import type { UnifiedEdit } from '../UnifiedEdit/UnifiedEdit'

function isQuestionTypes<C extends ConfigTypes, V extends CertificateDataValueType | null>(
  configType: C,
  valueType: V,
  question: CertificateDataElement
): question is CertificateDataElement & {
  config: Extract<CertificateDataConfigType, { type: C }>
  value: Extract<ValueType, { type: V }>
} {
  return question.config.type === configType && question.value?.type === valueType
}

export function QuestionUeResolve({ question, disabled }: { question: CertificateDataElement; disabled: boolean }) {
  const dispatch = useAppDispatch()
  const commonProps = { disabled, question }

  const questionToUeProps = useCallback(
    <C extends CertificateDataConfigType, V extends ValueType>(config: C, value: V): UnifiedEdit<C, V> & { key: string } => ({
      key: question.id,
      question: { ...question, config, value },
      disabled,
      onUpdate: (value: ValueType) => {
        dispatch(updateCertificateDataElement({ ...question, value }))
      },
    }),
    [disabled, dispatch, question]
  )

  if (isQuestionTypes(ConfigTypes.UE_CHECKBOX_DATE_RANGE_LIST, CertificateDataValueType.DATE_RANGE_LIST, question)) {
    return <UeCheckboxDateRangeList {...questionToUeProps(question.config, question.value)} key={question.id} />
  }

  switch (question.config.type) {
    case ConfigTypes.UE_RADIO_BOOLEAN:
      return <UeRadio {...commonProps} key={question.id} />
    case ConfigTypes.UE_ICF:
      return <UeIcf {...commonProps} key={question.id} />
    case ConfigTypes.UE_TEXTAREA:
      return <UeTextArea {...commonProps} key={question.id} />
    case ConfigTypes.UE_CHECKBOX_BOOLEAN:
      return <UeCheckbox {...commonProps} key={question.id} />
    case ConfigTypes.UE_CHECKBOX_MULTIPLE_CODE:
      return <UeCheckboxGroup {...commonProps} key={question.id} />
    case ConfigTypes.UE_DROPDOWN:
      return <UeDropdown {...commonProps} key={question.id} />
    case ConfigTypes.UE_RADIO_MULTIPLE_CODE:
      return <UeRadioGroup {...commonProps} key={question.id} />
    case ConfigTypes.UE_CHECKBOX_MULTIPLE_DATE:
      return <UeCheckboxDateGroup {...commonProps} key={question.id} />
    case ConfigTypes.UE_DIAGNOSES:
      return <UeDiagnoses {...commonProps} key={question.id} />
    case ConfigTypes.UE_RADIO_MULTIPLE_CODE_OPTIONAL_DROPDOWN:
      return <UeRadioGroupOptionalDropdown {...commonProps} key={question.id} />
    case ConfigTypes.UE_UNCERTAIN_DATE:
      return <UeUncertainDate {...commonProps} key={question.id} />
    case ConfigTypes.UE_TYPE_AHEAD:
      return <UeTypeahead {...commonProps} key={question.id} />
    case ConfigTypes.UE_TEXTFIELD:
      return <UeTextField {...commonProps} key={question.id} />
    case ConfigTypes.UE_DATE:
      return <UeDate {...commonProps} key={question.id} />
    case ConfigTypes.UE_DATE_RANGE:
      return <UeDateRange {...commonProps} key={question.id} />
    case ConfigTypes.UE_YEAR:
      return <UeYear {...commonProps} key={question.id} />
    case ConfigTypes.UE_INTEGER:
      return <UeInteger {...commonProps} key={question.id} />
    case ConfigTypes.UE_CAUSE_OF_DEATH:
      return <UeCauseOfDeath {...commonProps} key={question.id} />
    case ConfigTypes.UE_CAUSE_OF_DEATH_LIST:
      return <UeCauseOfDeathList {...commonProps} key={question.id} />
    case ConfigTypes.UE_MEDICAL_INVESTIGATION:
      return <UeMedicalInvestigationList {...commonProps} key={question.id} />
    case ConfigTypes.UE_VISUAL_ACUITY:
      return <UeVisualAcuity {...commonProps} key={question.id} />
    case ConfigTypes.UE_VIEW_TEXT:
      return <UeViewText {...commonProps} key={question.id} />
    case ConfigTypes.UE_VIEW_LIST:
      return <UeViewList {...commonProps} key={question.id} />
    case ConfigTypes.UE_VIEW_TABLE:
      return <UeViewTable {...commonProps} key={question.id} />
    case ConfigTypes.UE_HEADER:
      return null
    case ConfigTypes.UE_MESSAGE:
      return null
  }

  return (
    <InfoBox type="error">
      Cannot find a component for config: {question.config.type} {question.value && <span>and value: {question.value.type}</span>}.
    </InfoBox>
  )
}
