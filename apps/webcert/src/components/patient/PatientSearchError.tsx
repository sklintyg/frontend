import type React from 'react'
import { useSelector } from 'react-redux'
import styled from 'styled-components'
import { ErrorCode } from '../../store/error/errorReducer'
import { getPatientError } from '../../store/patient/patientSelectors'
import WCDynamicLink from '../../utils/WCDynamicLink'
import ErrorCopyText from '../error/ErrorCopyText'
import InfoBox from '../utils/InfoBox'

const Wrapper = styled.div`
  max-width: 720px;
`

const PatientSearchError = () => {
  const error = useSelector(getPatientError)

  if (!error) {
    return null
  }

  const getContent = () => {
    if (error.errorCode === ErrorCode.GETTING_PATIENT_ERROR) {
      return (
        <p>
          På grund av tekniskt fel gick det inte att hämta personuppgifter, försök igen om en liten stund. Om problemet kvarstår, kontakta i
          första hand din lokala IT-avdelning och i andra hand <WCDynamicLink linkKey={'ineraKundserviceAnmalFel'} />.
        </p>
      )
    } else if (error.errorCode === ErrorCode.PATIENT_NOT_FOUND) {
      return (
        <p>
          Personnumret du har angivit finns inte i folkbokföringsregistret. Kontrollera om du har skrivit rätt. Observera att det inte går
          att ange reservnummer. Webcert hanterar enbart person- och samordningsnummer.
        </p>
      )
    } else if (error.errorCode === ErrorCode.INVALID_PATIENT_ID) {
      return <p>Ange ett giltigt person- eller samordningsnummer.</p>
    } else if (error.errorCode === ErrorCode.PU_PROBLEM) {
      return (
        <>
          <p>
            Personuppgiftstjänsten svarar inte. Åtgärden kan inte genomföras eftersom den kräver att personuppgifter kan hämtas från
            personuppgiftsregistret. Prova igen om en stund.
          </p>
          <p>
            Om problemet kvarstår, kontakta i första hand din lokala IT-avdelning och i andra hand{' '}
            <WCDynamicLink linkKey={'ineraKundserviceAnmalFel'} />.
          </p>
        </>
      )
    } else if (error.errorCode === ErrorCode.PATIENT_NO_NAME) {
      return <p>Förnamn eller efternamn för det personnummer du har angett kunde tyvärr inte hämtas från folkbokföringsregistret.</p>
    }
  }

  return (
    <Wrapper>
      <InfoBox type="error" additionalStyles="iu-mt-300" activateIconWrap>
        {getContent()}
      </InfoBox>
      {error.errorId && (error.errorCode === ErrorCode.GETTING_PATIENT_ERROR || error.errorCode === ErrorCode.PU_PROBLEM) && (
        <ErrorCopyText errorId={error.errorId} />
      )}
    </Wrapper>
  )
}

export default PatientSearchError
