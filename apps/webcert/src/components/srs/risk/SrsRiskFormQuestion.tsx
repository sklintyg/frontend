import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { logSrsInteraction } from '../../../store/srs/srsActions'
import type { SrsQuestion } from '../../../types'
import { SrsEvent } from '../../../types'
import RadioButton from '../../Inputs/RadioButton'

interface Props {
  question: SrsQuestion
  onChange: (questionId: string, answerId: string) => void
  checkedOption: string
}

const SrsRiskFormQuestion = ({ question, onChange, checkedOption }: Props) => {
  const [currentValue, setCurrentValue] = useState(checkedOption ? checkedOption : '')
  const dispatch = useDispatch()

  const handleOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentValue(event.currentTarget.value)
    onChange(question.questionId, event.currentTarget.value)
    dispatch(logSrsInteraction(SrsEvent.SRS_QUESTION_ANSWERED))
  }

  return (
    <>
      <label className="iu-fw-bold">{question.text}</label>
      <div role="radiogroup" className="ic-radio-group-horizontal iu-mb-400" key={`question-${question.questionId}`}>
        {question.answerOptions.map((option) => {
          const key = `${question.questionId}-option-${option.id}`
          return (
            <RadioButton
              label={option.text}
              onChange={(event) => handleOnChange(event)}
              checked={currentValue === option.id}
              value={option.id}
              id={key}
              key={key}
            />
          )
        })}
      </div>
    </>
  )
}

export default SrsRiskFormQuestion
