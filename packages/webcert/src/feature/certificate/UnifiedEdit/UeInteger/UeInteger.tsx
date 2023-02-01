import { CertificateDataElement, ConfigUeInteger, QuestionValidationTexts, TextInput, ValueInteger } from '@frontend/common'
import { ValidationWrapper } from '@frontend/common/src/components/Inputs/DatePickerCustom/Styles'
import * as React from 'react'
import { useState } from 'react'
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
  const [number, setNumber] = useState<string | null>(questionValue.value?.toString() ?? '')
  const validationErrors = useSelector(getVisibleValidationErrors(question.id))

  const onKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === ' ') {
      event.preventDefault()
    }
  }

  const handleNumberOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!/^-?\d*$/.test(event.target.value)) {
      return
    }
    const inputValue = event.target.value === '' ? null : parseInt(event.target.value)
    setNumber(inputValue == null ? null : isNaN(inputValue) ? event.target.value : inputValue.toString())
    dispatch(
      updateCertificateDataElement({
        ...question,
        value: { ...questionValue, value: inputValue == null || isNaN(inputValue) ? null : inputValue },
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
