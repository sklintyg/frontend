import { TextInput } from '@frontend/common'
import React from 'react'
import { useSelector } from 'react-redux'
import styled from 'styled-components/macro'
import { getPatient } from '../../../store/certificate/certificateSelectors'
import CategoryHeader from '../Category/CategoryHeader'
import CategoryTitle from '../Category/CategoryTitle'
import QuestionWrapper from '../Question/QuestionWrapper'

const Wrapper = styled.div`
  align-items: center;
`

const ZipCodeInput = styled(TextInput)`
  max-width: 6.5em;
`

const CityInput = styled(TextInput)`
  max-width: 20em;
`

const PatientAddress: React.FC = () => {
  const patient = useSelector(getPatient)

  if (!patient) {
    return null
  }

  return (
    <>
      <CategoryHeader>
        <CategoryTitle titleId="patientensadress">Patientens adressuppgifter</CategoryTitle>
      </CategoryHeader>
      <QuestionWrapper>
        <Wrapper className="iu-grid-cols iu-grid-cols-12">
          <div className="iu-grid-span-3">
            <label htmlFor="patientAddress">Postadress</label>
          </div>
          <div className="iu-grid-span-9">
            <TextInput
              disabled={true}
              onChange={() => {
                return
              }}
              name="patientAddress"
              id="patientAddress"
              value={patient.street}
            />
          </div>

          <div className="iu-grid-span-3">
            <label htmlFor="patientZipCode">Postnummer</label>
          </div>
          <div className="iu-grid-span-9">
            <ZipCodeInput
              disabled={true}
              onChange={() => {
                return
              }}
              name="patientZipCode"
              id="patientZipCode"
              value={patient.zipCode}
            />
          </div>

          <div className="iu-grid-span-3">
            <label htmlFor="patientCity">Postort</label>
          </div>
          <div className="iu-grid-span-9">
            <CityInput
              disabled={true}
              onChange={() => {
                return
              }}
              name="patientCity"
              id="patientCity"
              value={patient.city}
            />
          </div>
        </Wrapper>
      </QuestionWrapper>
    </>
  )
}

export default PatientAddress
