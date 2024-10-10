import type React from 'react'
import { useSelector } from 'react-redux'
import styled from 'styled-components'
import { getQrCodeForElegSignature, getSigningStatus } from '../../../store/certificate/certificateSelectors'
import { getUser } from '../../../store/user/userSelectors'
import ModalBase from '../../../components/utils/Modal/ModalBase'
import { bankIdLogoImage } from '../../../images'
import { CertificateSignStatus, SigningMethod } from '../../../types'
import QRCode from '../../../components/qrcode/QRCode'
import { useAppDispatch, useAppSelector } from '../../../store/store'
import { CustomButton } from '../../../components/Inputs/CustomButton'
import InfoBox from '../../../components/utils/InfoBox'
import { Link } from 'react-router-dom'
import ExternalLinkIcon from '../../../components/image/image/ExternalLinkIcon'
import { startSignCertificate } from '../../../store/certificate/certificateActions'

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
  const qrCode = useAppSelector((state) => getQrCodeForElegSignature(state))
  const dispatch = useAppDispatch()

  const handleClose = () => {
    return
  }

  if (signStatus == CertificateSignStatus.FAILED) {
    return (
      <ModalBase
        open={open}
        focusTrap={false}
        handleClose={handleClose}
        title={'Någonting gick fel'}
        buttons={
          <>
            <CustomButton buttonStyle="primary" text="Försök igen" onClick={() => dispatch(startSignCertificate())} />
            <CustomButton text="Avbryt" onClick={handleClose} />
          </>
        }
        content={
          <>
            <InfoBox type="error">
              Signeringen avbröts, eller tog för lång tid. Av säkerhetsskäl finns det en tidsbegränsning. <br /> Vänligen försök igen.
            </InfoBox>
            <h5 className="ids-heading-h5 iu-pt-500 iu-pb-200">Problem att signera?</h5>
            <Link target="_blank" to="https://test.bankid.com/">
              Här kan du testa att ditt BankID fungerar om du har problem med att signera.
              <ExternalLinkIcon className="iu-ml-200 iu-fs-100" />
            </Link>
          </>
        }
      />
    )
  }

  return (
    <ModalBase
      open={open}
      focusTrap={false}
      handleClose={handleClose}
      title="Signera intyget med BankID"
      buttons={<CustomButton text={'Avbryt'} onClick={handleClose} />}
      content={
        <>
          {signingMethod === SigningMethod.BANK_ID && (
            <div className="iu-flex-center">
              <BankIDLogo src={bankIdLogoImage} alt="BankID Logo" />
            </div>
          )}
          {signingMethod != SigningMethod.MOBILT_BANK_ID && (
            <>
              <div className="iu-flex-center">
                <QRCode qrCode={qrCode} />
              </div>
              <h5 className="ids-heading-h5 iu-pb-200">För att signera intyget</h5>
              <div className="ml-5">
                <p>1. Öppna appen för BankID.</p>
                <p>2. Tryck på QR-symbolen i appen för BankID.</p>
                <p>3. Rikta kameran mot QR-koden ovan.</p>
                <p>4. Följ instruktionerna i appen för att signera.</p>
              </div>
            </>
          )}
          <></>
        </>
      }
    />
  )
}
