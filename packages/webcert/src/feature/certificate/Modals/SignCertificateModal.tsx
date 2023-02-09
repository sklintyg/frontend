import { CertificateSignStatus, LoginMethod, ModalBase, SigningMethod, Spinner } from '@frontend/common'
import bankIDLogo from '@frontend/common/src/images/BankID_logo.svg'
import React from 'react'
import { useSelector } from 'react-redux'
import styled from 'styled-components'
import { getSigningStatus } from '../../../store/certificate/certificateSelectors'
import { getUser } from '../../../store/user/userSelectors'

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

export const SignCertificateModal: React.FC = () => {
  const signStatus = useSelector(getSigningStatus)
  const user = useSelector(getUser)
  const open = signStatus !== CertificateSignStatus.INITIAL
  const signingMethod = user?.signingMethod
  const isMobile = user?.loginMethod === LoginMethod.BANK_ID_MOBILE

  const handleClose = () => {
    return
  }

  return (
    <WideModalBase
      open={open}
      focusTrap={false}
      handleClose={handleClose}
      title={'Ditt intyg signeras'}
      buttons={null}
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
          <>
            {signStatus !== CertificateSignStatus.PROCESSING && signStatus !== CertificateSignStatus.NO_CLIENT && (
              <p>Detta kan ta några sekunder.</p>
            )}
            {signStatus === CertificateSignStatus.NO_CLIENT && <p>{isMobile ? NO_CLIENT_MOBILE : NO_CLIENT_DESKTOP}</p>}
            {signStatus === CertificateSignStatus.PROCESSING && <p>{isMobile ? PROCESSING_MOBILE : PROCESSING_DESKTOP}</p>}
          </>
        </>
      }
    />
  )
}
