import {
  CertificateDataElement,
  ConfigUeInteger,
  QuestionValidationTexts,
  TextInput,
  ValidationError,
  ValueInteger,
} from '@frontend/common'
import { ValidationWrapper } from '@frontend/common/src/components/Inputs/DatePickerCustom/Styles'
import * as React from 'react'
import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { updateCertificateDataElement, updateClientValidationError } from '../../../../store/certificate/certificateActions'
import { getVisibleValidationErrors } from '../../../../store/certificate/certificateSelectors'

const INVALID_PERCENT_PERIOD_ERROR = 'Ange ett värde mellan 0 och 100 %'

export interface Props {
  question: CertificateDataElement
  disabled: boolean
}

const UeInteger: React.FC<Props> = ({ question, disabled }) => {
  const dispatch = useDispatch()
  const questionValue = question.value as ValueInteger
  const questionConfig = question.config as ConfigUeInteger
  const [percent, setPercent] = useState<string>('')
  const validationErrors = useSelector(getVisibleValidationErrors(question.id, 'REDUCED_PERCENT'))

  const handlePercentOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = event.target.value
    const numberValue = Number(inputValue)
    isPercentValid(numberValue)

    setPercent(event.target.value.replace(/[^0-9]/g, ''))

    dispatch(
      updateCertificateDataElement({
        ...question,
        value: { ...questionValue, value: numberValue },
      })
    )
  }

  const isPercentValid = (percent: number) => {
    const error: ValidationError = {
      category: question.parent,
      id: question.id,
      text: INVALID_PERCENT_PERIOD_ERROR,
      type: 'REDUCED_PERCENT_ERRORS',
      field: 'REDUCED_PERCENT',
      showAlways: true,
    }
    const shouldBeRemoved = percent < 100 && percent > 0
    dispatch(updateClientValidationError({ shouldBeRemoved, validationError: error }))
  }

  return (
    <>
      <div className="iu-grid-cols-12">
        <div className="iu-fs-200 iu-grid-span-2">
          <TextInput
            disabled={disabled}
            value={percent}
            id={questionConfig.id}
            onChange={handlePercentOnChange}
            hasValidationError={validationErrors.length > 0}
            limit={3}
            testId="reducedPercent"
          />
        </div>
        <p className="iu-mt-300 iu-fs-400">{questionConfig.unit}</p>
      </div>
      <ValidationWrapper>
        <QuestionValidationTexts validationErrors={validationErrors} />
      </ValidationWrapper>
    </>
  )
}

export default UeInteger
