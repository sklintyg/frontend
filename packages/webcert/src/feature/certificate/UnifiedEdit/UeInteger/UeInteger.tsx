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
  const [number, setNumber] = useState(questionValue.value?.toString() ?? '')
  const validationErrors = useSelector(getVisibleValidationErrors(question.id))

  const onKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === ' ') {
      event.preventDefault()
    }
  }

  const toIntegerValue = (val: string): number | null => (isNaN(parseInt(val)) ? null : parseInt(val))

  const handleNumberOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!/^-?\d*$/.test(event.target.value)) {
      return
    }
    setNumber(event.target.value)
    dispatch(
      updateCertificateDataElement({
        ...question,
        value: { ...questionValue, value: toIntegerValue(event.target.value) },
      })
    )
  }

  return (
    <>
      <Wrapper>
        <StyledTextInput
          disabled={disabled}
          value={number}
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
