import { CertificateDataElement, ConfigUeCheckboxMultipleDate, QuestionValidationTexts, ValueDate, ValueDateList } from '@frontend/common'
import React from 'react'
import { useSelector } from 'react-redux'
import { getVisibleValidationErrors } from '../../../../store/certificate/certificateSelectors'
import UeCheckboxDate from '../UeCheckboxDate/UeCheckboxDate'

export interface Props {
  disabled: boolean
  question: CertificateDataElement
}

const UeCheckboxDateGroup: React.FC<Props> = ({ question, disabled }) => {
  const checkboxes = (question.config as ConfigUeCheckboxMultipleDate).list
  const values = (question.value as ValueDateList).list
  const validationErrors = useSelector(getVisibleValidationErrors(question.id, question.id))

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
        hasValidationError={validationErrors.length > 0}
        question={question}
      />
    ))
  }

  return (
    <div className="checkbox-group-wrapper iu-pt-500">
      <div>
        <div className="checkbox-child">{renderCheckboxes()}</div>
        <QuestionValidationTexts validationErrors={validationErrors} />
      </div>
    </div>
  )
}

export default UeCheckboxDateGroup
