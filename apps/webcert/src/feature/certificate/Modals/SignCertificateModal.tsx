import type React from 'react'
import { useState } from 'react'
import { useSelector } from 'react-redux'
import styled from 'styled-components'
import { getQrCodeForElegSignature, getSigningStatus } from '../../../store/certificate/certificateSelectors'
import { getUser } from '../../../store/user/userSelectors'
import ModalBase from '../../../components/utils/Modal/ModalBase'
import { bankIdLogoImage } from '../../../images'
import { CertificateSignStatus, SigningMethod } from '../../../types'
import QRCode from '../../../components/qrcode/QRCode'
import { useAppSelector } from '../../../store/store'
import { CustomButton } from '../../../components/Inputs/CustomButton'

const BankIDLogo = styled.img`
  width: 60%;
`

export const SignCertificateModal: React.FC = () => {
  const signStatus = useSelector(getSigningStatus)
  const user = useSelector(getUser)
  const signingMethod = user?.signingMethod
  const qrCode = useAppSelector((state) => getQrCodeForElegSignature(state))
  const [open, setOpen] = useState(true)

  const handleClose = () => {
    setOpen(false)
  }

  return (
    <ModalBase
      open={
        open &&
        signStatus !== CertificateSignStatus.INITIAL &&
        signStatus !== CertificateSignStatus.FAILED &&
        signStatus !== CertificateSignStatus.UNKNOWN
      }
      focusTrap={false}
      handleClose={handleClose}
      title="Signera intyget med BankID"
      buttons={<CustomButton text={'Avbryt'} onClick={() => setOpen(false)} />}
      content={
        <>
          {signingMethod === SigningMethod.BANK_ID && (
            <div className="iu-flex-center">
              <BankIDLogo src={bankIdLogoImage} alt="BankID Logo" />
            </div>
          )}
          {signingMethod == SigningMethod.MOBILT_BANK_ID && (
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
