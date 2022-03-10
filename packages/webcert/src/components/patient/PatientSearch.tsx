import React, { ChangeEvent, useState } from 'react'
import { CustomButton, TextInput } from '@frontend/common'
import { isPatientIdValid } from './patientIdValidatorUtils'
import PatientIdValidator from './PatientIdValidator'
import styled, { css } from 'styled-components/macro'
import { useDispatch } from 'react-redux'
import { getPatient } from '../../store/patient/patientActions'
import { useHistory } from 'react-router-dom'

const TextInputStyles = css`
  width: 10.05em;
  margin-right: 0.5em;
`

const FormWrapper = styled.div`
  display: flex;
  align-items: center;
`

const PatientSearch: React.FC = () => {
  const [displayError, setDisplayError] = useState(false)
  const [patientId, setPatientId] = useState('')
  const dispatch = useDispatch()
  const history = useHistory()

  const onChange = (patientId: string) => {
    setPatientId(patientId)
  }

  const onSubmit = () => {
    dispatch(getPatient({ patientId: patientId.replace('-', ''), history: history }))
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
    <div className={'ic-container iu-p-400'}>
      <h2>Patientens personnummer eller samordningsnummer</h2>
      <FormWrapper className={'iu-mt-300'}>
        <TextInput
          ref={null}
          onChange={formatPatientId}
          placeholder={'åååmmdd-nnnn'}
          value={patientId}
          limit={13}
          onBlur={() => {
            setDisplayError(patientId !== '' && !isPatientIdValid(patientId))
          }}
          onFocus={() => setDisplayError(false)}
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
