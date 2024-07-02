import type React from 'react'
import { useCallback, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'
import styled from 'styled-components'
import { clearPatientError, getPatient } from '../../store/patient/patientActions'
import { getActivePatient } from '../../store/patient/patientSelectors'
import PatientSearchError from './PatientSearchError'
import { useKeyPress, isPersonIdValid } from '../../utils'
import { CustomButton } from '../Inputs/CustomButton'
import PersonIdInput from '../Inputs/PersonIdInput'

const FormWrapper = styled.div`
  display: flex;
  align-items: center;
`

const PatientSearch: React.FC = () => {
  const [patientId, setPatientId] = useState('')
  const patient = useSelector(getActivePatient)
  const dispatch = useDispatch()
  const enterPress = useKeyPress('Enter')
  const history = useHistory()

  const onSubmit = useCallback(() => {
    dispatch(getPatient(patientId))
  }, [dispatch, patientId])

  useEffect(() => {
    if (enterPress && isPersonIdValid(patientId)) {
      onSubmit()
    }
  }, [enterPress, onSubmit, patientId])

  useEffect(() => {
    if (patient) {
      history.push(`/create/${patientId}`)
    }
  }, [patient, history, patientId])

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
