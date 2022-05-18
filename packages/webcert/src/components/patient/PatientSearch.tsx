import React, { useCallback, useEffect, useState } from 'react'
import { CustomButton } from '@frontend/common'
import { isPersonIdValid } from '@frontend/common/src/utils/personIdValidatorUtils'
import styled from 'styled-components/macro'
import { useDispatch } from 'react-redux'
import { clearPatientError, getPatient } from '../../store/patient/patientActions'
import PatientSearchError from './PatientSearchError'
import { useKeyPress } from '@frontend/common/src/utils/userFunctionUtils'
import PersonIdInput from '@frontend/common/src/components/Inputs/PersonIdInput'

const FormWrapper = styled.div`
  display: flex;
  align-items: center;
`

const PatientSearch: React.FC = () => {
  const [patientId, setPatientId] = useState('')
  const dispatch = useDispatch()
  const enterPress = useKeyPress('Enter')

  const onSubmit = useCallback(() => {
    dispatch(getPatient(patientId))
  }, [dispatch, patientId])

  useEffect(() => {
    if (enterPress && isPersonIdValid(patientId)) {
      onSubmit()
    }
  }, [enterPress, onSubmit])

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
    <div className="ic-container iu-p-400">
      <h2>Patientens personnummer eller samordningsnummer</h2>
      <FormWrapper className="iu-mt-300">
        <PersonIdInput onFormattedChange={onChange} value={patientId} onFocus={onFocus} />
        <CustomButton
          text="Fortsätt"
          disabled={!isPersonIdValid(patientId)}
          buttonStyle="primary"
          onClick={onSubmit}
          tooltip="Gå vidare för att skapa eller söka efter intyg för patienten."
        />
      </FormWrapper>
      <PatientSearchError />
    </div>
  )
}
export default PatientSearch
