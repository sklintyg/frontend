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

const INVALID_NUMBER_PERIOD_ERROR = 'Ange ett värde mellan 0 och 100 %'

export interface Props {
  question: CertificateDataElement
  disabled: boolean
}

const UeInteger: React.FC<Props> = ({ question, disabled }) => {
  const dispatch = useDispatch()
  const questionValue = question.value as ValueInteger
  const questionConfig = question.config as ConfigUeInteger
  const [number, setNumber] = useState<string | null>(questionValue.value?.toString() ?? '')

  const validationErrors = useSelector(getVisibleValidationErrors(question.id, 'NUMBER'))

  const handleNumberOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = event.target.value
    const numberValue = Number(inputValue)
    isNumberValid(numberValue)

    setNumber(event.target.value.replace(/[^0-9-]/g, ''))

    dispatch(
      updateCertificateDataElement({
        ...question,
        value: { ...questionValue, value: numberValue },
      })
    )
  }

  const onKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === ' ') {
      event.preventDefault()
    }
  }

  const isNumberValid = (number: number) => {
    const error: ValidationError = {
      category: question.parent,
      id: question.id,
      text: INVALID_NUMBER_PERIOD_ERROR,
      type: 'NUMBER_ERRORS',
      field: 'NUMBER',
      showAlways: true,
    }
    const shouldBeRemoved = number <= 100 && number >= 0
    dispatch(updateClientValidationError({ shouldBeRemoved, validationError: error }))
  }

  return (
    <>
      <div className="iu-grid-cols-12">
        <div className="iu-fs-200 iu-grid-span-2">
          <TextInput
            disabled={disabled}
            value={number === null ? '' : number}
            id={questionConfig.id}
            onChange={handleNumberOnChange}
            hasValidationError={validationErrors.length > 0}
            limit={3}
            testId="testNumber"
            onKeyDown={onKeyDown}
          />
        </div>
        <p className="iu-mt-300 iu-fs-400">{questionConfig.unitOfMeasurement}</p>
      </div>
      <ValidationWrapper>
        <QuestionValidationTexts validationErrors={validationErrors} />
      </ValidationWrapper>
    </>
  )
}

export default UeInteger
