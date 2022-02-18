import * as React from 'react'
import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import UeRadio from '../Inputs/UeRadio'
import {
  Accordion,
  CertificateDataConfig,
  CertificateDataElement,
  CertificateDataElementStyleEnum,
  ConfigTypes,
  Expandable,
  Icon,
  MandatoryIcon,
  UvText,
} from '@frontend/common'
import {
  getComplements,
  getComplementsIncludingSubQuestions,
  getIsEditable,
  getIsLocked,
  getQuestion,
  getShowValidationErrors,
} from '../../../store/certificate/certificateSelectors'
import QuestionWrapper from './QuestionWrapper'
import UeTextArea from '../Inputs/UeTextArea'
import UeCheckboxGroup from '../Inputs/UeCheckboxGroup'
import UeCheckbox from '../Inputs/UeCheckbox'
import UeDropdown from '../Inputs/UeDropdown'
import UeRadioGroup from '../Inputs/UeRadioGroup'
import UeCheckboxDateGroup from '../Inputs/UeCheckboxDateGroup'
import { UeSickLeavePeriod } from '../Inputs/UeSickLeavePeriod/UeSickLeavePeriod'
import styled, { css } from 'styled-components'
import UeIcf from '../Inputs/UeIcf'
import _ from 'lodash'
import ReactTooltip from 'react-tooltip'
import UeRadioGroupOptionalDropdown from '../Inputs/UeRadioGroupOptionalDropdown'
import { FlattenSimpleInterpolation } from 'styled-components/macro'
import UeDiagnoses from '../Inputs/UeDiagnosis/UeDiagnoses'

interface QuestionProps {
  id: string
  additionalWrapperStyles?: FlattenSimpleInterpolation
  disableHighlight?: boolean
}

interface HighlightedProps {
  highlight: boolean
}

const mandatoryIconAdditionalStyles = css`
  top: -5px;
`

const Complement = styled.div`
  display: flex;
  align-items: top;
  justify-content: space-between;
  padding: 5px;
`

const Wrapper = styled.div`
  display: flex;
  justify-content: space-between;
`

const Highlighted = styled.div<HighlightedProps>`
  border-radius: ${(props) => (props.highlight ? '0.1875px' : '')};
  outline: ${(props) => (props.highlight ? '1.5px solid #01a5a3' : '')};
  margin-top: ${(props) => (props.highlight ? '1.5px' : '')};
  margin-left: ${(props) => (props.highlight ? '1.5px' : '')};
`

const Question: React.FC<QuestionProps> = ({ id, additionalWrapperStyles, disableHighlight }) => {
  const question = useSelector(getQuestion(id), _.isEqual)
  const complements = useSelector(getComplements(id), _.isEqual)
  const complementsIncludingSubquestions = useSelector(getComplementsIncludingSubQuestions(id), _.isEqual)
  const isEditable = useSelector(getIsEditable)
  const disabled = useSelector(getIsLocked) || (question?.disabled as boolean) || !isEditable
  const displayMandatory = (!question?.readOnly && question?.mandatory && !question.disabled) ?? false
  const isShowValidationError = useSelector(getShowValidationErrors, _.isEqual)

  useEffect(() => {
    ReactTooltip.rebuild()
  }, [question])

  // TODO: We keep this until we have fixed the useRef for the UeTextArea debounce-functionality. It need to update its ref everytime its props changes.
  if (!question || (!question.visible && !question.readOnly)) return null

  const getHeading = () => {
    if (question.config.header) {
      return (
        <>
          <h4 id={question.id} className={`iu-fw-heading iu-fs-300 iu-mb-300`}>
            {question.config.header}
          </h4>
          <h5 className={`iu-fw-heading iu-fs-200 iu-mb-300`}>{question.config.text}</h5>
          {question.readOnly && <h5 className={`iu-fw-heading iu-fs-200 iu-mb-300`}>{question.config.label as string}</h5>}
        </>
      )
    } else {
      return (
        <>
          <h4 id={question.id} className={`iu-fw-heading iu-fs-300 iu-mb-300`}>
            {question.config.text}
          </h4>
          {question.readOnly && (
            <h4 id={question.id} className={`iu-fw-heading iu-fs-300 iu-mb-300`}>
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
          additionalStyles="iu-fw-heading iu-mb-300"
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
    if (question.config.type === ConfigTypes.UE_RADIO_BOOLEAN) return <UeRadio disabled={disabled} key={question.id} question={question} />
    if (question.config.type === ConfigTypes.UE_ICF) return <UeIcf question={question} key={question.id} disabled={disabled} />
    if (question.config.type === ConfigTypes.UE_TEXTAREA) return <UeTextArea disabled={disabled} key={question.id} question={question} />
    if (question.config.type === ConfigTypes.UE_CHECKBOX_BOOLEAN)
      return <UeCheckbox disabled={disabled} key={question.id} question={question} />
    if (question.config.type === ConfigTypes.UE_CHECKBOX_MULTIPLE_CODE)
      return <UeCheckboxGroup question={question} disabled={disabled} key={question.id} />
    if (question.config.type === ConfigTypes.UE_DROPDOWN) return <UeDropdown disabled={disabled} key={question.id} question={question} />
    if (question.config.type === ConfigTypes.UE_RADIO_MULTIPLE_CODE)
      return <UeRadioGroup disabled={disabled} key={question.id} question={question} />
    if (question.config.type === ConfigTypes.UE_CHECKBOX_MULTIPLE_DATE)
      return <UeCheckboxDateGroup disabled={disabled} key={question.id} question={question} />
    if (question.config.type === ConfigTypes.UE_SICK_LEAVE_PERIOD)
      return <UeSickLeavePeriod disabled={disabled} question={question} key={question.id} />
    if (question.config.type === ConfigTypes.UE_DIAGNOSES) return <UeDiagnoses disabled={disabled} key={question.id} question={question} />
    if (question.config.type === ConfigTypes.UE_RADIO_MULTIPLE_CODE_OPTIONAL_DROPDOWN)
      return <UeRadioGroupOptionalDropdown disabled={disabled} key={question.id} question={question} />
    return <div>Cannot find a component for: {question.config.type}</div>
  }

  function getUnifiedViewComponent(question: CertificateDataElement) {
    return <UvText question={question} />
  }

  return (
    <Highlighted highlight={complementsIncludingSubquestions.length > 0 && !disableHighlight}>
      <Expandable isExpanded={question.visible} additionalStyles={'questionWrapper'}>
        <QuestionWrapper
          additionalStyles={additionalWrapperStyles}
          highlighted={question.style === CertificateDataElementStyleEnum.HIGHLIGHTED}>
          {getQuestionComponent(question.config, displayMandatory, question.readOnly)}
          {question.readOnly ? getUnifiedViewComponent(question) : getUnifiedEditComponent(question, disabled)}
          {complements.map((complement, index) => (
            <div key={index} className={`ic-alert ic-alert--status ic-alert--info iu-p-none iu-my-400`}>
              <Complement key={complement.valueId} className={'iu-fullwidth '}>
                <i className={`ic-alert__icon ic-info-icon iu-m-none`} />
                <div className={'iu-fullwidth iu-pl-300 iu-fs-200'}>
                  <Wrapper>
                    <p className={'iu-fw-heading'}>{'Kompletteringsbegäran:'}</p>
                  </Wrapper>
                  <Wrapper>
                    <div className={'iu-fullwidth'}>{complement.message}</div>
                  </Wrapper>
                </div>
              </Complement>
            </div>
          ))}
        </QuestionWrapper>
      </Expandable>
    </Highlighted>
  )
}

export default Question
