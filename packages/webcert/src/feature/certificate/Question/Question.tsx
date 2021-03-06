import * as React from 'react'
import { useSelector } from 'react-redux'
import UeRadio from '../Inputs/UeRadio'
import { UvText, CertificateDataConfig, CertificateDataElement, ConfigTypes, Expandable, Accordion, MandatoryIcon } from '@frontend/common'
import { getIsLocked, getQuestion, getShowValidationErrors } from '../../../store/certificate/certificateSelectors'
import QuestionWrapper from './QuestionWrapper'
import UeTextArea from '../Inputs/UeTextArea'
import UeCheckboxGroup from '../Inputs/UeCheckboxGroup'
import UeCheckbox from '../Inputs/UeCheckbox'
import UeDropdown from '../Inputs/UeDropdown'
import UeRadioGroup from '../Inputs/UeRadioGroup'
import UeCheckboxDateGroup from '../Inputs/UeCheckboxDateGroup'
import { UeSickLeavePeriod } from '../Inputs/UeSickLeavePeriod/UeSickLeavePeriod'
import UeDiagnoses from '../Inputs/UeDiagnoses'

interface QuestionProps {
  id: string
}

const Question: React.FC<QuestionProps> = ({ id }) => {
  const question = useSelector(getQuestion(id))
  const disabled = useSelector(getIsLocked) || (question.disabled as boolean)
  const displayMandatory = !question.readOnly && question.mandatory && !question.disabled
  const isShowValidationError = useSelector(getShowValidationErrors)

  const getHeading = () => {
    if (question.config.header) {
      return (
        <>
          <h4 className={`iu-fw-heading iu-fs-300 iu-mb-300`}>{question.config.header}</h4>
          <h5 className={`iu-fw-heading iu-fs-200 iu-mb-300`}>
            {!question.config.text && question.readOnly ? (question.config.label as string) : question.config.text}
          </h5>
        </>
      )
    } else {
      return (
        <h4 className={`iu-fw-heading iu-fs-300 iu-mb-300`}>
          {!question.config.text && question.readOnly ? (question.config.label as string) : question.config.text}
        </h4>
      )
    }
  }

  // TODO: We keep this until we have fixed the useRef for the UeTextArea debounce-functionality. It need to update its ref everytime its props changes.
  if (!question || (!question.visible && !question.readOnly)) return null

  return (
    <Expandable isExpanded={question.visible} additionalStyles={'questionWrapper'}>
      <QuestionWrapper>
        {getQuestionComponent(question.config, displayMandatory, question.readOnly)}
        {question.readOnly ? getUnifiedViewComponent(question) : getUnifiedEditComponent(question, disabled)}
      </QuestionWrapper>
    </Expandable>
  )

  function getQuestionComponent(config: CertificateDataConfig, displayMandatory: boolean, readOnly: boolean) {
    if (disabled) {
      return <p className={`iu-fw-heading iu-fs-300`}>{question.config.text}</p>
    }

    if (!readOnly && config.description) {
      return (
        <Accordion
          header={question.config.header}
          title={question.config.text}
          description={question.config.description}
          displayMandatory={displayMandatory}
          additionalStyles="iu-fw-heading iu-mb-300"></Accordion>
      )
    }
    return (
      <>
        <MandatoryIcon display={displayMandatory}></MandatoryIcon>
        {getHeading()}
      </>
    )
  }

  function getUnifiedEditComponent(question: CertificateDataElement, disabled: boolean) {
    if (question.config.type === ConfigTypes.UE_RADIO_BOOLEAN) return <UeRadio disabled={disabled} key={question.id} question={question} />
    if (question.config.type === ConfigTypes.UE_TEXTAREA) return <UeTextArea disabled={disabled} key={question.id} question={question} />
    if (question.config.type === ConfigTypes.UE_CHECKBOX_BOOLEAN)
      return <UeCheckbox disabled={disabled} key={question.id} question={question} />
    if (question.config.type === ConfigTypes.UE_CHECKBOX_MULTIPLE_CODE)
      return <UeCheckboxGroup question={question} disabled={disabled} key={question.id} />
    if (question.config.type === ConfigTypes.UE_DROPDOWN) return <UeDropdown disabled={disabled} key={question.id} question={question} />
    if (question.config.type === ConfigTypes.UE_RADIO_MULTIPLE_CODE)
      return <UeRadioGroup disabled={disabled} key={question.id} question={question} />
    if (question.config.type === ConfigTypes.UE_CHECKBOX_MULTIPLE_DATE)
      return <UeCheckboxDateGroup disabled={disabled} key={question.id} question={question} isShowValidationError={isShowValidationError} />
    if (question.config.type === ConfigTypes.UE_SICK_LEAVE_PERIOD)
      return <UeSickLeavePeriod disabled={disabled} question={question} key={question.id} />
    if (question.config.type === ConfigTypes.UE_DIAGNOSES) return <UeDiagnoses disabled={disabled} key={question.id} question={question} />
    return <div>Cannot find a component for: {question.config.type}</div>
  }

  function getUnifiedViewComponent(question: CertificateDataElement) {
    return <UvText question={question} />
  }
}

export default Question
