import { isEqual } from 'lodash-es'
import { useEffect } from 'react'
import ReactTooltip from 'react-tooltip'
import Icon from '../../../components/image/image/Icon'
import MandatoryIcon from '../../../components/utils/MandatoryIcon'
import { displayAsMandatory, getIsEditable, getIsLocked, getQuestion } from '../../../store/certificate/certificateSelectors'
import { useAppSelector } from '../../../store/store'
import QuestionEditComponent from './QuestionEditComponent'
import QuestionHeaderAccordion from './QuestionHeaderAccordion'
import { QuestionHeading } from './QuestionHeading'
import { QuestionMessage } from './QuestionMessage'
import QuestionUvResolve from './QuestionUvResolve'

export interface QuestionProps {
  id: string
  className?: string
}

const Question = ({ id, className }: QuestionProps) => {
  const question = useAppSelector(getQuestion(id), isEqual)
  const isEditable = useAppSelector(getIsEditable)
  const disabled = useAppSelector(getIsLocked) || Boolean(question?.disabled) || !isEditable
  const hasDescription = useAppSelector((state) => getQuestion(id)(state)?.config.description !== null)
  const isReadOnly = useAppSelector((state) => getQuestion(id)(state)?.readOnly)
  const displayMandatory = useAppSelector(displayAsMandatory(id))

  useEffect(() => {
    ReactTooltip.rebuild()
  }, [question])

  if (!question || (!question.visible && !question.readOnly)) return null

  return (
    <div className={className}>
      {!isReadOnly && hasDescription ? (
        <div id={question.id}>
          <QuestionHeaderAccordion config={question.config} displayMandatory={displayMandatory} questionId={question.parent} />
        </div>
      ) : (
        <>
          {question.config.icon && !disabled && <Icon iconType={question.config.icon} includeTooltip />}
          {displayMandatory && !disabled && <MandatoryIcon />}
          {<QuestionHeading question={question} />}
        </>
      )}
      {question.config.message && !question.readOnly && <QuestionMessage message={question.config.message} />}
      <div>
        {isReadOnly ? <QuestionUvResolve question={question} /> : <QuestionEditComponent question={question} disabled={disabled} />}
      </div>
    </div>
  )
}

export default Question
