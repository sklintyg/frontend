import {
  Accordion,
  CertificateDataConfig,
  CertificateDataElement,
  ConfigTypes,
  Icon,
  InfoBox,
  MandatoryIcon,
  UvText,
} from '@frontend/common'
import _ from 'lodash'
import * as React from 'react'
import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import ReactTooltip from 'react-tooltip'
import { css } from 'styled-components'
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
import UeMessage from '../Inputs/UeMessage'
import UeRadio from '../Inputs/UeRadio'
import UeRadioGroup from '../Inputs/UeRadioGroup'
import UeRadioGroupOptionalDropdown from '../Inputs/UeRadioGroupOptionalDropdown'
import { UeSickLeavePeriod } from '../Inputs/UeSickLeavePeriod/UeSickLeavePeriod'
import UeTextArea from '../Inputs/UeTextArea'
import UeTextField from '../Inputs/UeTextField'
import UeTypeahead from '../Inputs/UeTypeahead'
import UeUncertainDate from '../Inputs/UeUncertainDate'
import QuestionHeading from './QuestionHeading'

export interface QuestionProps {
  id: string
  className?: string
}

const mandatoryIconAdditionalStyles = css`
  top: -5px;
`

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
      return <QuestionHeading readOnly={question.readOnly} id={question.id} hideLabel={hideLabel} {...question.config} />
    }

    if (!readOnly && config.description) {
      return (
        <Accordion
          icon={question.config.icon}
          includeIconTooltip
          header={question.config.header}
          titleId={question.id}
          title={question.config.text}
          description={question.config.description}
          displayMandatory={displayMandatory}
          additionalStyles="iu-fw-heading"
        />
      )
    }
    return (
      <>
        {question.config.icon && <Icon iconType={question.config.icon} includeTooltip />}
        <MandatoryIcon additionalStyles={mandatoryIconAdditionalStyles} display={displayMandatory} />
        {<QuestionHeading readOnly={question.readOnly} id={question.id} hideLabel={hideLabel} {...question.config} />}
      </>
    )
  }

  function getUnifiedEditComponent(question: CertificateDataElement, disabled: boolean) {
    const commonProps = { key: question.id, disabled, question }
    let component = <></>
    switch (question.config.type) {
      case ConfigTypes.UE_RADIO_BOOLEAN:
        component = <UeRadio {...commonProps} />
        break
      case ConfigTypes.UE_ICF:
        component = <UeIcf {...commonProps} />
        break
      case ConfigTypes.UE_TEXTAREA:
        component = <UeTextArea {...commonProps} />
        break
      case ConfigTypes.UE_CHECKBOX_BOOLEAN:
        component = <UeCheckbox {...commonProps} />
        break
      case ConfigTypes.UE_CHECKBOX_MULTIPLE_CODE:
        component = <UeCheckboxGroup {...commonProps} />
        break
      case ConfigTypes.UE_DROPDOWN:
        component = <UeDropdown {...commonProps} />
        break
      case ConfigTypes.UE_RADIO_MULTIPLE_CODE:
        component = <UeRadioGroup {...commonProps} />
        break
      case ConfigTypes.UE_CHECKBOX_MULTIPLE_DATE:
        component = <UeCheckboxDateGroup {...commonProps} />
        break
      case ConfigTypes.UE_SICK_LEAVE_PERIOD:
        component = <UeSickLeavePeriod {...commonProps} />
        break
      case ConfigTypes.UE_DIAGNOSES:
        component = <UeDiagnoses {...commonProps} />
        break
      case ConfigTypes.UE_RADIO_MULTIPLE_CODE_OPTIONAL_DROPDOWN:
        component = <UeRadioGroupOptionalDropdown {...commonProps} />
        break
      case ConfigTypes.UE_UNCERTAIN_DATE:
        component = <UeUncertainDate {...commonProps} />
        break
      case ConfigTypes.UE_MESSAGE:
        component = <UeMessage {...commonProps} />
        break
      case ConfigTypes.UE_TYPE_AHEAD:
        component = <UeTypeahead {...commonProps} />
        break
      case ConfigTypes.UE_TEXTFIELD:
        component = <UeTextField {...commonProps} />
        break
      case ConfigTypes.UE_DATE:
        component = <UeDate {...commonProps} />
        break
      case ConfigTypes.UE_CAUSE_OF_DEATH:
        component = <UeCauseOfDeath {...commonProps} />
        break
      case ConfigTypes.UE_CAUSE_OF_DEATH_LIST:
        component =  <UeCauseOfDeathList {...commonProps} />
        break
      case ConfigTypes.UE_HEADER:
        break
      default:
        component = <InfoBox type="error">Cannot find a component for: {question.config.type}</InfoBox>
    }
    if (!question.config.accordion) {
      return component
    } else {
      return (
        <Accordion
          icon={question.config.icon}
          includeIconTooltip
          titleId={question.id}
          title={question.config.accordion.openText}
          titleClose={question.config.accordion.closeText}
          header={question.config.accordion.header}
          isControl={true}>
          {component}
        </Accordion>
      )
    }
  }

  function getUnifiedViewComponent(question: CertificateDataElement) {
    return <UvText question={question} />
  }

  return (
    <div className={className}>
      {getQuestionComponent(question.config, displayMandatory, question.readOnly)}
      <div>{question.readOnly ? getUnifiedViewComponent(question) : getUnifiedEditComponent(question, disabled)}</div>
    </div>
  )
}

export default Question
