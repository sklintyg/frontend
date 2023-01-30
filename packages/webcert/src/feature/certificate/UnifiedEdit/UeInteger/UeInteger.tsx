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
import styled from 'styled-components'
import { updateCertificateDataElement, updateClientValidationError } from '../../../../store/certificate/certificateActions'
import { getVisibleValidationErrors } from '../../../../store/certificate/certificateSelectors'

const INVALID_NUMBER_PERIOD_ERROR = 'Ange ett värde mellan 0 och 100 %'

const Wrapper = styled.div`
  display: flex;
  align-items: center;
`
const StyledTextInput = styled(TextInput)`
  width: 45px;
  padding: 4px 4px;
  height: 35px;
  text-align: center;
  margin-right: 0.625em;
`
export interface Props {
  question: CertificateDataElement
  disabled: boolean
}

const UeInteger: React.FC<Props> = ({ question, disabled }) => {
  const dispatch = useDispatch()
  const questionValue = question.value as ValueInteger
  const questionConfig = question.config as ConfigUeInteger
  const [number, setNumber] = useState<string>('')
  const validationErrors = useSelector(getVisibleValidationErrors(question.id, 'NUMBER'))

  const onKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === ' ') {
      event.preventDefault()
    }
  }

  const handleNumberOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = event.target.value
    const numberValue = Number(inputValue)

    if (isNaN(numberValue)) return null

    setNumber(event.target.value.replace(/[^0-9-]/g, ''))

    isNumberValid(numberValue)
    dispatch(
      updateCertificateDataElement({
        ...question,
        value: { ...questionValue, value: inputValue },
      })
    )
  }

  const isNumberValid = (number: number) => {
    const error: ValidationError = {
      category: '',
      id: question.id,
      text: INVALID_NUMBER_PERIOD_ERROR,
      type: 'NUMBER_ERRORS',
      field: 'NUMBER',
      showAlways: true,
    }
    const shouldBeRemoved = number <= 100 && number >= 0
    dispatch(updateClientValidationError({ shouldBeRemoved, validationError: error }))
    return shouldBeRemoved
  }

  return (
    <>
      <Wrapper>
        <StyledTextInput
          disabled={disabled}
          value={number === null ? '' : number}
          id={questionConfig.id}
          onChange={handleNumberOnChange}
          hasValidationError={validationErrors.length > 0}
          limit={3}
          testId="testNumber"
          onKeyDown={onKeyDown}
        />
        <p className="iu-fs-200 iu-fw-body">{questionConfig.unitOfMeasurement}</p>
      </Wrapper>
      <ValidationWrapper>
        <QuestionValidationTexts validationErrors={validationErrors} />
      </ValidationWrapper>
    </>
  )
}

export default UeInteger
