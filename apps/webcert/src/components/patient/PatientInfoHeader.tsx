import type React from 'react'
import { useDispatch } from 'react-redux'
import { useHistory } from 'react-router-dom'
import styled from 'styled-components'
import { swapImage, userImage } from '../../images'
import { clearPatient } from '../../store/patient/patientActions'
import { BoxShadowContainer } from '../../styles'
import type { Patient } from '../../types'
import { CustomButton } from '../Inputs/CustomButton'
import PatientStatuses from '../notification/PatientStatuses'

interface Props {
  patient: Patient
}

const ButtonWrapper = styled.div`
  margin-top: auto;
`

const PatientInfoHeader: React.FC<Props> = ({ patient }) => {
  const dispatch = useDispatch()
  const history = useHistory()

  const onSwitchPatient = () => {
    dispatch(clearPatient())
    history.push('/search')
  }

  return (
    <BoxShadowContainer>
      <div className="ic-container iu-flex iu-py-400">
        <img src={userImage} alt="patient" className="iu-mr-300" />
        <div>
          <h3 className="iu-mb-200">Patientuppgifter</h3>
          <div className="iu-flex">
            <h2>
              {patient.fullName} - {patient.personId.id}
            </h2>
            <ButtonWrapper>
              <CustomButton
                text="Byt patient"
                buttonStyle="primary"
                onClick={onSwitchPatient}
                className="iu-ml-500"
                tooltip="Byt patient att skriva och söka intyg för."
                startIcon={<img src={swapImage} alt="Byt patient" />}
              />
            </ButtonWrapper>
          </div>
          <PatientStatuses patient={patient} />
        </div>
      </div>
    </BoxShadowContainer>
  )
}
export default PatientInfoHeader
