import React, { useEffect, useState } from 'react'
import { CustomButton } from '@frontend/common'
import { isPersonIdValid } from '@frontend/common/src/utils/personIdValidatorUtils'
import styled from 'styled-components/macro'
import { useDispatch } from 'react-redux'
import { getPatient } from '../../store/patient/patientActions'
import { useHistory } from 'react-router-dom'
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
  const history = useHistory()
  const enterPress = useKeyPress('Enter')

  useEffect(() => {
    onSubmit()
  }, [enterPress])

  const onChange = (formattedPatientId: string) => {
    setPatientId(formattedPatientId)
  }

  const onSubmit = () => {
    dispatch(getPatient({ patientId: patientId.replace('-', ''), history: history }))
  }

  return (
    <div className="ic-container iu-p-400">
      <h2>Patientens personnummer eller samordningsnummer</h2>
      <FormWrapper className="iu-mt-300">
        <PersonIdInput onFormattedChange={onChange} value={patientId} />
        <CustomButton text="Fortsätt" disabled={!isPersonIdValid(patientId)} buttonStyle="primary" onClick={onSubmit} />
      </FormWrapper>
      <PatientSearchError />
    </div>
  )
}
export default PatientSearch
