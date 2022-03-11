import { InfoBox } from '@frontend/common'
import WCDynamicLink from '../utils/WCDynamicLink'
import React from 'react'
import { useSelector } from 'react-redux'
import { ErrorCode } from '../../store/error/errorReducer'
import ErrorCopyText from '../error/ErrorCopyText'
import { getPatientError } from '../../store/patient/patientSelectors'
import styled from 'styled-components/macro'

const Wrapper = styled.div`
  max-width: 720px;
`

const PatientSearchError: React.FC = () => {
  const error = useSelector(getPatientError)

  if (!error) {
    return null
  }

  const getContent = () => {
    if (error.errorCode === ErrorCode.GETTING_PATIENT_ERROR) {
      return (
        <>
          På grund av tekniskt fel gick det inte att hämta personuppgifter, försök igen om en liten stund. Om problemet kvarstår, kontakta i
          första hand din lokala IT-avdelning och i andra hand <WCDynamicLink linkKey={'ineraKundserviceAnmalFel'} />.
        </>
      )
    } else if (error.errorCode === ErrorCode.PATIENT_NOT_FOUND) {
      return (
        <>
          Personnumret du har angivit finns inte i folkbokföringsregistret. Kontrollera om du har skrivit rätt. Observera att det inte går
          att ange reservnummer. Webcert hanterar enbart person- och samordningsnummer.
        </>
      )
    }
  }

  return (
    <Wrapper>
      <InfoBox type={'error'} additionalStyles={'iu-mt-300'} activateIconWrap>
        <p>{getContent()}</p>
      </InfoBox>
      {error.errorId && <ErrorCopyText errorId={error.errorId} />}
    </Wrapper>
  )
}

export default PatientSearchError
