import { CertificateDataElement, ConfigUeInteger, QuestionValidationTexts, TextInput, ValueInteger } from '@frontend/common'
import { ValidationWrapper } from '@frontend/common/src/components/Inputs/DatePickerCustom/Styles'
import * as React from 'react'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import styled from 'styled-components'
import { updateCertificateDataElement } from '../../../../store/certificate/certificateActions'
import { getVisibleValidationErrors } from '../../../../store/certificate/certificateSelectors'

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
  const validationErrors = useSelector(getVisibleValidationErrors(question.id))

  useEffect(() => {
    if (questionValue.value) {
      setNumber(questionValue.value.toString())
    }
  }, [questionValue.value])

  const onKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === ' ') {
      event.preventDefault()
    }
  }

  const handleNumberOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    let inputValue = event.target.value
    if (/^[a-zA-Z]+$/.test(inputValue)) {
      return
    }
    if (inputValue.indexOf('-') > 0) {
      inputValue = inputValue.replace('-', '')
    }
    setNumber(inputValue.replace(/[^0-9-]/g, ''))
    dispatch(
      updateCertificateDataElement({
        ...question,
        value: { ...questionValue, value: inputValue },
      })
    )
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
