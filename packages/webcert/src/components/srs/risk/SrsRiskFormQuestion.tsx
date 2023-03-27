import React, { useState } from 'react'
import { RadioButton, SrsQuestion } from '@frontend/common'

interface Props {
  question: SrsQuestion
  onChange: (questionId: string, answerId: string) => void
  checkedOption: string
}

const SrsRiskFormQuestion: React.FC<Props> = ({ question, onChange, checkedOption }) => {
  const [currentValue, setCurrentValue] = useState(checkedOption ? checkedOption : '')

  const handleOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentValue(event.currentTarget.value)
    onChange(question.questionId, event.currentTarget.value)
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
