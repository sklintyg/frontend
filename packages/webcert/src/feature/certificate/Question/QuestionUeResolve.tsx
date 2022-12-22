import { CertificateDataElement, ConfigTypes, InfoBox } from '@frontend/common'
import React from 'react'
import UeCauseOfDeath from '../Inputs/UeCauseOfDeath/UeCauseOfDeath'
import UeCauseOfDeathList from '../Inputs/UeCauseOfDeath/UeCauseOfDeathList'
import UeCheckbox from '../Inputs/UeCheckbox'
import UeCheckboxDateGroup from '../Inputs/UeCheckboxDateGroup'
import UeCheckboxGroup from '../Inputs/UeCheckboxGroup'
import UeDate from '../Inputs/UeDate'
import UeDiagnoses from '../Inputs/UeDiagnosis/UeDiagnoses'
import UeDropdown from '../Inputs/UeDropdown'
import UeIcf from '../Inputs/UeIcf'
import UeMedicalInvestigationList from '../Inputs/UeMedicalInvestigation/UeMedicalInvestigationList'
import UeMessage from '../Inputs/UeMessage'
import UeRadio from '../Inputs/UeRadio'
import UeRadioGroup from '../Inputs/UeRadioGroup'
import UeRadioGroupOptionalDropdown from '../Inputs/UeRadioGroupOptionalDropdown'
import { UeSickLeavePeriod } from '../Inputs/UeSickLeavePeriod/UeSickLeavePeriod'
import UeTextArea from '../Inputs/UeTextArea'
import UeTextField from '../Inputs/UeTextField'
import UeTypeahead from '../Inputs/UeTypeahead'
import UeUncertainDate from '../Inputs/UeUncertainDate'

interface Props {
  question: CertificateDataElement
  disabled: boolean
}

const QuestionUeResolve: React.FC<Props> = ({ question, disabled }) => {
  const commonProps = { key: question.id, disabled, question }

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
    case ConfigTypes.UE_CAUSE_OF_DEATH:
      return <UeCauseOfDeath {...commonProps} />
    case ConfigTypes.UE_CAUSE_OF_DEATH_LIST:
      return <UeCauseOfDeathList {...commonProps} />
    case ConfigTypes.UE_MEDICAL_INVESTIGATION:
      return <UeMedicalInvestigationList {...commonProps} />
    case ConfigTypes.UE_HEADER:
      return null
    default:
      return <InfoBox type="error">Cannot find a component for: {question.config.type}</InfoBox>
  }
}

export default QuestionUeResolve
