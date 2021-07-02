import React from 'react'
import { CertificateDataElement, QuestionValidationTexts } from '@frontend/common'
import { useSelector } from 'react-redux'
import { getQuestionHasValidationError } from '../../../store/certificate/certificateSelectors'
import { ConfigUeCheckboxMultipleDate } from '@frontend/common'
import UeCheckboxDate from './UeCheckboxDate'
import { ValueDate, ValueDateList } from '@frontend/common/src'

interface Props {
  disabled: boolean
  question: CertificateDataElement
  isShowValidationError: boolean
}

const UeCheckboxDateGroup: React.FC<Props> = ({ question, disabled, isShowValidationError }) => {
  const checkboxes = (question.config as ConfigUeCheckboxMultipleDate).list
  const values = (question.value as ValueDateList).list
  const shouldDisplayValidationError = useSelector(getQuestionHasValidationError(question.id))

  const getDate = (id: string) => {
    const index = values.findIndex((date: ValueDate) => date.id === id)
    if (index !== -1) {
      return values[index].date
    } else {
      return null
    }
  }

  const renderCheckboxes = () => {
    if (!checkboxes) {
      return null
    }
    return checkboxes.map((checkbox, index) => (
      <UeCheckboxDate
        id={checkbox.id}
        key={index}
        label={checkbox.label}
        date={getDate(checkbox.id)}
        disabled={disabled}
        hasValidationError={shouldDisplayValidationError}
        isShowValidationError={isShowValidationError}
        question={question}
      />
    ))
  }

  return (
    <div className="checkbox-group-wrapper">
      <div>
        <div className="checkbox-child">{renderCheckboxes()}</div>
        {isShowValidationError && <QuestionValidationTexts validationErrors={question.validationErrors}></QuestionValidationTexts>}
      </div>
    </div>
  )
}

export default UeCheckboxDateGroup
