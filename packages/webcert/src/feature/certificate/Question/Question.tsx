import { CertificateDataConfig, ConfigTypes, Icon, MandatoryIcon, UvText } from '@frontend/common'
import _ from 'lodash'
import * as React from 'react'
import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import ReactTooltip from 'react-tooltip'
import { getIsEditable, getIsLocked, getQuestion } from '../../../store/certificate/certificateSelectors'
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
import UeVisualAcuity from '../Inputs/UeVisualAcuity/UeVisualAcuity'
import QuestionAccordion from './QuestionAccordion'
import QuestionHeaderAccordion from './QuestionHeaderAccordion'
import QuestionHeading from './QuestionHeading'
import QuestionEditComponent from './QuestionEditComponent'

export interface QuestionProps {
  id: string
  className?: string
}

const Question: React.FC<QuestionProps> = ({ id, className }) => {
  const question = useSelector(getQuestion(id), _.isEqual)
  const isEditable = useSelector(getIsEditable)
  const disabled = useSelector(getIsLocked) || (question?.disabled as boolean) || !isEditable
  const displayMandatory = (!question?.readOnly && question?.mandatory && !question.disabled) ?? false

  useEffect(() => {
    ReactTooltip.rebuild()
  }, [question])

  // TODO: We keep this until we have fixed the useRef for the UeTextArea debounce-functionality. It need to update its ref everytime its props changes.
  if (!question || (!question.visible && !question.readOnly)) return null

  const getQuestionComponent = (config: CertificateDataConfig, displayMandatory: boolean, readOnly: boolean) => {
    const hideLabel = question.config.type === ConfigTypes.UE_CAUSE_OF_DEATH

    if (disabled) {
      return (
        <QuestionHeading
          readOnly={question.readOnly}
          id={question.id}
          hideLabel={hideLabel}
          questionParent={question.parent}
          {...question.config}
        />
      )
    }

    if (!readOnly && config.description) {
      return (
        <div id={question.id}>
          <QuestionHeaderAccordion config={question.config} displayMandatory={displayMandatory} />
        </div>
      )
    }

    return (
      <>
        {question.config.icon && <Icon iconType={question.config.icon} includeTooltip />}
        {displayMandatory && <MandatoryIcon />}
        {
          <QuestionHeading
            readOnly={question.readOnly}
            id={question.id}
            hideLabel={hideLabel}
            questionParent={question.parent}
            {...question.config}
          />
        }
      </>
    )
  }

  function getUnifiedEditComponent(question: CertificateDataElement, disabled: boolean) {
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
      case ConfigTypes.UE_VISUAL_ACUITY:
        return <UeVisualAcuity {...commonProps} />
      case ConfigTypes.UE_HEADER:
        return
      default:
        return <InfoBox type="error">Cannot find a component for: {question.config.type}</InfoBox>
    }
  }

  function getEditComponent(question: CertificateDataElement, disabled: boolean) {
    if (question.config.accordion)
      return (
        <div id={question.id}>
          <QuestionAccordion accordion={question.config.accordion} icon={question.config.icon}>
            {getUnifiedEditComponent(question, disabled)}
          </QuestionAccordion>
        </div>
      )
    else return getUnifiedEditComponent(question, disabled)
  }

  function getUnifiedViewComponent(question: CertificateDataElement) {
    return <UvText question={question} />
  }

  return (
    <div className={className}>
      {getQuestionComponent(question.config, displayMandatory, question.readOnly)}
      <div>{question.readOnly ? <UvText question={question} /> : <QuestionEditComponent question={question} disabled={disabled} />}</div>
    </div>
  )
}

export default Question
