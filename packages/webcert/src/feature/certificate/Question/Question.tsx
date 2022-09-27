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
import UeCheckbox from '../Inputs/UeCheckbox'
import UeCheckboxDateGroup from '../Inputs/UeCheckboxDateGroup'
import UeCheckboxGroup from '../Inputs/UeCheckboxGroup'
import UeDiagnoses from '../Inputs/UeDiagnosis/UeDiagnoses'
import UeDropdown from '../Inputs/UeDropdown'
import UeIcf from '../Inputs/UeIcf'
import UeRadio from '../Inputs/UeRadio'
import UeRadioGroup from '../Inputs/UeRadioGroup'
import UeRadioGroupOptionalDropdown from '../Inputs/UeRadioGroupOptionalDropdown'
import { UeSickLeavePeriod } from '../Inputs/UeSickLeavePeriod/UeSickLeavePeriod'
import UeTextArea from '../Inputs/UeTextArea'
import UeMessage from '../Inputs/UeMessage'
import UeTextField from '../Inputs/UeTextField'

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

  const getHeading = () => {
    if (question.config.header) {
      return (
        <>
          <h4 id={question.id} className={`iu-fw-heading iu-fs-300 iu-mb-200`}>
            {question.config.header}
          </h4>
          <h5 className={`iu-fw-heading iu-fs-200`}>{question.config.text}</h5>
          {question.readOnly && <h5 className={`iu-fw-heading iu-fs-200`}>{question.config.label as string}</h5>}
        </>
      )
    } else {
      return (
        <>
          <h4 id={question.id} className={`iu-fw-heading iu-fs-300`}>
            {question.config.text}
          </h4>
          {question.readOnly && (
            <h4 id={question.id} className={`iu-fw-heading iu-fs-300`}>
              {question.config.label as string}
            </h4>
          )}
        </>
      )
    }
  }

  const getQuestionComponent = (config: CertificateDataConfig, displayMandatory: boolean, readOnly: boolean) => {
    if (disabled) {
      return getHeading()
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
        {getHeading()}
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
      case ConfigTypes.UE_MESSAGE:
        return <UeMessage {...commonProps} />
      case ConfigTypes.UE_TEXTFIELD:
        return <UeTextField {...commonProps} />
      default:
        return <InfoBox type="error">Cannot find a component for: {question.config.type}</InfoBox>
    }
  }

  function getUnifiedViewComponent(question: CertificateDataElement) {
    return <UvText question={question} />
  }

  return (
    <div className={className}>
      {getQuestionComponent(question.config, displayMandatory, question.readOnly)}
      <div className="iu-mt-300">{question.readOnly ? getUnifiedViewComponent(question) : getUnifiedEditComponent(question, disabled)}</div>
    </div>
  )
}

export default Question
