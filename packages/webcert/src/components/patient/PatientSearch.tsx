import { CustomButton, isPersonIdValid, PersonIdInput, useKeyPress } from '@frontend/common'
import React, { useCallback, useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { useHistory } from 'react-router-dom'
import styled from 'styled-components/macro'
import { clearPatientError, getPatient } from '../../store/patient/patientActions'
import PatientSearchError from './PatientSearchError'

const FormWrapper = styled.div`
  display: flex;
  align-items: center;
`

const PatientSearch: React.FC = () => {
  const [patientId, setPatientId] = useState('')
  const dispatch = useDispatch()
  const enterPress = useKeyPress('Enter')
  const history = useHistory()

  const onSubmit = useCallback(() => {
    dispatch(getPatient(patientId))
    history.push(`/create/${patientId}`)
  }, [dispatch, history, patientId])

  useEffect(() => {
    if (enterPress && isPersonIdValid(patientId)) {
      onSubmit()
    }
  }, [enterPress, onSubmit, patientId])

  const onChange = (formattedPatientId: string) => {
    dispatch(clearPatientError())
    setPatientId(formattedPatientId)
    if (formattedPatientId.length === 0) {
      onFocus()
    }
  }

  const onFocus = () => {
    dispatch(clearPatientError())
  }

  return (
    <>
      <h2>Patientens personnummer eller samordningsnummer</h2>
      <FormWrapper className="iu-mt-300">
        <PersonIdInput onFormattedChange={onChange} value={patientId} onFocus={onFocus} />
        <CustomButton
          text="Fortsätt"
          disabled={!isPersonIdValid(patientId)}
          buttonStyle="primary"
          onClick={onSubmit}
          tooltip="Gå vidare för att skapa eller söka efter intyg för patienten."
          inline={true}
        />
      </FormWrapper>
      <PatientSearchError />
    </>
  )
}
export default PatientSearch
