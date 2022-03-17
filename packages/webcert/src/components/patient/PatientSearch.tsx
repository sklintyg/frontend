import React, { ChangeEvent, useEffect, useState } from 'react'
import { CustomButton, TextInput } from '@frontend/common'
import { isPatientIdValid } from './patientIdValidatorUtils'
import InvalidPatientIdMessage from './InvalidPatientIdMessage'
import styled, { css } from 'styled-components/macro'
import { useDispatch } from 'react-redux'
import { getPatient } from '../../store/patient/patientActions'
import { useHistory } from 'react-router-dom'
import PatientSearchError from './PatientSearchError'
import { useKeyPress } from '@frontend/common/src/utils/userFunctionUtils'

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
  const enterPress = useKeyPress('Enter')

  useEffect(() => {
    onSubmit()
  }, [enterPress])

  const onChange = (event: ChangeEvent<HTMLInputElement>) => {
    setPatientId(formatPatientId(event.currentTarget.value))
  }

  const onSubmit = () => {
    dispatch(getPatient({ patientId: patientId.replace('-', ''), history: history }))
  }

  const formatPatientId = (patientId: string) => {
    let cleanPatientId = patientId.replace(/\D/g, '')
    if (cleanPatientId.length > 8) {
      cleanPatientId = cleanPatientId.slice(0, 8) + '-' + cleanPatientId.slice(8, cleanPatientId.length)
    }
    return cleanPatientId
  }

  return (
    <div className="ic-container iu-p-400">
      <h2>Patientens personnummer eller samordningsnummer</h2>
      <FormWrapper className="iu-mt-300">
        <TextInput
          onChange={onChange}
          placeholder="ååååmmdd-nnnn"
          value={patientId}
          limit={13}
          onBlur={() => {
            setDisplayError(patientId !== '' && !isPatientIdValid(patientId))
          }}
          onFocus={() => setDisplayError(false)}
          additionalStyles={TextInputStyles}
          hasValidationError={displayError}
        />
        <CustomButton text="Fortsätt" disabled={!isPatientIdValid(patientId)} buttonStyle="primary" onClick={onSubmit} />
      </FormWrapper>
      <InvalidPatientIdMessage display={displayError} />
      <PatientSearchError />
    </div>
  )
}
export default PatientSearch
