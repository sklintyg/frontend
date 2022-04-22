import React from 'react'
import { CustomButton, Patient } from '@frontend/common'
import userImage from '@frontend/common/src/images/user-image.svg'
import { BoxShadowContainer } from '@frontend/common/src/styles/styledComponents'
import { useDispatch } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { changePatient } from '../../store/patient/patientActions'
import styled from 'styled-components/macro'

interface Props {
  patient: Patient
}

const ButtonWrapper = styled.div`
  margin-top: auto;
`

const PatientInfoHeader: React.FC<Props> = ({ patient }) => {
  const dispatch = useDispatch()
  const history = useHistory()

  const switchPatient = () => {
    dispatch(changePatient(history))
  }

  return (
    <BoxShadowContainer>
      <div className={'ic-container iu-flex iu-py-400'}>
        <img src={userImage} alt="userImage" className={'iu-mr-300'} />
        <div>
          <h3 className={'iu-mb-200'}>Patientuppgifter</h3>
          <h2>
            {patient.fullName} - {patient.personId.id}{' '}
          </h2>
        </div>
        <ButtonWrapper>
          <CustomButton
            text="Byt patient"
            buttonStyle={'primary'}
            onClick={switchPatient}
            className={'iu-ml-500'}
            tooltip={'Byt patient för att skriva och söka intyg för.'}
          />
        </ButtonWrapper>
      </div>
    </BoxShadowContainer>
  )
}
export default PatientInfoHeader
