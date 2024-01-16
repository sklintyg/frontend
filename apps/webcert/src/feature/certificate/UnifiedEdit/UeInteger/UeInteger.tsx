import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import styled from 'styled-components'
import { ValidationWrapper } from '../../../../components/Inputs/DatePickerCustom/DatePickerCustom'
import TextInput from '../../../../components/Inputs/TextInput'
import QuestionValidationTexts from '../../../../components/Validation/QuestionValidationTexts'
import { updateCertificateDataElement } from '../../../../store/certificate/certificateActions'
import { getVisibleValidationErrors } from '../../../../store/certificate/certificateSelectors'
import { CertificateDataElement, ConfigUeInteger, ValueInteger } from '../../../../types'

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
  const [number, setNumber] = useState(questionValue.value?.toString() ?? undefined)
  const validationErrors = useSelector(getVisibleValidationErrors(question.id))

  const onKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === ' ') {
      event.preventDefault()
    }
  }

  const onKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key.length === 1 && !/^-?\d*$/.test(event.key)) {
      event.preventDefault()
    }
  }

  const toIntegerValue = (val: string): number | null => (isNaN(parseInt(val)) ? null : parseInt(val))

  const handleNumberOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = event.target.value

    if (!/^-?\d*$/.test(inputValue)) {
      return
    }

    const newValue = toIntegerValue(event.target.value)

    if (inputValue.length >= 2 && inputValue.startsWith('0')) {
      setNumber(newValue?.toString())
    } else if (inputValue.length >= 3 && inputValue.startsWith('-0')) {
      let number = inputValue
      number = '-' + inputValue.slice(2)
      setNumber(number?.toString())
    } else {
      setNumber(inputValue)
    }

    dispatch(
      updateCertificateDataElement({
        ...question,
        value: { ...questionValue, value: newValue },
      })
    )
  }

  const limit =
    typeof questionConfig.max === 'number' && typeof questionConfig.min === 'number'
      ? Math.max(questionConfig.min.toString().length, questionConfig.max.toString().length)
      : 17

  return (
    <>
      <Wrapper>
        <StyledTextInput
          disabled={disabled}
          value={number}
          id={questionConfig.id}
          onChange={handleNumberOnChange}
          hasValidationError={validationErrors.length > 0}
          data-testid="testNumber"
          onKeyDown={onKeyDown}
          onKeyPress={onKeyPress}
          limit={limit}
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
