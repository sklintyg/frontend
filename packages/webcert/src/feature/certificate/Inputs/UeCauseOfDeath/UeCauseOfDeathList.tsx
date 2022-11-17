import {
  CertificateDataElement,
  ConfigureUeCauseOfDeathList,
  CustomButton,
  QuestionValidationTexts,
  ValueCauseOfDeath,
  ValueCauseOfDeathList,
} from '@frontend/common'
import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { getQuestionHasValidationError, getShowValidationErrors } from '../../../../store/certificate/certificateSelectors'
import UeCauseOfDeathControl from './UeCauseOfDeathControl'

export interface Props {
  disabled: boolean
  question: CertificateDataElement
}

const UeCauseOfDeathList: React.FC<Props> = ({ question, disabled }) => {
  const questionConfig = question.config
  const questionValue = question.value as ValueCauseOfDeathList
  const causes = (questionConfig as ConfigureUeCauseOfDeathList).list
  const isShowValidationError = useSelector(getShowValidationErrors)
  const shouldDisplayValidationError = useSelector(getQuestionHasValidationError(question.id))
  const [noVisible, setNoVisible] = useState(2)

  const addRowClick = () => {
    if (noVisible < causes.length) {
      setNoVisible(noVisible + 1)
    }
  }

  questionValue.list.forEach((value, index) => {
    if (index > 1 && (value.description.text || value.debut.date || value.specification.code)) {
      setNoVisible(index)
    }
  })

  return (
    <div>
      <div>
        {causes &&
          causes.map((cause, index) => {
            let visible = false
            if (index < noVisible) {
              visible = true
            }
            const value: ValueCauseOfDeath = questionValue.list
              ? (questionValue.list.find((item) => item.id === cause.id) as ValueCauseOfDeath)
              : ({ id: cause.id } as ValueCauseOfDeath)

            if (visible) {
              return (
                <UeCauseOfDeathControl
                  config={cause}
                  value={value}
                  key={index}
                  questionKey={index}
                  disabled={disabled}
                  hasValidationError={shouldDisplayValidationError}
                  question={question}
                />
              )
            } else return <></>
          })}
      </div>
      <CustomButton
        disabled={disabled || noVisible >= causes.length}
        buttonStyle={'primary'}
        text="Lägg till ytterligare sjukdom"
        onClick={addRowClick}
      />
      {isShowValidationError && <QuestionValidationTexts validationErrors={question.validationErrors}></QuestionValidationTexts>}
    </div>
  )
}

export default UeCauseOfDeathList
