import { CertificateSignStatus, CustomButton, LoginMethod, ModalBase, SigningMethod, Spinner } from '@frontend/common'
import bankIDLogo from '@frontend/common/src/images/BankID_logo.svg'
import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import styled from 'styled-components'
import { messageSubstring } from '../../../components/error/modals/errorUtils'
import { updateCertificateSignStatus } from '../../../store/certificate/certificateActions'
import { getCertificate, getSigningError, getSigningStatus } from '../../../store/certificate/certificateSelectors'
import { ErrorCode, ErrorData } from '../../../store/error/errorReducer'
import { getUser } from '../../../store/user/userSelectors'
import WCDynamicLink from '../../../utils/WCDynamicLink'

const NO_CLIENT_MOBILE = 'Mobilt BankID-servern får ej kontakt med din enhet. Kontrollera att du har startat Mobilt BankID på din enhet.'
const NO_CLIENT_DESKTOP =
  'BankID-servern får ej kontakt med ditt BankID säkerhetsprogram. Kontrollera att du har startat BankID säkerhetsprogram på din dator.'
const PROCESSING_MOBILE = 'Starta mobilt BankID på den enhet du har det installerat.'
const PROCESSING_DESKTOP = 'Om ditt BankID säkerhetsprogram inte öppnas automatiskt kan du behöva starta det själv.'

const WideModalBase = styled(ModalBase)`
  max-width: 50rem !important;
`

const BankIDLogo = styled.img`
  width: 60%;
`

const SignCertificateErrorMessage: React.FC<ErrorData> = ({ errorCode, message }) => {
  const certificate = useSelector(getCertificate)
  const certificateType = certificate?.metadata.type

  switch (errorCode) {
    case ErrorCode.PU_PROBLEM:
      return (
        <>
          <p>
            Personuppgiftstjänsten svarar inte. Åtgärden kan inte genomföras eftersom den kräver att personuppgifter kan hämtas från
            personuppgiftsregistret. Prova igen om en stund.
          </p>
          <p>
            Om problemet kvarstår, kontakta i första hand din lokala IT-avdelning och i andra hand{' '}
            <WCDynamicLink linkKey="ineraKundserviceAnmalFel" />.
          </p>
        </>
      )
    case ErrorCode.DATA_NOT_FOUND:
      return (
        <p>
          <strong>Intyget finns inte.</strong>
        </p>
      )
    case ErrorCode.INVALID_STATE:
      return (
        <>
          <p>Signeringen kunde inte slutföras. Intyget har inte signerats. Prova att ladda om sidan och försök igen.</p>
          <p>
            Om problemet kvarstår, kontakta i första hand din lokala IT-avdelning och i andra hand{' '}
            <WCDynamicLink linkKey="ineraKundserviceAnmalFel" />.
          </p>
        </>
      )
    case ErrorCode.SIGN_NETID_ERROR:
      return (
        <>
          <p>Intyget har inte signerats. Detta beror antingen på ett tekniskt fel eller att signeringen avbrutits.</p>
          <p>
            Prova igen om en stund. Om problemet kvarstår, kontakta i första hand din lokala IT-avdelning och i andra hand{' '}
            <WCDynamicLink linkKey="ineraKundserviceAnmalFel" />.
          </p>
        </>
      )
    case ErrorCode.CONCURRENT_MODIFICATION:
      return (
        <>
          <p>
            <strong>Det går inte att signera utkastet.</strong>
          </p>
          <p>
            Utkastet har ändrats av en annan användare sedan du började arbeta på det. Ladda om sidan, kontrollera att uppgifterna stämmer
            och försök signera igen.
          </p>
          <p>Utkastet ändrades av {messageSubstring({ message: message ?? '' })}.</p>
        </>
      )
    case ErrorCode.AUTHORIZATION_PROBLEM:
      return (
        <>
          <p>
            <strong>Intyget kunde inte signeras.</strong>
          </p>
          <p>Du saknar behörighet att signera detta intyg.</p>
        </>
      )
    case ErrorCode.INDETERMINATE_IDENTITY:
      return (
        <>
          <p>
            <strong>Intyget kunde inte signeras.</strong>
          </p>
          <p>
            Det verkar som att du valt en annan identitet att signera med än den du loggade in med. Du måste identifiera dig på samma sätt
            som när du loggade in. Kontrollera om du har valt rätt och prova igen.
          </p>
        </>
      )
    case ErrorCode.INTYG_FROM_OTHER_VARDGIVARE_EXISTS: {
      switch (certificateType) {
        case 'db':
          return (
            <p>
              Dödsbevis för detta personnummer har utfärdats av någon annan hos annan vårdgivare under tiden du har arbetat med detta
              utkast. Det är inte möjligt att signera detta dödsbevis.
            </p>
          )
        case 'doi':
          return (
            <p>
              Dödsorsaksintyg för detta personnummer har utfärdats av någon annan hos annan vårdgivare under tiden du har arbetat med detta
              utkast. Senast skapade dödsorsaksintyg är det som gäller. Om du fortsätter och lämnar in dödsorsaksintyget så blir det därför
              detta dödsorsaksintyg som gäller.
            </p>
          )
      }
      break
    }
    case ErrorCode.INTYG_FROM_SAME_VARDGIVARE_EXISTS: {
      switch (certificateType) {
        case 'db':
          return (
            <p>
              Dödsbevis för detta personnummer har utfärdats av någon annan under tiden du har arbetat med detta utkast. Du kan inte signera
              detta dödsbevis men kan däremot välja att ersätta det befintliga dödsbeviset.
            </p>
          )
        case 'doi':
          return (
            <p>
              Dödsorsaksintyg för detta personnummer har utfärdats av någon annan under tiden du har arbetat med detta utkast. Du kan inte
              signera detta dödsorsaksintyg men kan däremot välja att ersätta det befintliga dödsorsaksintyget.
            </p>
          )
      }
      break
    }
    case ErrorCode.GRP_PROBLEM: {
      switch (message) {
        case 'ALREADY_IN_PROGRESS':
          return (
            <p>
              <strong>Intyget kunde inte signeras.</strong>
              <br />
              En inloggning eller underskrift för det här personnumret är redan påbörjad, tryck avbryt i BankID säkerhetsapp och försök
              igen.
            </p>
          )
        case 'USER_CANCEL':
        case 'CANCELLED':
          return (
            <p>
              <strong>Intyget kunde inte signeras.</strong>
              <br />
              Åtgärden avbruten.
            </p>
          )
      }
    }
  }

  return (
    <p>
      Intyget har inte signerats. Detta beror antingen på ett tekniskt fel eller att signeringen avbrutits. <br />
      Prova igen om en stund. Om problemet kvarstår, kontakta i första hand din lokala IT-avdelning och i andra hand{' '}
      <WCDynamicLink linkKey="ineraKundserviceAnmalFel" />.
    </p>
  )
}

export const SignCertificateModal: React.FC = () => {
  const dispatch = useDispatch()
  const signStatus = useSelector(getSigningStatus)
  const signingError = useSelector(getSigningError)
  const user = useSelector(getUser)
  const hasFailed = signStatus === CertificateSignStatus.FAILED
  const open = signStatus !== CertificateSignStatus.INITIAL
  const signingMethod = user?.signingMethod
  const isMobile = user?.loginMethod === LoginMethod.BANK_ID_MOBILE

  const handleClose = () => {
    if (hasFailed) {
      dispatch(updateCertificateSignStatus(CertificateSignStatus.INITIAL))
    }
  }

  return (
    <WideModalBase
      open={open}
      focusTrap={hasFailed}
      handleClose={handleClose}
      title={hasFailed ? 'Signering misslyckad' : 'Ditt intyg signeras'}
      buttons={hasFailed ? <CustomButton onClick={handleClose}>Stäng</CustomButton> : null}
      content={
        <>
          {signingMethod === SigningMethod.BANK_ID && (
            <div className="iu-flex-center">
              <BankIDLogo src={bankIDLogo} alt="BankID Logo" />
            </div>
          )}

          <div className="iu-flex-center">
            <Spinner className="iu-mb-300" />
          </div>

          {hasFailed && signingError ? (
            <SignCertificateErrorMessage {...signingError} />
          ) : (
            <>
              {signStatus !== CertificateSignStatus.PROCESSING && signStatus !== CertificateSignStatus.NO_CLIENT && (
                <p>Detta kan ta några sekunder.</p>
              )}
              {signStatus === CertificateSignStatus.NO_CLIENT && <p>{isMobile ? NO_CLIENT_MOBILE : NO_CLIENT_DESKTOP}</p>}
              {signStatus === CertificateSignStatus.PROCESSING && <p>{isMobile ? PROCESSING_MOBILE : PROCESSING_DESKTOP}</p>}
            </>
          )}
        </>
      }
    />
  )
}
