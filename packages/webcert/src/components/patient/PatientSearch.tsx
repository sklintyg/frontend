import React, { ChangeEvent, useRef, useState } from 'react'
import { CustomButton, TextInput } from '@frontend/common'
import { isPatientIdValid } from './patientIdValidatorUtils'
import PatientIdValidator from './PatientIdValidator'
import styled, { css } from 'styled-components/macro'

interface Props {
  patientId: string
  onChange: (patientId: string) => void
  onSubmit: () => void
}

const TextInputStyles = css`
  width: 10.05em;
  margin-right: 0.5em;
`

const FormWrapper = styled.div`
  display: flex;
  align-items: center;
`

const PatientSearch: React.FC<Props> = ({ patientId, onChange, onSubmit }) => {
  const textInputRef = useRef(null)
  const [displayError, setDisplayError] = useState(false)

  const isTextInputOnFocus = () => {
    return document.activeElement === textInputRef.current
  }

  const formatPatientId = (event: ChangeEvent<HTMLInputElement>) => {
    const cleanPatientId = event.currentTarget.value.replace(/\D/g, '')
    if (cleanPatientId.length > 8) {
      onChange(cleanPatientId.slice(0, 8) + '-' + cleanPatientId.slice(8, cleanPatientId.length))
    } else {
      onChange(cleanPatientId)
    }
  }

  return (
    <div className={'iu-p-400'}>
      <h2>Patientens personnummer eller samordningsnummer</h2>
      <FormWrapper className={'iu-mt-300'}>
        <TextInput
          onChange={formatPatientId}
          ref={textInputRef}
          placeholder={'åååmmdd-nnnn'}
          value={patientId}
          limit={13}
          onBlur={() => {
            setDisplayError(patientId !== '' && !isPatientIdValid(patientId) && !isTextInputOnFocus())
          }}
          additionalStyles={TextInputStyles}
          hasValidationError={displayError}
        />
        <CustomButton text={'Fortsätt'} disabled={!isPatientIdValid(patientId)} buttonStyle={'primary'} onClick={onSubmit} />
      </FormWrapper>
      <PatientIdValidator display={displayError} />
    </div>
  )
}
export default PatientSearch
