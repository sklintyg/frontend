import { CertificateDataConfig, ConfigTypes, Icon, MandatoryIcon, UvText } from '@frontend/common'
import _ from 'lodash'
import * as React from 'react'
import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import ReactTooltip from 'react-tooltip'
import { getIsEditable, getIsLocked, getQuestion } from '../../../store/certificate/certificateSelectors'
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
      return <QuestionHeading readOnly={question.readOnly} id={question.id} hideLabel={hideLabel} {...question.config} />
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
        {<QuestionHeading readOnly={question.readOnly} id={question.id} hideLabel={hideLabel} {...question.config} />}
      </>
    )
  }

  return (
    <div className={className}>
      {getQuestionComponent(question.config, displayMandatory, question.readOnly)}
      <div>{question.readOnly ? <UvText question={question} /> : <QuestionEditComponent question={question} disabled={disabled} />}</div>
    </div>
  )
}

export default Question
